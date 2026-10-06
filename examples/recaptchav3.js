import { chromium } from 'playwright';
import { recaptchav3 } from 'recaptcha-playwright';

async function main() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    // It is best to initialize the solver before navigating to the page
    const solver = new recaptchav3.Solver(page);

    try {
      console.log('Navigating and capturing reCAPTCHA v3 token...');
      await page.goto('https://antcpt.com/score_detector/');

      const token = await solver.solveRecaptcha();
      console.log('Captured reCAPTCHA v3 Token:', token);

      const scoreLocator = page.getByText(/Your score is: (\d\.\d)/);
      if (await scoreLocator.isVisible({ timeout: 5000 }).catch(() => false)) {
        console.log(await scoreLocator.innerText());
      }
    } finally {
      solver.close();
    }
  } finally {
    await browser.close();
  }
}

main().catch(console.error);
