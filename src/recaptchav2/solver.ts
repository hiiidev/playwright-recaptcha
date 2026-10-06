import type { Page, Response, APIResponse } from 'playwright';
import {
  CapSolverError,
  RecaptchaNotFoundError,
  RecaptchaRateLimitError,
  RecaptchaSolveError,
} from '../errors.ts';
import { RecaptchaBox } from './recaptcha-box.ts';
import {
  OBJECT_TRANSLATIONS,
  ORIGINAL_LANGUAGE_AUDIO,
} from './translations.ts';
import {
  convertMp3ToFlac,
  transcribeWithGoogle,
  type AudioTranscriber,
} from './audio.ts';

export interface RecaptchaV2Options {
  attempts?: number;
  capsolverApiKey?: string;
  ffmpegPath?: string;
  transcribeAudio?: AudioTranscriber;
  /**
   * Whether to simulate human typing character-by-character with realistic delays.
   * Default: true.
   */
  humanTyping?: boolean;
  /**
   * Delay range between keystrokes in milliseconds [min, max].
   * Default: [60, 160].
   */
  typingDelay?: [number, number];
}

export interface SolveV2Options {
  attempts?: number;
  wait?: boolean;
  waitTimeout?: number;
  imageChallenge?: boolean;
}

const OBJECT_ID_MAP: Record<string, readonly string[]> = {
  '/m/0pg52': OBJECT_TRANSLATIONS.taxis,
  '/m/01bjv': OBJECT_TRANSLATIONS.bus,
  '/m/04_sv': OBJECT_TRANSLATIONS.motorcycles,
  '/m/013xlm': OBJECT_TRANSLATIONS.tractors,
  '/m/01jk_4': OBJECT_TRANSLATIONS.chimneys,
  '/m/014xcs': OBJECT_TRANSLATIONS.crosswalks,
  '/m/015qff': OBJECT_TRANSLATIONS.traffic_lights,
  '/m/0199g': OBJECT_TRANSLATIONS.bicycles,
  '/m/015qbp': OBJECT_TRANSLATIONS.parking_meters,
  '/m/0k4j': OBJECT_TRANSLATIONS.cars,
  '/m/015kr': OBJECT_TRANSLATIONS.bridges,
  '/m/019jd': OBJECT_TRANSLATIONS.boats,
  '/m/0cdl1': OBJECT_TRANSLATIONS.palm_trees,
  '/m/09d_r': OBJECT_TRANSLATIONS.mountains_or_hills,
  '/m/01pns0': OBJECT_TRANSLATIONS.fire_hydrant,
  '/m/01lynh': OBJECT_TRANSLATIONS.stairs,
};

export class RecaptchaV2Solver {
  private page: Page;
  private attempts: number;
  private capsolverApiKey?: string;
  private ffmpegPath: string;
  private customTranscriber?: AudioTranscriber;
  private humanTyping: boolean;
  private typingDelay: [number, number];

  private token: string | null = null;
  private payloadResponse: Response | APIResponse | null = null;

  constructor(page: Page, options: RecaptchaV2Options = {}) {
    this.page = page;
    this.attempts = options.attempts ?? 5;
    this.capsolverApiKey = options.capsolverApiKey ?? process.env.CAPSOLVER_API_KEY;
    this.ffmpegPath = options.ffmpegPath ?? 'ffmpeg';
    this.customTranscriber = options.transcribeAudio;
    this.humanTyping = options.humanTyping ?? true;
    this.typingDelay = options.typingDelay ?? [60, 160];

    this.page.on('response', this.handleResponse);
  }

  public close(): void {
    try {
      this.page.off('response', this.handleResponse);
    } catch {
      // Ignore if listener already removed
    }
  }

  public [Symbol.asyncDispose](): Promise<void> | void {
    this.close();
  }

  private handleResponse = async (response: Response): Promise<void> => {
    const url = response.url();
    if (/\/recaptcha\/(api2|enterprise)\/payload/.test(url) && this.payloadResponse === null) {
      this.payloadResponse = response;
    } else if (/\/recaptcha\/(api2|enterprise)\/userverify/.test(url)) {
      try {
        const text = await response.text();
        const tokenMatch = /"uvresp","(.*?)"/.exec(text);
        if (tokenMatch && tokenMatch[1]) {
          this.token = tokenMatch[1];
        }
      } catch {
        // Response stream could be interrupted
      }
    }
  };

