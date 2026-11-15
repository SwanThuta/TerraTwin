const {chromium}=require(process.env.PLAYWRIGHT_CORE||'playwright-core');
const assert=require('node:assert/strict'),fs=require('node:fs');
const base=process.env.TERRATWIN_URL||'http://127.0.0.1:5173';
const actual=JSON.parse(fs.readFileSync('web/public/data/atlas.json','utf8'));
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function aligned(pill,button){const [a,b]=await Promise.all([pill.boundingBox(),button.boundingBox()]);assert(Math.abs(a.x-b.x)<2);assert(Math.abs(a.y-b.y)<2);assert(Math.abs(a.width-b.width)<2)}
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const errors=[],page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'no-preference'});page.on('pageerror',error=>errors.push(error.message));
 await page.goto(`${base}/?criteria-polish=motion#/method`);await page.getByRole('heading',{name:'Criteria and data coverage',exact:true}).waitFor();
 const tabs=page.getByRole('tablist',{name:'Criteria categories'}),pill=tabs.locator('.sliding-highlight'),terrain=tabs.getByRole('tab').first(),geology=tabs.getByRole('tab').nth(1);
 await sleep(850);const selectedPosition=await pill.evaluate(el=>el.style.transform);
 assert((await pill.evaluate(el=>getComputedStyle(el).transitionDuration)).includes('0.72s'));
 await geology.hover();await sleep(120);assert.notEqual(await pill.evaluate(el=>el.style.transform),selectedPosition);assert.equal(await terrain.getAttribute('aria-selected'),'true');
 await page.mouse.move(5,5);await sleep(120);assert.equal(await pill.evaluate(el=>el.style.transform),selectedPosition);assert.equal(await terrain.getAttribute('aria-selected'),'true');
 await geology.click();await page.waitForFunction(()=>document.querySelector('#criteria-tab-geology')?.getAttribute('aria-selected')==='true');await sleep(800);assert.equal(await page.locator('.criterion-figure').getAttribute('data-visual'),'layers');
 console.log('Slow continuous hover/selected pill, return to selected tab and immediate semantic selection passed');
 await terrain.click();await page.getByRole('button',{name:'Show criterion C05',exact:true}).click();await sleep(800);
 const math=page.locator('.criterion-equation math');assert.equal(await math.count(),1);assert.equal(await math.evaluate(el=>el.namespaceURI),'http://www.w3.org/1998/Math/MathML');assert(await math.locator('mfrac').count()>0);assert(await math.locator('msqrt').count()>0);assert(await math.locator('msup').count()>0);assert.equal(await math.getAttribute('aria-label'),actual.criteria.find(item=>item.id==='C05').rule);
 const card=await page.locator('.criteria-coverage').boundingBox(),pager=await page.locator('.criterion-pager').boundingBox();assert(pager.x<card.x+card.width/3);assert(pager.x+pager.width<card.x+card.width/2);
 await page.locator('.criteria-coverage').screenshot({path:'artifacts/criteria-polish/1440-slope.png'});
 await page.getByRole('button',{name:'Show criterion C06',exact:true}).click();await sleep(450);await page.locator('.criteria-coverage').screenshot({path:'artifacts/criteria-polish/1440-roughness.png'});
 console.log('Native MathML roots, fractions, powers, original formula provenance and left pager passed');
 const kinds=new Set(),svgBodies=new Set(),ids=new Set();
 const groups=tabs.getByRole('tab'),count=await groups.count();
 await page.emulateMedia({reducedMotion:'reduce'});
 for(let group=0;group<count;group++){
  await groups.nth(group).click();const n=await page.locator('.criterion-dots button').count()||1;
  for(let i=0;i<n;i++){
   if(i)await page.getByRole('button',{name:'Next criterion',exact:true}).click();
   kinds.add(await page.locator('.criterion-figure').getAttribute('data-visual'));svgBodies.add(await page.locator('.criterion-figure svg>g').innerHTML());ids.add((await page.locator('.criterion-topline>span').first().innerText()).split(' /')[0]);
  }
 }
 assert.equal(kinds.size,16);assert.equal(svgBodies.size,16);assert.deepEqual([...ids].sort(),actual.criteria.map(item=>item.id).sort());
 for(const width of [320,390,768,1440]){
  await page.setViewportSize({width,height:1000});await groups.first().click();await page.getByRole('button',{name:'Show criterion C05',exact:true}).click();
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`overflow ${width}`);
  const slide=await page.locator('.criterion-copy').boundingBox(),visual=await page.locator('.criterion-figure').boundingBox();
  if(width>760)assert(visual.x>slide.x+slide.width);else assert(visual.y>=slide.y+slide.height);
  await geology.hover();assert.equal(await pill.evaluate(el=>getComputedStyle(el).transitionDuration),'0s');await aligned(pill,geology);
  const active=await tabs.getByRole('tab',{selected:true}).boundingBox();assert(active.width>0);
  if(width===390||width===1440)await page.locator('.criteria-coverage').screenshot({path:`artifacts/criteria-polish/${width}-equation.png`});
  console.log('Distinct concepts, responsive diagram/math layout and reduced-motion highlight',width);
 }
 await page.setViewportSize({width:1440,height:1000});await page.getByRole('link',{name:'Explore',exact:true}).click();await page.locator('.review-sites button').first().click();await page.getByRole('button',{name:'Compare with Moon ↗',exact:true}).click();
 const comparisonTabs=page.getByRole('tablist',{name:'Comparison details'});await comparisonTabs.getByRole('tab',{name:'Evidence',exact:true}).click();await aligned(comparisonTabs.locator('.sliding-highlight'),comparisonTabs.getByRole('tab',{name:'Evidence',exact:true}));
 await comparisonTabs.getByRole('tab',{name:'Evidence',exact:true}).focus();await page.keyboard.press('ArrowRight');assert.equal(await comparisonTabs.getByRole('tab',{name:'Field practice',exact:true}).getAttribute('aria-selected'),'true');
 await page.getByRole('button',{name:'Close comparison',exact:true}).click();await page.getByRole('complementary',{name:'Site details'}).waitFor();
 assert.deepEqual(errors,[]);console.log('Comparison sliding tabs, keyboard focus, tab content and close behavior passed');await browser.close();
})().catch(error=>{console.error(error);process.exit(1)});
