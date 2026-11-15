const {chromium}=require(process.env.PLAYWRIGHT_CORE||'playwright-core');
const assert=require('node:assert/strict'),fs=require('node:fs');
const base=process.env.TERRATWIN_URL||'http://127.0.0.1:5173';
const actual=JSON.parse(fs.readFileSync('web/public/data/atlas.json','utf8'));
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const errors=[];
 for(const width of [320,390,768,1440]){
  const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});page.on('pageerror',e=>errors.push(e.message));
  const heights=[];
  for(const [state,route] of [['home','#/'],['earth','#/world/earth'],['method','#/method']]){
   await page.goto(`${base}/?motion-check=${state}-${width}${route}`);
   if(state==='earth')await page.getByRole('complementary',{name:'World overview'}).waitFor();
   if(state==='method')await page.getByRole('heading',{name:'Criteria and data coverage',exact:true}).waitFor();
   await page.waitForTimeout(150);
   heights.push((await page.locator('.masthead').boundingBox()).height);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`overflow ${state} ${width}`);
   assert.equal(await page.locator('.floating-astronaut').count(),4);
   assert.equal(await page.locator('.floating-astronaut').first().evaluate(el=>getComputedStyle(el).animationName),'none');
   if(state!=='home')assert.equal(await page.getByRole('link',{name:'Back to all worlds',exact:true}).locator('svg').count(),1);
   if(width===390||width===1440)await page.screenshot({path:`artifacts/astronaut-refresh/${width}-${state}.png`,fullPage:true});
  }
  assert.equal(new Set(heights).size,1,`inconsistent header ${width}: ${heights}`);
  assert((await page.locator('.review-shell').boundingBox()).width>=width-49);
  console.log('Equal headers, fluid layout, astronaut art, icon backs, reduced motion and no overflow',width);
  await page.close();
 }
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'no-preference'});page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/data/atlas.json',async route=>{await new Promise(resolve=>setTimeout(resolve,900));await route.fulfill({json:actual})});
 await page.goto(`${base}/?motion-load=method#/method`);
 await page.getByRole('status').getByText('Gathering methods and sources…').waitFor();
 assert.equal(await page.getByRole('status').locator('.chibi-astronaut').count(),1);
 await page.getByRole('heading',{name:'Criteria and data coverage',exact:true}).waitFor();
 const ids=new Set();
 const categories=page.getByRole('tablist',{name:'Criteria categories'}).getByRole('tab');
 const count=await categories.count();
 for(let category=0;category<count;category++){
  const tab=categories.nth(category);await tab.click();await page.waitForFunction(index=>document.querySelectorAll('.criteria-category-tabs [role=tab]')[index].getAttribute('aria-selected')==='true',category);
  const total=await page.locator('.criterion-dots button').count()||1;
  for(let i=0;i<total;i++){
   if(i>0){await page.getByRole('button',{name:'Next criterion',exact:true}).click();await page.waitForFunction(expected=>document.querySelector('.criterion-position')?.textContent?.trim().startsWith(expected+' /'),i+1)}
   ids.add((await page.locator('.criterion-topline>span').first().innerText()).split(' /')[0]);
  }
 }
 assert.deepEqual([...ids].sort(),actual.criteria.map(item=>item.id).sort());
 await page.getByRole('tablist',{name:'Criteria categories'}).getByRole('tab').first().focus();await page.keyboard.press('ArrowRight');
 await page.waitForFunction(()=>document.querySelectorAll('.criteria-category-tabs [role=tab]')[1].getAttribute('aria-selected')==='true');
 console.log('Astronaut data loader, animated category navigation, keyboard tabs and all dataset criteria accessible');
 await page.getByRole('link',{name:'Explore',exact:true}).click();await page.getByRole('complementary',{name:'World overview'}).waitFor();
 await page.locator('.review-sites button').first().click();await page.getByRole('complementary',{name:'Site details'}).waitFor();
 await page.getByRole('button',{name:'Compare with Moon ↗',exact:true}).click();await page.locator('.review-region-card').first().waitFor();
 await page.getByRole('tab',{name:'Evidence',exact:true}).click();await page.waitForFunction(()=>document.querySelector('#tab-1')?.getAttribute('aria-selected')==='true');
 await page.getByRole('button',{name:'Close comparison',exact:true}).click();await page.getByRole('complementary',{name:'Site details'}).waitFor();
 console.log('Animated route/site/comparison/tab changes and original close behavior passed');
 const home=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});home.on('pageerror',e=>errors.push(e.message));
 await home.addInitScript(()=>Object.defineProperty(document,'startViewTransition',{value:undefined,configurable:true}));
 let releaseTextures;const texturesReady=new Promise(resolve=>{releaseTextures=resolve});
 await home.route('**/textures/*.jpg',async route=>{await texturesReady;await route.continue()});
 await home.goto(`${base}/?loading-home#/`,{waitUntil:'domcontentloaded'});await home.getByRole('status').getByText('Loading Earth…',{exact:true}).waitFor();
 assert.equal(await home.locator('.globe-loading .chibi-astronaut').count(),3);
 releaseTextures();
 await home.waitForFunction(()=>document.querySelectorAll('.globe-loading').length===0);
 await home.getByRole('link',{name:'Explore the atlas',exact:false}).click();await home.getByRole('complementary',{name:'World overview'}).waitFor();
 console.log('Home texture astronaut loaders and navigation without View Transitions API passed');
 const fallback=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});fallback.on('pageerror',e=>errors.push(e.message));
 await fallback.addInitScript(()=>{const get=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return type.includes('webgl')?null:get.call(this,type,...args)}});
 await fallback.goto(`${base}/?software-check#/world/earth`);await fallback.locator('.software-sphere').waitFor();await fallback.waitForFunction(()=>document.querySelectorAll('.globe-loading').length===0);
 await fallback.getByRole('button',{name:'Zoom in on Earth',exact:true}).click();await fallback.getByRole('button',{name:'Reset Earth zoom',exact:true}).click();
 console.log('Software globe completes astronaut loading and retains zoom/reset');
 assert.deepEqual(errors,[]);
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