  private async getTaskObject(recaptchaBox: RecaptchaBox): Promise<string | null> {
    const taskTexts = await recaptchaBox.bframeFrame.locator('div').allInnerTexts();
    if (taskTexts.length === 0) return null;

    const lines = taskTexts[0].split('\n');
    if (lines.length < 2) return null;

    const objectName = lines[1].trim();
    for (const [id, translations] of Object.entries(OBJECT_ID_MAP)) {
      if (translations.includes(objectName)) {
        return id;
      }
    }

    return null;
  }

  private async getCapsolverResponse(
    recaptchaBox: RecaptchaBox,
    imageData: Buffer
  ): Promise<any> {
    const imageBase64 = imageData.toString('base64');
    const taskObject = await this.getTaskObject(recaptchaBox);

    if (taskObject === null) {
      return null;
    }

    const payload = {
      clientKey: this.capsolverApiKey,
      task: {
        type: 'ReCaptchaV2Classification',
        image: imageBase64,
        question: taskObject,
      },
    };

    const response = await this.page.request.post('https://api.capsolver.com/createTask', {
      data: payload,
    });

    let responseJson: any;
    try {
      responseJson = await response.json();
    } catch {
      throw new CapSolverError();
    }

    if (responseJson.errorId !== 0) {
      throw new CapSolverError(responseJson.errorDescription);
    }

    return responseJson;
  }

  private async solveTiles(recaptchaBox: RecaptchaBox, indexes: number[]): Promise<void> {
    const changingTiles = new Map<number, string>();
    const styleScript = `(element) => {
      element.style = "";
      element.className = "rc-imageselect-tile";
    }`;

    for (const index of indexes) {
      const tile = recaptchaBox.tileSelector.nth(index);
      await tile.click();

      const className = await tile.getAttribute('class');
      if (!className || !className.includes('rc-imageselect-dynamic-selected')) {
        continue;
      }

      const src = await tile.locator('img').getAttribute('src');
      if (src) {
        changingTiles.set(index, src);
        await tile.evaluate(styleScript);
      }
    }

    const startTime = Date.now();
    while (changingTiles.size > 0 && Date.now() - startTime < 60000) {
      for (const [index, oldUrl] of Array.from(changingTiles.entries())) {
        const tile = recaptchaBox.tileSelector.nth(index);
        const imageUrl = await tile.locator('img').getAttribute('src');

        if (oldUrl === imageUrl || !imageUrl) {
          continue;
        }

        changingTiles.set(index, imageUrl);
        const response = await this.page.request.get(imageUrl);
        const body = await response.body();

        const capsolverResponse = await this.getCapsolverResponse(recaptchaBox, body);

        if (!capsolverResponse || !capsolverResponse.solution?.hasObject) {
          changingTiles.delete(index);
          continue;
        }

        await tile.click();
        await tile.evaluate(styleScript);
      }

      await this.page.waitForTimeout(250);
    }
  }

  private async transcribeAudio(
    audioUrl: string,
    language: string = 'en-US'
  ): Promise<string | null> {
    const response = await this.page.request.get(audioUrl);
    const mp3Buffer = await response.body();

    if (this.customTranscriber) {
      return this.customTranscriber(mp3Buffer, language);
    }

    try {
      const flacBuffer = await convertMp3ToFlac(mp3Buffer, this.ffmpegPath);
      return await transcribeWithGoogle(flacBuffer, language);
    } catch {
      return null;
    }
  }

  private async clickCheckbox(recaptchaBox: RecaptchaBox): Promise<void> {
    await recaptchaBox.checkbox.click();

    while (recaptchaBox.framesAreAttached() && this.token === null) {
      if (await recaptchaBox.rateLimitIsVisible()) {
        throw new RecaptchaRateLimitError();
      }

      if (await recaptchaBox.anyChallengeIsVisible()) {
        return;
      }

      await this.page.waitForTimeout(250);
    }
  }

  private async getAudioUrl(recaptchaBox: RecaptchaBox): Promise<string> {
    while (true) {
      if (await recaptchaBox.rateLimitIsVisible()) {
        throw new RecaptchaRateLimitError();
      }

      if (await recaptchaBox.audioChallengeIsVisible()) {
        const href = await recaptchaBox.audioDownloadButton.getAttribute('href');
        if (href) {
          return href;
        }
      }

      await this.page.waitForTimeout(250);
    }
  }

