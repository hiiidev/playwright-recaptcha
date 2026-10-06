export {
  CapSolverError,
  RecaptchaError,
  RecaptchaNotFoundError,
  RecaptchaRateLimitError,
  RecaptchaSolveError,
  RecaptchaTimeoutError,
} from './errors.ts';

export {
  RecaptchaV2Solver,
  RecaptchaV2Solver as AsyncSolverV2,
  RecaptchaV2Solver as SolverV2,
  RecaptchaBox,
  convertMp3ToFlac,
  transcribeWithGoogle,
  type RecaptchaV2Options,
  type SolveV2Options,
  type AudioTranscriber,
} from './recaptchav2/index.ts';

export {
  RecaptchaV3Solver,
  RecaptchaV3Solver as AsyncSolverV3,
  RecaptchaV3Solver as SolverV3,
  type RecaptchaV3Options,
} from './recaptchav3/index.ts';

import * as recaptchav2 from './recaptchav2/index.ts';
import * as recaptchav3 from './recaptchav3/index.ts';

export { recaptchav2, recaptchav3 };
export { ELEMENT_TRANSLATIONS, OBJECT_TRANSLATIONS, getTranslationsPattern } from './recaptchav2/translations.ts';
