export class CapSolverError extends Error {
  constructor(message: string = 'The CapSolver API returned an error.') {
    super(message);
    this.name = 'CapSolverError';
  }
}

export class RecaptchaError extends Error {
  constructor(message: string = 'A reCAPTCHA error occurred.') {
    super(message);
    this.name = 'RecaptchaError';
  }
}

export class RecaptchaNotFoundError extends RecaptchaError {
  constructor(message: string = 'The reCAPTCHA was not found.') {
    super(message);
    this.name = 'RecaptchaNotFoundError';
  }
}

export class RecaptchaSolveError extends RecaptchaError {
  constructor(message: string = 'The reCAPTCHA could not be solved.') {
    super(message);
    this.name = 'RecaptchaSolveError';
  }
}

export class RecaptchaRateLimitError extends RecaptchaSolveError {
  constructor(message: string = 'The reCAPTCHA rate limit has been exceeded.') {
    super(message);
    this.name = 'RecaptchaRateLimitError';
  }
}

export class RecaptchaTimeoutError extends RecaptchaSolveError {
  constructor(message: string = 'The reCAPTCHA solve timeout has been exceeded.') {
    super(message);
    this.name = 'RecaptchaTimeoutError';
  }
}