  private async submitAudioText(recaptchaBox: RecaptchaBox, text: string): Promise<void> {
    if (this.humanTyping) {
      // 1. 点击输入框获取焦点
      await recaptchaBox.audioChallengeTextbox.click();

      // 2. 模拟听完语音后的短暂思考与停顿
      await this.page.waitForTimeout(Math.floor(Math.random() * 200) + 150);

      // 3. 逐字手打输入，带随机按键间隔微抖动
      const [minDelay, maxDelay] = this.typingDelay;
      for (const char of text) {
        if (typeof (recaptchaBox.audioChallengeTextbox as any).pressSequentially === 'function') {
          await (recaptchaBox.audioChallengeTextbox as any).pressSequentially(char);
        } else {
          await (recaptchaBox.audioChallengeTextbox as any).type(char);
        }
        const delay = Math.floor(Math.random() * (maxDelay - minDelay)) + minDelay;
        await this.page.waitForTimeout(delay);
      }

      // 4. 输入完成后模拟核对停顿，再点击确认
      await this.page.waitForTimeout(Math.floor(Math.random() * 300) + 200);
    } else {
      await recaptchaBox.audioChallengeTextbox.fill(text);
    }

    const [userverifyResp] = await Promise.all([
      this.page.waitForResponse(/\/recaptcha\/(api2|enterprise)\/userverify/),
      recaptchaBox.verifyButton.click(),
    ]);

    await userverifyResp.finished();

    while (recaptchaBox.framesAreAttached()) {
      if (await recaptchaBox.rateLimitIsVisible()) {
        throw new RecaptchaRateLimitError();
      }

      if (
        !(await recaptchaBox.audioChallengeIsVisible()) ||
        (await recaptchaBox.solveFailureIsVisible()) ||
        (await recaptchaBox.challengeIsSolved())
      ) {
        return;
      }

      await this.page.waitForTimeout(250);
    }
  }

  private async submitTileAnswers(recaptchaBox: RecaptchaBox): Promise<void> {
    await recaptchaBox.verifyButton.click();

    while (recaptchaBox.framesAreAttached()) {
      if (await recaptchaBox.rateLimitIsVisible()) {
        throw new RecaptchaRateLimitError();
      }

      if (
        (await recaptchaBox.challengeIsSolved()) ||
        (await recaptchaBox.tryAgainIsVisible())
      ) {
        return;
      }

      if (
        (await recaptchaBox.checkNewImagesIsVisible()) ||
        (await recaptchaBox.selectAllMatchingIsVisible())
      ) {
        await Promise.all([
          this.page.waitForResponse(/\/recaptcha\/(api2|enterprise)\/payload/),
          recaptchaBox.newChallengeButton.click(),
        ]);
        return;
      }

      await this.page.waitForTimeout(250);
    }
  }

  private async solveImageChallenge(recaptchaBox: RecaptchaBox): Promise<void> {
    while (recaptchaBox.framesAreAttached()) {
      if (!this.payloadResponse) {
        const image = recaptchaBox.imageChallenge.locator('img').first();
        const imageUrl = await image.getAttribute('src');
        if (imageUrl) {
          this.payloadResponse = await this.page.request.get(imageUrl);
        }
      }

      if (!this.payloadResponse) {
        await this.page.waitForTimeout(250);
        continue;
      }

      const capsolverResponse = await this.getCapsolverResponse(
        recaptchaBox,
        await this.payloadResponse.body()
      );

      if (!capsolverResponse || !capsolverResponse.solution?.objects?.length) {
        this.payloadResponse = null;

        await Promise.all([
          this.page.waitForResponse(/\/recaptcha\/(api2|enterprise)\/reload/),
          recaptchaBox.newChallengeButton.click(),
        ]);

        while (this.payloadResponse === null) {
          if (await recaptchaBox.rateLimitIsVisible()) {
            throw new RecaptchaRateLimitError();
          }
          await this.page.waitForTimeout(250);
        }
        continue;
      }

      await this.solveTiles(recaptchaBox, capsolverResponse.solution.objects);
      this.payloadResponse = null;

      const button = recaptchaBox.skipButton.or(recaptchaBox.nextButton);

      if (await button.isHidden()) {
        await this.submitTileAnswers(recaptchaBox);
        return;
      }

      await Promise.all([
        this.page.waitForResponse(/\/recaptcha\/(api2|enterprise)\/payload/),
        button.click(),
      ]);
    }
  }

