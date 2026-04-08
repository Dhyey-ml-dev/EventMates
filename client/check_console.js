import puppeteer from 'puppeteer';
(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
    page.on('requestfailed', request => console.log('REQ FAIL:', request.url(), request.failure().errorText));
    await page.goto('http://localhost:5173', { waitUntil: 'load' });
    await new Promise(r => setTimeout(r, 2000));
    await browser.close();
  } catch (e) { console.error(e); }
})();
