import type { Page, Response } from 'playwright';
import { RecaptchaTimeoutError } from '../errors.ts';

export interface RecaptchaV3Options {
  timeout?: number; // timeout in seconds, default 30
}

export class RecaptchaV3Solver {
  private page: Page;
  private defaultTimeoutMs: number;
  private token: string | null = null;

  constructor(page: Page, options: RecaptchaV3Options = {}) {
    this.page = page;
    const timeout = options.timeout ?? 30;
    this.defaultTimeoutMs = timeout <= 1000 ? timeout * 1000 : timeout;

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
    if (!/\/recaptcha\/(api2|enterprise)\/reload/.test(url)) {
      return;
    }

    try {
      const text = await response.text();
      const match = /"rresp","(.*?)"/.exec(text);
      if (match && match[1]) {
        this.token = match[1];
      }
    } catch {
      // Ignore interrupted responses
    }
  };

  /**
   * Wait for the reCAPTCHA v3 to be solved and return the `g-recaptcha-response` token.
   *
   * @param timeout The solve timeout in seconds (or ms if > 1000). Defaults to constructor timeout.
   * @returns The `g-recaptcha-response` token.
   * @throws RecaptchaTimeoutError If the solve timeout has been exceeded.
   */
  public async solveRecaptcha(timeout?: number): Promise<string> {
    this.token = null;
    const timeoutMs =
      timeout !== undefined
        ? timeout <= 1000
          ? timeout * 1000
          : timeout
        : this.defaultTimeoutMs;

    const startTime = Date.now();

    while (this.token === null) {
      if (Date.now() - startTime >= timeoutMs) {
        throw new RecaptchaTimeoutError();
      }

      await this.page.waitForTimeout(250);
    }

    return this.token;
  }
}