  private async solveAudioChallenge(recaptchaBox: RecaptchaBox): Promise<void> {
    const parsedUrl = new URL(recaptchaBox.anchorFrame.url());
    let language = parsedUrl.searchParams.get('hl') || 'en-US';

    if (!(ORIGINAL_LANGUAGE_AUDIO as readonly string[]).includes(language)) {
      language = 'en-US';
    }

    let text: string | null = null;

    while (true) {
      const url = await this.getAudioUrl(recaptchaBox);
      text = await this.transcribeAudio(url, language);

      if (text !== null) {
        break;
      }

      await Promise.all([
        this.page.waitForResponse(/\/recaptcha\/(api2|enterprise)\/reload/),
        recaptchaBox.newChallengeButton.click(),
      ]);

      while (url === (await this.getAudioUrl(recaptchaBox))) {
        await this.page.waitForTimeout(250);
      }
    }

    await this.submitAudioText(recaptchaBox, text);
  }

  public async recaptchaIsVisible(): Promise<boolean> {
    try {
      await RecaptchaBox.fromFrames(this.page.frames());
      return true;
    } catch (err) {
      if (err instanceof RecaptchaNotFoundError) {
        return false;
      }
      throw err;
    }
  }

  public async solveRecaptcha(options: SolveV2Options = {}): Promise<string> {
    const imageChallenge = options.imageChallenge ?? false;
    let attempts = options.attempts ?? this.attempts;
    const wait = options.wait ?? false;
    const rawTimeout = options.waitTimeout ?? 30;
    // Support both seconds (< 1000) and milliseconds
    const waitTimeoutMs = rawTimeout <= 1000 ? rawTimeout * 1000 : rawTimeout;

    if (imageChallenge && !this.capsolverApiKey) {
      throw new CapSolverError(
        'You must provide a CapSolver API key to solve image challenges.'
      );
    }

    this.token = null;

    let recaptchaBox: RecaptchaBox;

    if (wait) {
      const startTime = Date.now();
      while (true) {
        try {
          recaptchaBox = await RecaptchaBox.fromFrames(this.page.frames());
          break;
        } catch (err) {
          if (err instanceof RecaptchaNotFoundError) {
            if (Date.now() - startTime >= waitTimeoutMs) {
              throw err;
            }
            await this.page.waitForTimeout(250);
            continue;
          }
          throw err;
        }
      }
    } else {
      recaptchaBox = await RecaptchaBox.fromFrames(this.page.frames());
    }

    if (await recaptchaBox.rateLimitIsVisible()) {
      throw new RecaptchaRateLimitError();
    }

    if (await recaptchaBox.checkbox.isVisible()) {
      const clickTimestamp = Date.now();
      await this.clickCheckbox(recaptchaBox);

      if (this.token !== null) {
        return this.token;
      }

      if (
        recaptchaBox.framesAreDetached() ||
        !(await recaptchaBox.anyChallengeIsVisible()) ||
        (await recaptchaBox.challengeIsSolved())
      ) {
        while (this.token === null) {
          await this.page.waitForTimeout(250);
        }
        return this.token;
      }

      const elapsed = Date.now() - clickTimestamp;
      const timeToWait = Math.max(1000 - elapsed, 0);
      if (timeToWait > 0) {
        await this.page.waitForTimeout(timeToWait);
      }
    }

    while (!(await recaptchaBox.anyChallengeIsVisible())) {
      await this.page.waitForTimeout(250);
    }

    if (imageChallenge && (await recaptchaBox.imageChallengeButton.isVisible())) {
      await recaptchaBox.imageChallengeButton.click();
    } else if (!imageChallenge && (await recaptchaBox.audioChallengeButton.isVisible())) {
      await recaptchaBox.audioChallengeButton.click();
    }

    if (imageChallenge) {
      const image = recaptchaBox.imageChallenge.locator('img').first();
      const imageUrl = await image.getAttribute('src');
      if (imageUrl) {
        this.payloadResponse = await this.page.request.get(imageUrl);
      }
    }

    while (attempts > 0) {
      this.token = null;

      if (imageChallenge) {
        await this.solveImageChallenge(recaptchaBox);
      } else {
        await this.solveAudioChallenge(recaptchaBox);
      }

      if (
        recaptchaBox.framesAreDetached() ||
        !(await recaptchaBox.anyChallengeIsVisible()) ||
        (await recaptchaBox.challengeIsSolved())
      ) {
        while (this.token === null) {
          await this.page.waitForTimeout(250);
        }
        return this.token;
      }

      attempts -= 1;
    }

    throw new RecaptchaSolveError();
  }
}
