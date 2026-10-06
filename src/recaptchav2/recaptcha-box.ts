import type { Frame, Locator } from 'playwright';
import { RecaptchaNotFoundError } from '../errors.ts';
import { ELEMENT_TRANSLATIONS, getTranslationsPattern } from './translations.ts';

export class RecaptchaBox {
  public readonly anchorFrame: Frame;
  public readonly bframeFrame: Frame;

  constructor(anchorFrame: Frame, bframeFrame: Frame) {
    this.anchorFrame = anchorFrame;
    this.bframeFrame = bframeFrame;
  }

  /**
   * Get the reCAPTCHA anchor and bframe frame pairs.
   */
  public static getRecaptchaFramePairs(frames: Frame[]): [Frame, Frame][] {
    const anchorFrames = frames.filter((frame) =>
      /\/recaptcha\/(api2|enterprise)\/anchor/.test(frame.url())
    );

    const bframeFrames = frames.filter((frame) =>
      /\/recaptcha\/(api2|enterprise)\/bframe/.test(frame.url())
    );

    const framePairs: [Frame, Frame][] = [];

    for (const anchorFrame of anchorFrames) {
      const frameId = anchorFrame.name().slice(2);

      for (const bframeFrame of bframeFrames) {
        if (!bframeFrame.name().includes(frameId)) {
          continue;
        }

        framePairs.push([anchorFrame, bframeFrame]);
      }
    }

    if (framePairs.length === 0) {
      throw new RecaptchaNotFoundError();
    }

    return framePairs;
  }

  /**
   * Create a reCAPTCHA box using a list of frames.
   */
  public static async fromFrames(frames: Frame[]): Promise<RecaptchaBox> {
    const framePairs = RecaptchaBox.getRecaptchaFramePairs(frames);

    for (const [anchorFrame, bframeFrame] of framePairs) {
      const box = new RecaptchaBox(anchorFrame, bframeFrame);

      if (!box.framesAreAttached()) {
        continue;
      }

      const [checkboxVisible, audioVisible, imageVisible] = await Promise.all([
        box.checkbox.isVisible().catch(() => false),
        box.audioChallengeButton.isVisible().catch(() => false),
        box.imageChallengeButton.isVisible().catch(() => false),
      ]);

      if (checkboxVisible) {
        const checked = await box.checkbox.isChecked().catch(() => false);
        if (!checked) {
          return box;
        }
      }

      if (audioVisible) {
        const enabled = await box.audioChallengeButton.isEnabled().catch(() => false);
        if (enabled) {
          return box;
        }
      }

      if (imageVisible) {
        const enabled = await box.imageChallengeButton.isEnabled().catch(() => false);
        if (enabled) {
          return box;
        }
      }
    }

    throw new RecaptchaNotFoundError('No unchecked reCAPTCHA boxes were found.');
  }

  public get checkbox(): Locator {
    return this.anchorFrame.getByRole('checkbox', {
      name: getTranslationsPattern(ELEMENT_TRANSLATIONS.im_not_a_robot),
    });
  }

  public get audioChallengeButton(): Locator {
    return this.bframeFrame.getByRole('button', {
      name: getTranslationsPattern(ELEMENT_TRANSLATIONS.get_an_audio_challenge),
    });
  }

  public get imageChallengeButton(): Locator {
    return this.bframeFrame.getByRole('button', {
      name: getTranslationsPattern(ELEMENT_TRANSLATIONS.get_a_visual_challenge),
    });
  }

  public get newChallengeButton(): Locator {
    return this.bframeFrame.getByRole('button', {
      name: getTranslationsPattern(ELEMENT_TRANSLATIONS.get_a_new_challenge),
    });
  }

  public get audioDownloadButton(): Locator {
    return this.bframeFrame.getByRole('link', {
      name: getTranslationsPattern(ELEMENT_TRANSLATIONS.alternatively_download_audio_as_mp3),
    });
  }

