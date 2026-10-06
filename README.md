# recaptcha-playwright

A robust, modern Node.js / TypeScript library for solving and intercepting **Google reCAPTCHA v2 and v3** challenges using [Playwright](https://playwright.dev/).

Ported and enhanced from the popular Python library [Xewdy444/Playwright-reCAPTCHA](https://github.com/Xewdy444/Playwright-reCAPTCHA).

> [!IMPORTANT]
> **System Requirements**  
> - **Node.js**: Minimum requirement is **`Node.js >= 18.0.0`**.  
> - **FFmpeg & FLAC**: To solve reCAPTCHA v2 **audio challenges**, this library uses your system's `ffmpeg` binary to transcode and resample MP3 audio streams into 16kHz mono FLAC for Google's Speech Recognition service. You **must** have `ffmpeg` and `flac` tools installed and accessible in your system's `PATH`.

---

## System Requirements (FFmpeg & FLAC Installation)

Install FFmpeg and FLAC according to your operating system or container environment:

| Platform | Installation Command | Verify Command |
| :--- | :--- | :--- |
| **macOS** | `brew install ffmpeg flac` | `ffmpeg -version && flac -v` |
| **Debian / Ubuntu** | `sudo apt-get update && sudo apt-get install -y ffmpeg flac` | `ffmpeg -version && flac -v` |
| **CentOS / RHEL / Fedora** | `sudo yum install epel-release && sudo yum install -y ffmpeg flac` | `ffmpeg -version && flac -v` |
| **Alpine Linux (Docker)** | `apk add --no-cache ffmpeg flac` | `ffmpeg -version && flac -v` |
| **Windows** | `winget install Gyan.FFmpeg` or download from [ffmpeg.org](https://ffmpeg.org/download.html) | `ffmpeg -version` |

> 🐳 **Docker Users**: Add the following lines to your `Dockerfile`:
>
> **For Debian / Ubuntu based images (`node:20`, `node:22`, etc.):**
> ```dockerfile
> RUN apt-get update && apt-get install -y --no-install-recommends \
>     ffmpeg \
>     flac \
>  && rm -rf /var/lib/apt/lists/*
> ```
>
> **For Alpine based images (`node:alpine`):**
> ```dockerfile
> RUN apk add --no-cache ffmpeg flac
> ```

---

## Installation

```bash
# Using npm
npm install recaptcha-playwright

# Using pnpm
pnpm add recaptcha-playwright

# Using yarn
yarn add recaptcha-playwright
```

---

## Features

- **reCAPTCHA v2 Solver**:
  - **Audio Challenge**: Automatically downloads MP3 audio, converts it via `ffmpeg`, and transcribes text using Google Speech Recognition.
  - **Human Typing Simulation**: Mimics human keystrokes with realistic delays (60ms ~ 160ms jitter) and natural thinking pauses before clicking verify.
  - **Image Challenge (CapSolver)**: Full integration with CapSolver API for 3x3 and 4x4 image classification with dynamic tile reloading support.
  - **Direct Checkbox Pass**: Intercepts the response immediately if clicking the checkbox passes without a challenge.
- **reCAPTCHA v3 Interceptor**:
  - Hooks into browser network requests (`/recaptcha/api2/reload` and `/enterprise/reload`) to intercept the valid `g-recaptcha-response` token.
  - Automatically captures high-trust tokens on target pages.
- **Proxy & Stealth Ready**: Compatible with residential/datacenter proxies and custom Playwright browser contexts.
- **Multilingual Support**: Supports 9 languages out-of-the-box (English, Chinese, Russian, German, French, Spanish, Italian, Dutch, Portuguese).
- **TypeScript First**: Full typing support, ESM & CJS exports, and `await using` (Disposable) support.

---

## Usage Examples

### 1. reCAPTCHA v2 (Audio Challenge with Human Typing)

```javascript
import { chromium } from 'playwright';
import { recaptchav2 } from 'recaptcha-playwright';

const browser = await chromium.launch({ headless: false });
const page = await browser.newPage();

await page.goto('https://www.google.com/recaptcha/api2/demo');

const solver = new recaptchav2.Solver(page, {
  attempts: 5,
  humanTyping: true,       // Simulates character-by-character human typing
  typingDelay: [60, 160],  // Jitter range per keystroke in milliseconds
});

try {
  // Solve reCAPTCHA v2
  const token = await solver.solveRecaptcha({ wait: true });
  console.log('Solved token:', token);

  // Submit form
  await page.locator('#recaptcha-demo-submit').click();
} finally {
  solver.close(); // Clean up response listeners
  await browser.close();
}
```

> **Tip**: With TypeScript 5.2+ or modern JavaScript, you can use `await using`:
> ```javascript
> {
>   await using solver = new recaptchav2.Solver(page);
>   const token = await solver.solveRecaptcha({ wait: true });
> }
> ```

---

### 2. reCAPTCHA v2 with Proxies & Chromium Configuration

When running scrapers or automation bots, you can launch Chromium with proxy support:

```javascript
import { chromium } from 'playwright';
import { recaptchav2 } from 'recaptcha-playwright';

const browser = await chromium.launch({
  headless: false,
  proxy: {
    server: 'http://proxy-host:port',
    username: 'proxy-username',
    password: 'proxy-password',
  },
});

const page = await browser.newPage();
const solver = new recaptchav2.Solver(page);

try {
  await page.goto('https://www.google.com/recaptcha/api2/demo');
  const token = await solver.solveRecaptcha({ wait: true });
  console.log('Solved token:', token);
} finally {
  solver.close();
  await browser.close();
}
```

---

### 3. reCAPTCHA v3 (Intercepting Token)

Always initialize the solver **before** navigating to the target page to ensure the initial reload request is intercepted:

```javascript
import { chromium } from 'playwright';
import { recaptchav3 } from 'recaptcha-playwright';

const browser = await chromium.launch({ headless: false });
const page = await browser.newPage();

// 1. Initialize solver listener before navigation
const solver = new recaptchav3.Solver(page, { timeout: 30 });

try {
  // 2. Navigate to page
  await page.goto('https://antcpt.com/score_detector/');

  // 3. Capture token
  const token = await solver.solveRecaptcha();
  console.log('Captured v3 Token:', token);

  // Read detected score if available
  const scoreLocator = page.getByText(/Your score is: (\d\.\d)/);
  if (await scoreLocator.isVisible({ timeout: 5000 }).catch(() => false)) {
    console.log(await scoreLocator.innerText());
  }
} finally {
  solver.close();
  await browser.close();
}
```

---

### 4. reCAPTCHA v2 (Image Challenge with CapSolver)

To solve image challenges (e.g. crosswalks, traffic lights, bicycles):

```javascript
import { chromium } from 'playwright';
import { recaptchav2 } from 'recaptcha-playwright';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('https://www.google.com/recaptcha/api2/demo');

const solver = new recaptchav2.Solver(page, {
  capsolverApiKey: process.env.CAPSOLVER_API_KEY,
});

try {
  const token = await solver.solveRecaptcha({
    wait: true,
    imageChallenge: true, // Switch to image challenge
  });
  console.log('Image challenge solved:', token);
} finally {
  solver.close();
  await browser.close();
}
```

---

### 5. Custom Audio Transcriber (Whisper / Local Models)

You can plug in any Speech-to-Text backend (such as OpenAI Whisper, Vosk, or local models) by passing `transcribeAudio`:

```javascript
const solver = new recaptchav2.Solver(page, {
  transcribeAudio: async (mp3Buffer, language) => {
    // Call your own speech recognition service
    const transcription = await myCustomWhisperService(mp3Buffer, language);
    return transcription; // string | null
  },
});
```

---

## Error Handling

```javascript
import {
  RecaptchaError,
  RecaptchaNotFoundError,
  RecaptchaRateLimitError,
  RecaptchaSolveError,
  RecaptchaTimeoutError,
  CapSolverError,
} from 'recaptcha-playwright';
```

- `RecaptchaNotFoundError`: Thrown when no unchecked reCAPTCHA frames are found on the page.
- `RecaptchaRateLimitError`: Thrown when Google triggers a rate limit (*"Your computer or network may be sending automated queries / Try again later"*).
- `RecaptchaSolveError`: Thrown when max attempts have been exceeded without success.
- `RecaptchaTimeoutError`: Thrown when waiting for reCAPTCHA v3 token times out.
- `CapSolverError`: Thrown when the CapSolver API returns an error.

---

## Running the Examples & Tests

```bash
# Run unit tests
pnpm test

# Run reCAPTCHA v2 audio example
node examples/recaptchav2-audio.js

# Run reCAPTCHA v2 image challenge example (CapSolver)
node examples/recaptchav2-image.js

# Run reCAPTCHA v3 interception example
node examples/recaptchav3.js
```

---

## License

[MIT License](LICENSE)
