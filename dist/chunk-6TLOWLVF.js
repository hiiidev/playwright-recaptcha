var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/errors.ts
var CapSolverError = class extends Error {
  constructor(message = "The CapSolver API returned an error.") {
    super(message);
    this.name = "CapSolverError";
  }
};
var RecaptchaError = class extends Error {
  constructor(message = "A reCAPTCHA error occurred.") {
    super(message);
    this.name = "RecaptchaError";
  }
};
var RecaptchaNotFoundError = class extends RecaptchaError {
  constructor(message = "The reCAPTCHA was not found.") {
    super(message);
    this.name = "RecaptchaNotFoundError";
  }
};
var RecaptchaSolveError = class extends RecaptchaError {
  constructor(message = "The reCAPTCHA could not be solved.") {
    super(message);
    this.name = "RecaptchaSolveError";
  }
};
var RecaptchaRateLimitError = class extends RecaptchaSolveError {
  constructor(message = "The reCAPTCHA rate limit has been exceeded.") {
    super(message);
    this.name = "RecaptchaRateLimitError";
  }
};
var RecaptchaTimeoutError = class extends RecaptchaSolveError {
  constructor(message = "The reCAPTCHA solve timeout has been exceeded.") {
    super(message);
    this.name = "RecaptchaTimeoutError";
  }
};

export {
  __export,
  CapSolverError,
  RecaptchaError,
  RecaptchaNotFoundError,
  RecaptchaSolveError,
  RecaptchaRateLimitError,
  RecaptchaTimeoutError
};
