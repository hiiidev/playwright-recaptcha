import { chromium } from 'playwright';
import { recaptchav2 } from 'recaptcha-playwright';

async function main() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    await page.goto('https://www.google.com/recaptcha/api2/demo');

    const solver = new recaptchav2.Solver(page);
    try {
      console.log('Solving reCAPTCHA v2 (Audio Challenge)...');
      const token = await solver.solveRecaptcha({ wait: true });
      console.log('Solved successfully! Token:', token);
    } finally {
      solver.close();
    }
  } finally {
    await browser.close();
  }
}

main().catch(console.error);
