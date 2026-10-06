export * from './solver.ts';
export * from './recaptcha-box.ts';
export * from './translations.ts';
export * from './audio.ts';

// Backward compatible aliases matching Python module
export { RecaptchaV2Solver as Solver, RecaptchaV2Solver as AsyncSolver } from './solver.ts';
