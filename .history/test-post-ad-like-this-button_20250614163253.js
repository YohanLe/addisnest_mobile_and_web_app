const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Navigate to the property detail page
    await page.goto('http://localhost:5176/property/6849cb367cb3172bbb3c708b', { waitUntil: 'networkidle2' });

    // Ensure the "Post Ad Like This" button is visible
    await page.waitForSelector('button ::-p-text(Post Ad Like This)');
    console.log('Property detail page loaded successfully.');

    // Click the "Post Ad Like This" button
    await page.click('button ::-p-text(Post Ad Like This)');
    console.log('Clicked "Post Ad Like This" button.');

    // Wait for the login popup to appear
    await page.waitForSelector('.login-popup', { visible: true });
    console.log('Login popup appeared as expected.');

    console.log('Test passed: Unauthenticated users are prompted to log in.');
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }
})();
