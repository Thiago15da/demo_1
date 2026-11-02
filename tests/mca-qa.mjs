import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';

const origin=process.env.SITE_URL||'http://127.0.0.1:8765/';
await mkdir('test-results',{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const failures=[];const pageErrors=[];let passed=0;
const check=async (label,fn)=>{
 try{await fn();passed++;console.log('PASS',label)}
 catch(e){failures.push({label,error:String(e)});console.error('FAIL',label,e?.stack||e)}
};
async function newPage(url,width=1440,height=900,mobile=false){
 const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1,isMobile:mobile,hasTouch:mobile});
 page.on('pageerror',e=>pageErrors.push(url+': '+e.message));
 await page.goto(origin+url,{waitUntil:'domcontentloaded'});
 return page;
}
const home=await newPage('index.html');
await home.waitForTimeout(3500);
await home.screenshot({path:'test-results/mca-desktop-first-impression.png',fullPage:false,animations:'disabled'});
await check('MCA: identidad industrial y apertura se desmonta',async()=>{
 assert.match(await home.title(),/MCA.*Desarrollo industrial/i);
 assert.match(await home.locator('h1').innerText(),/industria/i);
 assert.equal(await home.locator('#opening').count(),0);
 assert.equal(await home.locator('body').innerText().then(t=>/CELA|Centro Educativo de las Américas/.test(t)),false);
 assert.equal(await home.locator('h1').count(),1);
});
await check('MCA: ocho capacidades publicadas y CTA operativo',async()=>{
 assert.equal(await home.locator('.cap-card').count(),8);
 await home.locator('.cap-card a[href="parques-industriales.html"]').first().click();
 await home.waitForURL(/parques-industriales/);
 assert.match(await home.locator('h1').innerText(),/industriales/i);
});
await check('Parques: masterplan interactivo por clic',async()=>{
 await home.locator('.lot[data-lot="B"]').click();
 assert.match(await home.locator('#lotTitle').innerText(),/Plataforma logística/i);
 assert.ok(await home.locator('.lot[data-lot="B"]').evaluate(e=>e.classList.contains('selected')));
});
await check('Parques: masterplan accesible con teclado',async()=>{
 await home.locator('.lot[data-lot="E"]').focus();
 await home.keyboard.press('Enter');
 assert.match(await home.locator('#lotTitle').innerText(),/Soporte operativo/i);
 await home.locator('.lot[data-lot="A"]').focus();
 await home.keyboard.press('Space');
 assert.match(await home.locator('#lotTitle').innerText(),/Industria general/i);
});
const projects=await newPage('proyectos.html');
await check('Proyectos: catálogo JSON carga cuatro proyectos reales publicados',async()=>{
 await projects.locator('.project-card').first().waitFor({timeout:12000});
 assert.equal(await projects.locator('.project-card').count(),4);
 assert.match(await projects.locator('#projectsGrid').innerText(),/Parque Industrial y Logístico Paraná/i);
 assert.match(await projects.locator('#projectsGrid').innerText(),/Galpones industriales en Luque/i);
 assert.match(await projects.locator('#projectsGrid').innerText(),/Centro logístico MRA/i);
});
await check('Proyectos: filtrado por categoría',async()=>{
 await projects.locator('[data-filter="industrial"]').click();
 assert.equal(await projects.locator('.project-card').count(),2);
 assert.equal(await projects.locator('[data-filter="industrial"]').getAttribute('aria-pressed'),'true');
 await projects.locator('[data-filter="parques"]').click();
 assert.equal(await projects.locator('.project-card').count(),1);
});
await check('Proyectos: ficha y fuente abren y cierran',async()=>{
 await projects.locator('.project-info button').first().click();
 assert.equal(await projects.locator('#projectModal').getAttribute('aria-hidden'),'false');
 assert.match(await projects.locator('#modalTitle').innerText(),/Paraná/i);
 assert.match(await projects.locator('#modalArea').innerText(),/30.000 m²/);
 assert.match(await projects.locator('#modalSource').getAttribute('href'),/mcaconstructora.com/);
 await projects.keyboard.press('Escape');
 assert.equal(await projects.locator('#projectModal').getAttribute('aria-hidden'),'true');
});
const smart=await newPage('servicios-smart.html');
await check('Servicios Smart: identidad diferenciada y seis capacidades',async()=>{
 assert.match(await smart.locator('h1').innerText(),/operativa/i);
 assert.equal(await smart.locator('.smart-feature').count(),6);
 assert.match(await smart.locator('.header .brand-name').innerText(),/SMART/);
 assert.match(await smart.locator('body').innerText(),/Mantenimiento industrial/i);
});
const contact=await newPage('contacto.html?tipo=inversion');
await check('Contacto: inversión activa campos específicos',async()=>{
 assert.equal(await contact.locator('#contactType').inputValue(),'inversion');
 assert.equal(await contact.locator('#investorField').getAttribute('hidden'),null);
 await contact.locator('#contactType').selectOption('smart');
 assert.equal(await contact.locator('#investorField').getAttribute('hidden'),'');
});
await check('Contacto: WhatsApp prepara mensaje personalizado',async()=>{
 await contact.locator('#contactName').fill('Empresa de prueba');
 await contact.locator('#contactCompany').fill('Industria Demo SA');
 await contact.locator('#contactEmail').fill('contacto@ejemplo.com');
 await contact.locator('#contactLocation').fill('Central, Paraguay');
 await contact.locator('#contactDetails').fill('Necesito mantenimiento industrial programado');
 await contact.evaluate(()=>{window.__sent='';window.open=(url)=>{window.__sent=url;return {}}});
 await contact.locator('#sendWhatsApp').click();
 const u=await contact.evaluate(()=>window.__sent);
 assert.match(u,/wa\.me\/595981876316/);
 assert.match(decodeURIComponent(u),/Servicios Smart/);
 assert.match(decodeURIComponent(u),/mantenimiento industrial programado/);
});
await check('Contacto: email incluye asunto y mensaje',async()=>{
 await contact.locator('#sendEmail').click();
 const u=await contact.evaluate(()=>window.__sent);
 assert.match(u,/^mailto:camaidana@mcapy.solutions/);
 assert.match(decodeURIComponent(u),/Industria Demo SA/);
});
await check('Todas las páginas internas responden',async()=>{
 for(const slug of ['index.html','parques-industriales.html','proyectos.html','servicios-smart.html','contacto.html','assets/projects.json','assets/style.css','assets/app.js']){
  const res=await contact.request.get(origin+slug);
  assert.equal(res.status(),200,slug);
 }
});
await home.goto(origin+'index.html',{waitUntil:'domcontentloaded'});
await home.waitForTimeout(3300);
await home.evaluate(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=580){scrollTo(0,y);await new Promise(r=>setTimeout(r,32))}scrollTo({top:0,behavior:'instant'})});
await home.waitForTimeout(450);
await home.locator('.project-card img').evaluateAll(imgs=>Promise.all(imgs.map(img=>img.decode().catch(()=>{}))));
await home.screenshot({path:'test-results/mca-desktop.png',fullPage:true,animations:'disabled'});

