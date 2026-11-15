const {chromium} = require(process.env.PLAYWRIGHT_CORE || 'playwright-core')
const assert = require('node:assert/strict')

const base = process.env.TERRATWIN_URL || 'http://127.0.0.1:5173'

;(async () => {
  const browser = await chromium.launch({executablePath:process.env.CHROME_PATH || '/usr/bin/google-chrome', headless:true, args:['--no-sandbox']})
  const page = await browser.newPage({viewport:{width:1280,height:800}, reducedMotion:'reduce'})
  try {
    for (const [world, count] of [['moon',2], ['mars',4]]) {
      await page.goto(`${base}/#/world/${world}`)
      await page.locator('.site-pin').first().waitFor()
      assert.equal(await page.locator('.site-pin').count(), count)
      const site = page.locator('.review-sites button').first()
      const name = (await site.locator('strong').textContent()).trim()
      await site.click()
      const pin = page.locator('.site-pin[aria-pressed="true"]')
      assert.equal(await pin.getAttribute('aria-label'), name)
      await page.waitForFunction(() => {
        const active = document.querySelector('.site-pin[aria-pressed="true"]')
        return active && !active.hidden && getComputedStyle(active).visibility !== 'hidden'
      })
    }
    console.log('Moon and Mars globe pins render and selected sites rotate into view')
  } finally {
    await browser.close()
  }
})().catch(error => {console.error(error);process.exitCode=1})
