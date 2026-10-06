import {
  RecaptchaTimeoutError,
  __export
} from "./chunk-6TLOWLVF.js";

// src/recaptchav3/index.ts
var recaptchav3_exports = {};
__export(recaptchav3_exports, {
  AsyncSolver: () => RecaptchaV3Solver,
  RecaptchaV3Solver: () => RecaptchaV3Solver,
  Solver: () => RecaptchaV3Solver
});

// src/recaptchav3/solver.ts
var RecaptchaV3Solver = class {
  page;
  defaultTimeoutMs;
  token = null;
  constructor(page, options = {}) {
    this.page = page;
    const timeout = options.timeout ?? 30;
    this.defaultTimeoutMs = timeout <= 1e3 ? timeout * 1e3 : timeout;
    this.page.on("response", this.handleResponse);
  }
  close() {
    try {
      this.page.off("response", this.handleResponse);
    } catch {
    }
  }
  [Symbol.asyncDispose]() {
    this.close();
  }
  handleResponse = async (response) => {
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
    }
  };
  /**
   * Wait for the reCAPTCHA v3 to be solved and return the `g-recaptcha-response` token.
   *
   * @param timeout The solve timeout in seconds (or ms if > 1000). Defaults to constructor timeout.
   * @returns The `g-recaptcha-response` token.
   * @throws RecaptchaTimeoutError If the solve timeout has been exceeded.
   */
  async solveRecaptcha(timeout) {
    this.token = null;
    const timeoutMs = timeout !== void 0 ? timeout <= 1e3 ? timeout * 1e3 : timeout : this.defaultTimeoutMs;
    const startTime = Date.now();
    while (this.token === null) {
      if (Date.now() - startTime >= timeoutMs) {
        throw new RecaptchaTimeoutError();
      }
      await this.page.waitForTimeout(250);
    }
    return this.token;
  }
};

export {
  RecaptchaV3Solver,
  recaptchav3_exports
};
