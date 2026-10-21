const { chromium, webkit, devices } = require('playwright');
const BASE_URL=process.env.BASE_URL || 'https://wescaleit.com';

async function inspect(browserName, engine, viewport) {
  const browser = await engine.launch({
    headless: true,
    ...(browserName==='chromium'?{args:['--use-gl=angle','--use-angle=swiftshader','--enable-webgl','--ignore-gpu-blocklist']}:{})
  });
  const page = await browser.newPage({ viewport, deviceScaleFactor: 2, isMobile:true, hasTouch:true, reducedMotion:'no-preference'});
  const errors=[];
  // Instrument only the QA browser; do not alter the public website.
  await page.route('**/js/hero-blob.js*', async route => {
    const response=await route.fetch();
    const original=await response.text();
    const body=original.replace('ready = true;', 'ready = true;window.__splineDebugApp=app;');
    await route.fulfill({response,body});
  });
  page.on('pageerror',err=>errors.push('JS: '+err.message));
  page.on('console',msg=>{if(msg.type()==='error')errors.push('Console: '+msg.text().slice(0,180));});
  const response=await page.goto(BASE_URL+'/',{waitUntil:'domcontentloaded',timeout:40000});
  await page.locator('[data-blob-scene] canvas').waitFor({state:'attached',timeout:15000});
  const readings=[];
  for(const afterMs of [2000,10000,23000]){
    await page.waitForTimeout(afterMs-(readings.at(-1)?.at||0));
    const data=await page.evaluate(at=>{
      const scene=document.querySelector('[data-blob-scene]');
      const stage=scene.querySelector('.blob-stage'), canvas=scene.querySelector('canvas'), poster=scene.querySelector('.blob-poster');
      const box=stage.getBoundingClientRect();
      return {at,ready:scene.classList.contains('is-ready'),mobile:matchMedia('(max-width:760px)').matches,
        reduced:matchMedia('(prefers-reduced-motion:reduce)').matches,stageWidth:stage.clientWidth,stageHeight:stage.clientHeight,
        layoutPx:Math.round(stage.clientWidth*stage.clientHeight),box:{width:Math.round(box.width),height:Math.round(box.height)},
        canvas:{width:canvas.width,height:canvas.height,opacity:getComputedStyle(canvas).opacity},poster:{visibility:getComputedStyle(poster).visibility},
        gpuSupported:!!document.createElement('canvas').getContext('webgl'),
        docHidden:document.hidden,
        trackedObjects:window.__splineDebugApp?.getAllObjects
          ?window.__splineDebugApp.getAllObjects().filter(o=>/Unternehmen|mesh_100/i.test(o.name)).slice(0,4)
            .map(o=>({name:o.name,rotation:o.rotation?{x:o.rotation.x,y:o.rotation.y,z:o.rotation.z}:null}))
          :undefined
      };
    },afterMs);
    readings.push(data);

  }
  const readyReadings=readings.filter(x=>x.ready);
  const loaded=readings.filter(x=>x.ready && x.trackedObjects?.length);
  if(loaded.length>=2){
    const ys=loaded.map(x=>x.trackedObjects[0].rotation?.y).filter(Number.isFinite);
    console.log('TRACKED_ROTATION '+JSON.stringify({browserName,ys}));
  }
  if(readings.some(x=>x.stageWidth>760||x.stageHeight>550)) {
    throw new Error(browserName + ': Spline still uses an oversized mobile canvas');
  }
  console.log(JSON.stringify({browserName,viewport,status:response.status(),readings,errors:errors.slice(0,8)}));
  await browser.close();
}
async function inspectBadges() {
  const browser=await chromium.launch({headless:true});
  const page=await browser.newPage({viewport:{width:1180,height:820}});
  await page.goto(BASE_URL+'/',{waitUntil:'domcontentloaded',timeout:25000});
  const bounds=await page.locator('.employer-awards img').evaluateAll(async images => {
    await Promise.all(images.map(i=>i.decode()));
    return images.map(img=>{
      const canvas=document.createElement('canvas');
      canvas.width=300;canvas.height=400;
      const ctx=canvas.getContext('2d',{willReadFrequently:true});
      ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.drawImage(img,0,0,canvas.width,canvas.height);
      const data=ctx.getImageData(0,0,300,400).data;
      let minX=300,minY=400,maxX=0,maxY=0,count=0;
      for(let y=0;y<400;y++)for(let x=0;x<300;x++){
        const p=(y*300+x)*4;
        if(data[p+3]>120 && (data[p]<242||data[p+1]<242||data[p+2]<242)){
          minX=Math.min(minX,x);minY=Math.min(minY,y);
          maxX=Math.max(maxX,x);maxY=Math.max(maxY,y);count++;
        }
      }
      return {year:img.alt.split(' ').at(-1),bbox:[minX,minY,maxX,maxY],widthPercent:Math.round((maxX-minX+1)/3),heightPercent:Math.round((maxY-minY+1)/4),coloredPixelPercent:Math.round(count/1200)};
    });
  });
  console.log('LOGO_BOUNDS '+JSON.stringify(bounds));
  const byYear=Object.fromEntries(bounds.map(b=>[b.year,b]));
  const adjacent=byYear['2026'],latest=byYear['2027'];
  if(!adjacent||!latest)throw new Error('Missing year badges');
  if(Math.abs(adjacent.widthPercent-latest.widthPercent)>3 || Math.abs(adjacent.heightPercent-latest.heightPercent)>3) {
    throw new Error('2027 artboard is still inconsistent with 2026');
  }
  await browser.close();
}
(async()=>{
 await inspectBadges();
 for(const [name,engine] of [['chromium',chromium],['webkit',webkit]]){
   try {await inspect(name,engine,{width:390,height:844});}
   catch(e){console.log(JSON.stringify({browserName:name,error:String(e).slice(0,600)}));}
 }
})().catch(e=>{console.error(e);process.exitCode=1;});
