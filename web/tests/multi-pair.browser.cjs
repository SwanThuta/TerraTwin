const {chromium} = require(process.env.PLAYWRIGHT_CORE || 'playwright-core')
const assert = require('node:assert/strict')
const fs = require('node:fs')

const atlas = JSON.parse(fs.readFileSync('web/public/data/atlas.json', 'utf8'))
const base = process.env.TERRATWIN_URL || 'http://127.0.0.1:5173'

async function checkPair(page, id, eligible) {
  const pair = atlas.comparisons.find(item => item.id === id)
  await page.getByText(new RegExp(`^${id} · .*${eligible ? 'ranked' : 'unranked: evidence incomplete'}$`)).waitFor()
  const report = page.getByRole('link', {name:/Download evidence PDF/})
  assert.equal(await report.getAttribute('href'), pair.reportPath)
  const response = await page.request.get(base + pair.reportPath)
  assert.equal(response.status(), 200)
  assert.equal(response.headers()['content-type'].includes('pdf'), true)
}

async function openSite(page, world, siteName, counterpart) {
  await page.goto(`${base}/#/world/${world}`)
  await page.locator('.review-sites button').filter({hasText:siteName}).click()
  await page.getByRole('button', {name:`Compare with ${counterpart} ↗`}).click()
}

;(async () => {
  const browser = await chromium.launch({executablePath:process.env.CHROME_PATH || '/usr/bin/google-chrome', headless:true, args:['--no-sandbox']})
  const page = await browser.newPage({viewport:{width:390,height:900}, reducedMotion:'reduce'})
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  try {
    const marius = atlas.sites.find(item => item.id === 'L02')
    await openSite(page, 'moon', marius.name, 'Earth')
    assert.equal(await page.getByLabel('Select matching site').locator('option').count(), 3)
    for (const id of ['P02','P03','P04']) {
      await page.getByLabel('Select matching site').selectOption(id)
      await checkPair(page, id, false)
      assert.equal(await page.getByText('Insufficient evidence', {exact:true}).count() > 0, true)
    }
    const marsSite = atlas.sites.find(item => item.id === 'M01')
    await openSite(page, 'mars', marsSite.name, 'Earth')
    await checkPair(page, 'P05', true)
    const earthSite = atlas.sites.find(item => item.id === 'E08')
    await openSite(page, 'earth', earthSite.name, 'Mars')
    await checkPair(page, 'P08', false)
    assert.deepEqual(errors, [])
    console.log('Real multi-pair Moon selection, Mars/Earth directions, rank labels, and reports passed')
  } finally {
    await browser.close()
  }
})().catch(error => {console.error(error); process.exit(1)})
