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
 assert.match(await smart.locator('h1').innerText(),/operación/i);
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
await home.evaluate(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=580){scrollTo(0,y);await new Promise(r=>setTimeout(r,32))}scrollTo(0,0)});
await home.screenshot({path:'test-results/mca-desktop.png',fullPage:true,animations:'disabled'});

const mobile=await newPage('index.html',390,844,true);
await mobile.waitForTimeout(3400);
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
await check('Sin errores de JavaScript',async()=>assert.deepEqual(pageErrors,[]));
await mobile.goto(origin+'index.html',{waitUntil:'domcontentloaded'});
await mobile.waitForTimeout(3400);
await mobile.evaluate(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=430){scrollTo(0,y);await new Promise(r=>setTimeout(r,34))}scrollTo(0,0)});
await mobile.screenshot({path:'test-results/mca-mobile.png',fullPage:true,animations:'disabled'});
await smart.screenshot({path:'test-results/smart-desktop.png',fullPage:true,animations:'disabled'});
await browser.close();
console.log(passed+'/'+(passed+failures.length)+' pruebas aprobadas');
if(failures.length){console.error(JSON.stringify(failures,null,2));process.exitCode=1}