  public get audioChallengeTextbox(): Locator {
    return this.bframeFrame.getByRole('textbox', {
      name: getTranslationsPattern(ELEMENT_TRANSLATIONS.enter_what_you_hear),
    });
  }

  public get skipButton(): Locator {
    return this.bframeFrame.getByRole('button', {
      name: getTranslationsPattern(ELEMENT_TRANSLATIONS.skip),
    });
  }

  public get nextButton(): Locator {
    return this.bframeFrame.getByRole('button', {
      name: getTranslationsPattern(ELEMENT_TRANSLATIONS.next),
    });
  }

  public get verifyButton(): Locator {
    return this.bframeFrame.getByRole('button', {
      name: getTranslationsPattern(ELEMENT_TRANSLATIONS.verify),
    });
  }

  public get tileSelector(): Locator {
    return this.bframeFrame.locator('.rc-imageselect-tile');
  }

  public get imageChallenge(): Locator {
    return this.bframeFrame.locator('.rc-imageselect-challenge');
  }

  public framesAreAttached(): boolean {
    return !this.framesAreDetached();
  }

  public framesAreDetached(): boolean {
    return this.anchorFrame.isDetached() || this.bframeFrame.isDetached();
  }

  public async rateLimitIsVisible(): Promise<boolean> {
    if (this.framesAreDetached()) return false;
    return this.bframeFrame
      .getByText(getTranslationsPattern(ELEMENT_TRANSLATIONS.try_again_later))
      .isVisible()
      .catch(() => false);
  }

  public async solveFailureIsVisible(): Promise<boolean> {
    if (this.framesAreDetached()) return false;
    return this.bframeFrame
      .getByText(getTranslationsPattern(ELEMENT_TRANSLATIONS.multiple_correct_solutions_required))
      .isVisible()
      .catch(() => false);
  }

  public async imageChallengeIsVisible(): Promise<boolean> {
    if (this.framesAreDetached()) return false;
    const button = this.skipButton.or(this.nextButton).or(this.verifyButton);
    return button.isEnabled().catch(() => false);
  }

  public async audioChallengeIsVisible(): Promise<boolean> {
    if (this.framesAreDetached()) return false;
    const textVisible = await this.bframeFrame
      .getByText(getTranslationsPattern(ELEMENT_TRANSLATIONS.press_play_to_listen))
      .isVisible()
      .catch(() => false);

    if (!textVisible) return false;

    const btnVisible = await this.newChallengeButton.isVisible().catch(() => false);
    if (!btnVisible) return false;

    return this.newChallengeButton.isEnabled().catch(() => false);
  }

  public async anyChallengeIsVisible(): Promise<boolean> {
    const [imageVisible, audioVisible] = await Promise.all([
      this.imageChallengeIsVisible(),
      this.audioChallengeIsVisible(),
    ]);
    return imageVisible || audioVisible;
  }

  public async tryAgainIsVisible(): Promise<boolean> {
    if (this.framesAreDetached()) return false;
    return this.bframeFrame
      .getByText(getTranslationsPattern(ELEMENT_TRANSLATIONS.please_try_again))
      .isVisible()
      .catch(() => false);
  }

  public async checkNewImagesIsVisible(): Promise<boolean> {
    if (this.framesAreDetached()) return false;
    return this.bframeFrame
      .getByText(getTranslationsPattern(ELEMENT_TRANSLATIONS.please_also_check_the_new_images))
      .isVisible()
      .catch(() => false);
  }

  public async selectAllMatchingIsVisible(): Promise<boolean> {
    if (this.framesAreDetached()) return false;
    return this.bframeFrame
      .getByText(getTranslationsPattern(ELEMENT_TRANSLATIONS.please_select_all_matching_images))
      .isVisible()
      .catch(() => false);
  }

  public async challengeIsSolved(): Promise<boolean> {
    if (this.framesAreDetached()) return false;
    const visible = await this.checkbox.isVisible().catch(() => false);
    if (!visible) return false;
    return this.checkbox.isChecked().catch(() => false);
  }
}
