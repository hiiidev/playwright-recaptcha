import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  CapSolverError,
  RecaptchaError,
  RecaptchaNotFoundError,
  RecaptchaRateLimitError,
  RecaptchaSolveError,
  RecaptchaTimeoutError,
  ELEMENT_TRANSLATIONS,
  OBJECT_TRANSLATIONS,
  getTranslationsPattern,
  RecaptchaBox,
  convertMp3ToFlac,
} from 'recaptcha-playwright';
import { spawn } from 'child_process';

describe('Error Classes', () => {
  test('RecaptchaError hierarchy', () => {
    const notFound = new RecaptchaNotFoundError();
    assert.ok(notFound instanceof Error);
    assert.ok(notFound instanceof RecaptchaError);
    assert.strictEqual(notFound.name, 'RecaptchaNotFoundError');
    assert.strictEqual(notFound.message, 'The reCAPTCHA was not found.');

    const rateLimit = new RecaptchaRateLimitError();
    assert.ok(rateLimit instanceof RecaptchaSolveError);
    assert.ok(rateLimit instanceof RecaptchaError);

    const timeout = new RecaptchaTimeoutError();
    assert.ok(timeout instanceof RecaptchaSolveError);

    const capsolver = new CapSolverError('Custom CapSolver message');
    assert.strictEqual(capsolver.message, 'Custom CapSolver message');
    assert.strictEqual(capsolver.name, 'CapSolverError');
  });
});

describe('Translations and Regex Patterns', () => {
  test('im_not_a_robot matches multiple languages', () => {
    const pattern = getTranslationsPattern(ELEMENT_TRANSLATIONS.im_not_a_robot);

    // English
    assert.match("I'm not a robot", pattern);
    // Russian
    assert.match('Я не робот', pattern);
    // Chinese
    assert.match('进行人机身份验证', pattern);
    // Spanish
    assert.match('No soy un robot', pattern);
    // French
    assert.match('Je ne suis pas un robot', pattern);
    // German
    assert.match('Ich bin kein Roboter', pattern);
    // Dutch
    assert.match('Ik ben geen robot', pattern);
    // Italian
    assert.match('Non sono un robot', pattern);
    // Portuguese
    assert.match('Não sou um robô', pattern);

    // Should not match random text
    assert.doesNotMatch('Click here to continue', pattern);
  });

  test('button and challenge translations', () => {
    const audioPattern = getTranslationsPattern(ELEMENT_TRANSLATIONS.get_an_audio_challenge);
    assert.match('Get an audio challenge', audioPattern);
    assert.match('改用音频验证', audioPattern);

    const verifyPattern = getTranslationsPattern(ELEMENT_TRANSLATIONS.verify);
    assert.match('Verify', verifyPattern);
    assert.match('验证', verifyPattern);
    assert.match('Подтвердить', verifyPattern);
  });

  test('object translations have expected categories', () => {
    assert.ok(OBJECT_TRANSLATIONS.bus.includes('公交车'));
    assert.ok(OBJECT_TRANSLATIONS.crosswalks.includes('人行横道'));
    assert.ok(OBJECT_TRANSLATIONS.traffic_lights.includes('红绿灯'));
    assert.ok(OBJECT_TRANSLATIONS.bicycles.includes('自行车'));
  });
});

describe('RecaptchaBox Frame Detection Logic', () => {
  test('correctly pairs anchor and bframe matching IDs', () => {
    const mockAnchorFrame = {
      name: () => 'a-xyz123',
      url: () => 'https://www.google.com/recaptcha/api2/anchor?k=somekey',
    } as any;

    const mockBframeFrame = {
      name: () => 'c-xyz123',
      url: () => 'https://www.google.com/recaptcha/api2/bframe?k=somekey',
    } as any;

    const mockOtherFrame = {
      name: () => 'other',
      url: () => 'https://example.com',
    } as any;

    const pairs = RecaptchaBox.getRecaptchaFramePairs([
      mockOtherFrame,
      mockAnchorFrame,
      mockBframeFrame,
    ]);

    assert.strictEqual(pairs.length, 1);
    assert.strictEqual(pairs[0][0], mockAnchorFrame);
    assert.strictEqual(pairs[0][1], mockBframeFrame);
  });

  test('throws RecaptchaNotFoundError when no frames match', () => {
    const mockOtherFrame = {
      name: () => 'other',
      url: () => 'https://example.com',
    } as any;

    assert.throws(
      () => RecaptchaBox.getRecaptchaFramePairs([mockOtherFrame]),
      RecaptchaNotFoundError
    );
  });
});

