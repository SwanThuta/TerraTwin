/* Run with PLAYWRIGHT_CORE pointing to an installed playwright-core module. */
const {chromium}=require(process.env.PLAYWRIGHT_CORE||'/tmp/terratwin-browser/node_modules/playwright-core');
const assert=require('node:assert/strict'),fs=require('node:fs');
const atlas=JSON.parse(fs.readFileSync('web/public/data/atlas.json','utf8'));
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const pages=await Promise.all([5174,5173].map(async port=>{
   const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
   page.on('pageerror',e=>{throw e});
   // Isolate UI parity from different release contents. Neither server's data is modified.
   await page.route('**/data/*.json',route=>route.fulfill({json:atlas}));
   return {page,port};
 }));
 const measurements=[];
 for(const width of [390,768,1440]){
  for(const state of ['home','world','site','overview','evidence','practice','sources','method']){
   const records=[];
   for(const {page,port} of pages){
    await page.setViewportSize({width,height:1000});
    await page.goto(`http://127.0.0.1:${port}/?qa=${width}-${state}${state==='home'?'#/':state==='method'?'#/method':'#/world/earth'}`);
    if(state!=='home'&&state!=='method')await page.getByRole('complementary',{name:'World overview'}).waitFor();
    if(['site','overview','evidence','practice','sources'].includes(state))await page.locator('.review-sites button').first().click();
    if(['overview','evidence','practice','sources'].includes(state)){
      await page.getByRole('button',{name:/Compare with Moon/}).click();
      if(state!=='overview')await page.getByRole('tab',{name:state==='practice'?'Field practice':state[0].toUpperCase()+state.slice(1),exact:true}).click();
    }
    if(state==='method')await page.getByRole('heading',{name:'Qualitative ratings'}).waitFor();
    await page.waitForTimeout(650);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`overflow ${state} ${width} ${port}`);
    const selectors=state==='home'?['.masthead','.home-copy','.observatory','.footer']:['.masthead','.review-shell','.review-card','.footer'];
    records.push(await page.evaluate(selectors=>selectors.flatMap(selector=>Array.from(document.querySelectorAll(selector)).map(el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return {selector,x:r.x,y:r.y,width:r.width,height:r.height,font:s.fontFamily,color:s.color,background:s.backgroundColor,radius:s.borderRadius}})),selectors));
    await page.screenshot({path:`artifacts/reference-port/${width}-${state}-${port===5174?'reference':'destination'}.png`,fullPage:true});
   }
   assert.deepEqual(records[0],records[1],`geometry/style mismatch ${width} ${state}`);
   measurements.push({width,state,geometryAndStyles:'identical'});
   console.log('matched',width,state);
  }
 }
 fs.writeFileSync('artifacts/reference-port/layout-results.json',JSON.stringify(measurements,null,2)+'\n');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
