const { chromium, webkit, devices } = require('playwright');

async function inspect(browserName, engine, viewport) {
  const browser = await engine.launch({
    headless: true,
    ...(browserName==='chromium'?{args:['--use-gl=angle','--use-angle=swiftshader','--enable-webgl','--ignore-gpu-blocklist']}:{})
  });
  const page = await browser.newPage({ viewport, deviceScaleFactor: 2, isMobile:true, hasTouch:true, reducedMotion:'no-preference'});
  const errors=[];
  page.on('pageerror',err=>errors.push('JS: '+err.message));
  page.on('console',msg=>{if(msg.type()==='error')errors.push('Console: '+msg.text().slice(0,180));});
  const response=await page.goto('https://wescaleit.com/',{waitUntil:'domcontentloaded',timeout:40000});
  await page.locator('[data-blob-scene] canvas').waitFor({state:'attached',timeout:15000});
  const readings=[];
  for(const afterMs of [2000,10000,23000]){
    await page.waitForTimeout(afterMs-(readings.at(-1)?.at||0));
    readings.push(await page.evaluate(at=>{
      const scene=document.querySelector('[data-blob-scene]');
      const stage=scene.querySelector('.blob-stage'), canvas=scene.querySelector('canvas'), poster=scene.querySelector('.blob-poster');
      const box=stage.getBoundingClientRect();
      return {at,ready:scene.classList.contains('is-ready'),mobile:matchMedia('(max-width:760px)').matches,
        reduced:matchMedia('(prefers-reduced-motion:reduce)').matches,stageWidth:stage.clientWidth,stageHeight:stage.clientHeight,
        layoutPx:Math.round(stage.clientWidth*stage.clientHeight),box:{width:Math.round(box.width),height:Math.round(box.height)},
        canvas:{width:canvas.width,height:canvas.height,opacity:getComputedStyle(canvas).opacity},poster:{visibility:getComputedStyle(poster).visibility},
        gpuSupported:!!document.createElement('canvas').getContext('webgl'),
        docHidden:document.hidden};
    },afterMs));
  }
  console.log(JSON.stringify({browserName,viewport,status:response.status(),readings,errors:errors.slice(0,8)}));
  await browser.close();
}
(async()=>{
 for(const [name,engine] of [['chromium',chromium],['webkit',webkit]]){
   try {await inspect(name,engine,{width:390,height:844});}
   catch(e){console.log(JSON.stringify({browserName:name,error:String(e).slice(0,600)}));}
 }
})().catch(e=>{console.error(e);process.exitCode=1;});
