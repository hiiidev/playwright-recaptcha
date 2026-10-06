"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/recaptchav3/index.ts
var recaptchav3_exports = {};
__export(recaptchav3_exports, {
  AsyncSolver: () => RecaptchaV3Solver,
  RecaptchaV3Solver: () => RecaptchaV3Solver,
  Solver: () => RecaptchaV3Solver
});
module.exports = __toCommonJS(recaptchav3_exports);

// src/errors.ts
var RecaptchaError = class extends Error {
  constructor(message = "A reCAPTCHA error occurred.") {
    super(message);
    this.name = "RecaptchaError";
  }
};
var RecaptchaSolveError = class extends RecaptchaError {
  constructor(message = "The reCAPTCHA could not be solved.") {
    super(message);
    this.name = "RecaptchaSolveError";
  }
};
var RecaptchaTimeoutError = class extends RecaptchaSolveError {
  constructor(message = "The reCAPTCHA solve timeout has been exceeded.") {
    super(message);
    this.name = "RecaptchaTimeoutError";
  }
};

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AsyncSolver,
  RecaptchaV3Solver,
  Solver
});
