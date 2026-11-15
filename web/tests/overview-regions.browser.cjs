// Requires Chrome and playwright-core; synthetic imagery is served only to the test browser.
const {chromium}=require(process.env.PLAYWRIGHT_CORE||'playwright-core');
const assert=require('node:assert/strict'),fs=require('node:fs');
const actual=JSON.parse(fs.readFileSync('web/public/data/atlas.json','utf8'));
const base=process.env.TERRATWIN_URL||'http://127.0.0.1:5173';
const first=actual.comparisons[0],earth=actual.sites.find(s=>s.id===first.earthId),target=actual.sites.find(s=>s.id===first.targetId);
const cards='.review-region-card';
async function openComparison(page,world){
 await page.goto(`${base}/?region-check=${world}#/world/${world}`);
 await page.locator('.review-sites button').first().click();
 await page.getByRole('button',{name:world==='earth'?'Compare with Moon ↗':'Compare with Earth ↗',exact:true}).click();
 await page.locator(cards).first().waitFor();
 assert.equal(await page.getByRole('tab',{name:'Overview',exact:true}).getAttribute('aria-selected'),'true');
}
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const errors=[];
 for(const width of [390,768,1440])for(const world of ['earth','moon']){
  const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});page.on('pageerror',e=>errors.push(e.message));
  await openComparison(page,world);
  const names=await page.locator(`${cards} h3`).allTextContents();assert.deepEqual(names,world==='earth'?[earth.name,target.name]:[target.name,earth.name]);
  assert.equal(await page.locator(`${cards} .review-region-placeholder`).count(),2);
  const expected=world==='earth'?[first.visuals.earth,first.visuals.target]:[first.visuals.target,first.visuals.earth];
  for(let i=0;i<2;i++)assert.equal(await page.locator(cards).nth(i).getByRole('link',{name:/Open imagery source/}).getAttribute('href'),actual.sources.find(s=>s.id===expected[i].sourceId).url);
  const [a,b]=await Promise.all([page.locator(cards).nth(0).boundingBox(),page.locator(cards).nth(1).boundingBox()]);
  assert.equal(a.height,b.height);assert.equal(a.width,b.width);
  if(width>660){assert.equal(a.y,b.y);assert(b.x>a.x)}else{assert.equal(a.x,b.x);assert(b.y>=a.y+a.height)}
  const frames=await page.locator('.review-region-image').evaluateAll(elements=>elements.map(e=>e.getBoundingClientRect().height));assert.deepEqual(frames,[160,160]);
  assert(await page.locator('.review-region-cards').evaluate(el=>!!(el.compareDocumentPosition([...el.parentElement.children].find(e=>e.tagName==='H2'))&Node.DOCUMENT_POSITION_FOLLOWING)));
  await page.locator(cards).first().locator('summary').click();
  const frameBefore=await page.locator('.review-region-image').first().boundingBox();
  const overflow=await page.locator('.review-region-details').first().evaluate(el=>{el.scrollTop=el.scrollHeight;return el.scrollHeight>el.clientHeight});assert(overflow);
  const frameAfter=await page.locator('.review-region-image').first().boundingBox();assert.deepEqual(frameBefore,frameAfter);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.locator(`${cards} details`).evaluateAll(elements=>elements.forEach(el=>{el.open=false}));
  await page.locator('.review-region-details').evaluateAll(elements=>elements.forEach(el=>{el.scrollTop=0}));
  await page.screenshot({path:`artifacts/overview-regions/${width}-${world}.png`,fullPage:true});
  await page.getByRole('tab',{name:'Evidence',exact:true}).click();assert.equal(await page.locator('.review-grid .review-visual').count(),2);
  await page.getByRole('button',{name:'Close comparison',exact:true}).click();await page.getByRole('complementary',{name:'Site details'}).waitFor();
  await page.close();console.log('Real pair order, source fallback, fixed frames, scrolling, tabs and close passed',width,world);
 }
 const fixture=structuredClone(actual),pair=fixture.comparisons[0];
 pair.visuals.earth={...pair.visuals.earth,localPath:'/__test-earth.svg',missingReason:null};
 pair.visuals.target={...pair.visuals.target,localPath:'/__test-moon.svg',missingReason:null};
 fixture.sites.push({...target,id:'TEST-TARGET-2',name:'Test second lunar region'});
 fixture.comparisons.push({...pair,id:'TEST-PAIR-2',targetId:'TEST-TARGET-2',visuals:{earth:{...pair.visuals.earth,localPath:'/__test-broken.svg'},target:{...pair.visuals.target,localPath:'/__test-second.svg'}}});
 const page=await browser.newPage({viewport:{width:390,height:1000},reducedMotion:'reduce'});page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/data/atlas.json',route=>route.fulfill({json:fixture}));
 await page.route('**/__test-*.svg',route=>route.request().url().includes('broken')?route.fulfill({status:404,body:'Missing'}):route.fulfill({contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg" width="240" height="100"><rect width="240" height="100" fill="#55d6e8"/></svg>'}));
 await openComparison(page,'moon');
 const imageSources=await page.locator(`${cards} img`).evaluateAll(images=>images.map(img=>new URL(img.src).pathname));assert.deepEqual(imageSources,['/__test-moon.svg','/__test-earth.svg']);
 await page.waitForFunction(()=>[...document.querySelectorAll('.review-region-image img')].every(img=>img.complete&&img.naturalWidth>0));
 assert.equal(await page.locator(`${cards} img`).first().evaluate(img=>getComputedStyle(img).objectFit),'contain');
 await page.screenshot({path:'artifacts/overview-regions/image-present-test-only.png',fullPage:true});
 await openComparison(page,'earth');
 await page.locator(cards).first().locator('summary').click();
 await page.getByRole('button',{name:'Next match',exact:true}).click();
 await page.locator(cards).first().getByText('Site imagery unavailable',{exact:true}).waitFor();
 assert.equal(await page.locator(cards).first().getByRole('link',{name:/Open imagery source/}).count(),1);
 assert.equal(await page.locator(`${cards} h3`).nth(1).innerText(),'Test second lunar region');
 assert.equal(await page.locator(`${cards} details[open]`).count(),0);
 assert.equal(await page.locator('.review-region-image').first().evaluate(el=>el.getBoundingClientRect().height),160);
 await page.getByRole('button',{name:'Previous match',exact:true}).click();
 await page.waitForFunction(()=>[...document.querySelectorAll('.review-region-image img')].length===2&&[...document.querySelectorAll('.review-region-image img')].every(img=>img.complete&&img.naturalWidth>0));
 assert.equal(await page.locator(`${cards} details[open]`).count(),0);
 assert.equal(await page.locator(`${cards} img`).first().evaluate(img=>new URL(img.src).pathname),'/__test-earth.svg');
 console.log('Test-only real-image loading, reverse-order visual binding, broken-image fallback and pair-scoped error/disclosure resets passed');
 assert.deepEqual(errors,[]);await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
