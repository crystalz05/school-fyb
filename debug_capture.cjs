const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  page.on('console', msg => console.log('LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('response', response => {
    if (!response.ok()) console.log('HTTP ERROR:', response.status(), response.url());
  });

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

  // Fill required fields
  await page.type('#fullName', 'Test User');
  await page.type('#dateOfBirth', '2000-01-01');
  await page.select('#stateOfOrigin', 'Lagos');
  await page.type('#favouriteQuote', 'Test Quote');
  await page.type('#hobbies', 'Coding');
  await page.type('#bestCourse', 'Test');
  await page.type('#bestLecturer', 'Test');
  await page.type('#favouriteCourseMate', 'Test');
  await page.type('#ifNotSoftware', 'Test');
  await page.select('#bestLevel', 'ND1');
  await page.select('#worstLevel', 'HND2');
  await page.type('#bestExperienceInAuchi', 'Test');
  await page.type('#worstExperienceInAuchi', 'Test');

  // We need a photo. Since we can't easily upload one via file chooser without an element handle,
  // let's just trigger the photo complete artificially via evaluate or upload a small 1x1 image.
  
  const elementHandle = await page.$('#photo-input');
  const fs = require('fs');
  fs.writeFileSync('test.png', Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64'));
  await elementHandle.uploadFile('test.png');
  
  // Wait for cropper to appear
  await page.waitForSelector('.crop-modal__actions .btn--primary');
  await page.click('.crop-modal__actions .btn--primary');

  // Wait for it to close
  await page.waitForTimeout(500);

  // Click generate
  await page.click('#generate-btn');
  
  console.log('Clicked generate');

  // Wait for a bit
  await page.waitForTimeout(3000);
  
  await browser.close();
})();