const mobile=await newPage('index.html',390,844,true);
await mobile.waitForTimeout(3400);
await mobile.screenshot({path:'test-results/mca-mobile-first-impression.png',fullPage:false,animations:'disabled'});
await check('Móvil: menú funciona y navegación interna',async()=>{
 await mobile.locator('#menuToggle').click();
 assert.equal(await mobile.locator('#menuToggle').getAttribute('aria-expanded'),'true');
 await mobile.locator('#mobileNav a[href="servicios-smart.html"]').click();
 await mobile.waitForURL(/servicios-smart/);
 assert.match(await mobile.title(),/Servicios Smart/);
});
await check('Móvil: sin scroll lateral 320, 390, 768, 1440',async()=>{
 for(const w of [320,390,768,1440]){
  await mobile.setViewportSize({width:w,height:844});
  const v=await mobile.evaluate(()=>({w:innerWidth,scroll:document.documentElement.scrollWidth}));
  assert.ok(v.scroll<=v.w+2,JSON.stringify(v));
 }
 await mobile.setViewportSize({width:390,height:844});
});
await check('La imagen de portada se renderiza sin enlaces rotos',async()=>{
 const img=await home.locator('.hero-media img').evaluate(el=>({loaded:el.complete&&el.naturalWidth>0,src:el.getAttribute('src')}));
 assert.ok(img.loaded,JSON.stringify(img));
});
await check('Fotografías críticas disponibles desde el propio repositorio',async()=>{
 for(const src of ['assets/media/industrial-detail.jpg','assets/media/park-parana.jpg','assets/media/smart-people.jpg','assets/media/smart-machinery.jpg']){
  const response=await mobile.request.get(origin+src);assert.equal(response.status(),200,src);assert.ok(Number(response.headers()['content-length']||0)>3000,src);
 }
});
await check('Ninguna página desborda o recorta sus títulos de 320 a 1600 px',async()=>{
 for(const slug of ['index.html','parques-industriales.html','proyectos.html','servicios-smart.html','contacto.html']){
  const page=await newPage(slug,390,820);
  await page.waitForTimeout(180);
  for(const width of [320,390,768,1024,1440,1600]){
   await page.setViewportSize({width,height:880});
   const x=await page.evaluate(()=>{
    const headings=[...document.querySelectorAll('h1,h2,h3')].filter(el=>{
      const s=getComputedStyle(el),r=el.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&r.height>0;
    });
    return {vw:innerWidth,doc:document.documentElement.scrollWidth,headings:headings.map(el=>{const r=el.getBoundingClientRect();const parent=el.parentElement.getBoundingClientRect();return {label:el.innerText.slice(0,28),x:r.x,right:r.right,client:el.clientWidth,scroll:el.scrollWidth,parentWidth:parent.width}}),brand:document.querySelector('.header .brand-asset')?.getBoundingClientRect().width,opening:document.querySelectorAll('#opening').length};
   });
   assert.ok(x.doc<=x.vw+2,slug+' '+width+'px: scroll '+JSON.stringify(x));
   assert.equal(x.opening,0,slug+' intro overlay');
   if(slug!=='servicios-smart.html')assert.ok(x.brand>30&&x.brand<=95,slug+' logo demasiado grande: '+x.brand);
   for(const h of x.headings){
    assert.ok(h.x>=-3&&h.right<=width+3,slug+' '+width+' título fuera del viewport: '+JSON.stringify(h));
    assert.ok(h.scroll<=h.client+4,slug+' '+width+' título recortado: '+JSON.stringify(h));
   }
  }
  await page.close();
 }
});
await check('Portada y fichas usan fotografías locales que cargan',async()=>{
 await home.goto(origin+'index.html',{waitUntil:'domcontentloaded'});
 await home.locator('.project-card').first().waitFor();
 for(const sel of ['.header .brand-asset','.hero-media img','.park-feature-media img','.smart-showcase-photo img','.project-card img']){
  const el=home.locator(sel).first();await el.scrollIntoViewIfNeeded();
  await el.evaluate(img=>img.decode().catch(()=>{}));
  assert.ok(await el.evaluate(img=>img.complete&&img.naturalWidth>0),'Imagen sin cargar: '+sel);
 }
});
await check('Todas las fotografías del portafolio y Smart se muestran sin recuadros vacíos',async()=>{
 for(const [page,selector] of [[home,'.project-card img'],[projects,'.project-card img'],[smart,'.smart-showcase-photo img']]){
  if(page===home)await home.goto(origin+'index.html',{waitUntil:'domcontentloaded'});
  await page.locator(selector).first().waitFor({timeout:10000});
  const images=page.locator(selector);
  for(let i=0;i<await images.count();i++){
    const el=images.nth(i);
    await el.scrollIntoViewIfNeeded();
    await el.evaluate(img=>img.decode().catch(()=>{}));
    const info=await el.evaluate(img=>({loaded:img.complete&&img.naturalWidth>0,src:img.getAttribute('src')}));
    assert.ok(info.loaded,JSON.stringify(info));
  }
 }
});
await check('Sin errores de JavaScript',async()=>assert.deepEqual(pageErrors,[]));
await mobile.goto(origin+'index.html',{waitUntil:'domcontentloaded'});
await mobile.waitForTimeout(3400);
await mobile.evaluate(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=430){scrollTo(0,y);await new Promise(r=>setTimeout(r,34))}scrollTo({top:0,behavior:'instant'})});
await mobile.waitForTimeout(450);
await mobile.locator('.project-card img').evaluateAll(imgs=>Promise.all(imgs.map(img=>img.decode().catch(()=>{}))));
await mobile.screenshot({path:'test-results/mca-mobile.png',fullPage:true,animations:'disabled'});
await smart.locator('.smart-showcase-photo img').evaluate(img=>img.decode().catch(()=>{}));
await smart.screenshot({path:'test-results/smart-desktop.png',fullPage:true,animations:'disabled'});
await browser.close();
console.log(passed+'/'+(passed+failures.length)+' pruebas aprobadas');
if(failures.length){console.error(JSON.stringify(failures,null,2));process.exitCode=1}