describe('Audio Conversion with FFmpeg', () => {
  test('convertMp3ToFlac produces valid FLAC data', async () => {
    // Generate a short 0.2s synthetic MP3 in memory using ffmpeg
    const mp3Buffer = await new Promise<Buffer>((resolve, reject) => {
      const proc = spawn('ffmpeg', [
        '-f', 'lavfi',
        '-i', 'sine=frequency=1000:duration=0.2',
        '-f', 'mp3',
        'pipe:1',
      ]);
      const chunks: Buffer[] = [];
      proc.stdout.on('data', (d) => chunks.push(d));
      proc.on('close', (code) => {
        if (code === 0) resolve(Buffer.concat(chunks));
        else reject(new Error(`Failed to generate mp3: ${code}`));
      });
      proc.on('error', reject);
    });

    assert.ok(mp3Buffer.length > 0);

    const flacBuffer = await convertMp3ToFlac(mp3Buffer);
    assert.ok(flacBuffer.length > 0);
    // FLAC header magic bytes: "fLaC" (0x66, 0x4C, 0x61, 0x43)
    assert.strictEqual(flacBuffer.subarray(0, 4).toString('ascii'), 'fLaC');
  });
});

describe('RecaptchaV3Solver', () => {
  test('intercepts reload response and extracts token', async () => {
    let responseHandler: ((res: any) => Promise<void>) | null = null;
    const mockPage = {
      on: (event: string, handler: any) => {
        if (event === 'response') responseHandler = handler;
      },
      off: (event: string, handler: any) => {
        if (event === 'response') responseHandler = null;
      },
      waitForTimeout: (ms: number) => new Promise((r) => setTimeout(r, ms)),
    } as any;

    const { RecaptchaV3Solver } = await import('recaptcha-playwright');
    const solver = new RecaptchaV3Solver(mockPage, { timeout: 2 });

    assert.ok(responseHandler !== null);

    // Simulate response arriving after 50ms
    setTimeout(async () => {
      const mockResponse = {
        url: () => 'https://www.google.com/recaptcha/api2/reload?k=abc',
        text: async () => ')]}\'\n[["rresp","sample_v3_token_xyz",null,null,null,null,null,null,null]]',
      };
      if (responseHandler) {
        await responseHandler(mockResponse);
      }
    }, 50);

    const token = await solver.solveRecaptcha();
    assert.strictEqual(token, 'sample_v3_token_xyz');

    solver.close();
    assert.strictEqual(responseHandler, null);
  });

  test('throws RecaptchaTimeoutError on timeout', async () => {
    const mockPage = {
      on: () => {},
      off: () => {},
      waitForTimeout: (ms: number) => new Promise((r) => setTimeout(r, ms)),
    } as any;

    const { RecaptchaV3Solver } = await import('recaptcha-playwright');
    const solver = new RecaptchaV3Solver(mockPage, { timeout: 0.1 });

    await assert.rejects(
      async () => solver.solveRecaptcha(0.1),
      RecaptchaTimeoutError
    );
    solver.close();
  });
});

describe('RecaptchaV2Solver', () => {
  test('intercepts userverify response and extracts token', async () => {
    let responseHandler: ((res: any) => Promise<void>) | null = null;
    const mockPage = {
      on: (event: string, handler: any) => {
        if (event === 'response') responseHandler = handler;
      },
      off: (event: string, handler: any) => {
        if (event === 'response') responseHandler = null;
      },
      waitForTimeout: (ms: number) => new Promise((r) => setTimeout(r, ms)),
    } as any;

    const { RecaptchaV2Solver } = await import('recaptcha-playwright');
    const solver = new RecaptchaV2Solver(mockPage);

    assert.ok(responseHandler !== null);

    const mockResponse = {
      url: () => 'https://www.google.com/recaptcha/api2/userverify?k=abc',
      text: async () => ')]}\'\n["uvresp","sample_v2_uv_token",1,120]',
    };

    await responseHandler(mockResponse);

    // Private token field should be captured internally
    assert.strictEqual((solver as any).token, 'sample_v2_uv_token');

    solver.close();
    assert.strictEqual(responseHandler, null);
  });
});

