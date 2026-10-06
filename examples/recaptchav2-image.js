import { chromium } from 'playwright';
import { recaptchav2 } from '../src/index.ts';

async function main() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    await page.goto('https://www.google.com/recaptcha/api2/demo');

    const solver = new recaptchav2.Solver(page, {
      capsolverApiKey: process.env.CAPSOLVER_API_KEY || 'your_capsolver_api_key',
    });

    try {
      console.log('Solving reCAPTCHA v2 (Image Challenge via CapSolver)...');
      const token = await solver.solveRecaptcha({ wait: true, imageChallenge: true });
      console.log('Solved successfully! Token:', token);
    } finally {
      solver.close();
    }
  } finally {
    await browser.close();
  }
}

main().catch(console.error);
