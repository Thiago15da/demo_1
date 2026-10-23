import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const origin = process.env.SITE_URL || 'http://127.0.0.1:8765/';
await mkdir('test-results',{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const failures=[];const errors=[];let passed=0;
async function check(label,fn){try{await fn();passed++;console.log('PASS',label)}catch(e){failures.push({label,error:String(e)});console.error('FAIL',label,e?.stack||e)}}
const desktop=await browser.newPage({viewport:{width:1440,height:900}});
desktop.on('pageerror',e=>errors.push('desktop: '+e.message));
await desktop.goto(origin,{waitUntil:'domcontentloaded'});
await desktop.waitForTimeout(3350);
await check('Identidad del CELA, niveles e información',async()=>{
 const text=await desktop.locator('body').innerText();
 assert.match(await desktop.title(),/CELA.*Centro Educativo de las Américas/);
 for(const value of ['Mariano Roque Alonso','24 años','Educación Inicial','Escolar Básica','Educación Media'])assert.ok(text.includes(value),value);
 assert.equal(/Muebles RBM|PIKININUS|OHANA|Bozzetto/.test(text),false);
 assert.equal(await desktop.locator('h1').count(),1);
});
await check('Entrada cinematográfica no deja capa bloqueando',async()=>{
 assert.equal(await desktop.locator('#intro').count(),0);
 await desktop.locator('.nav-links a[href="#niveles"]').click();
 assert.equal(await desktop.evaluate(()=>location.hash),'#niveles');
});
await check('Logo SVG y foto principal cargados',async()=>{
 for(const sel of ['.hero-photo.main-photo img','.brand img']){
 const el=desktop.locator(sel).first();
 await el.evaluate(img=>img.decode().catch(()=>{}));
 assert.ok(await el.evaluate(img=>img.complete&&img.naturalWidth>0),sel+' no cargó');
 }
});
await check('Selector de niveles muestra información específica',async()=>{
 await desktop.locator('#tab-basica').click();
 assert.equal(await desktop.locator('#tab-basica').getAttribute('aria-selected'),'true');
 assert.match(await desktop.locator('#levelTitle').innerText(),/pregunta/i);
 await desktop.locator('#tab-media').click();
 assert.match(await desktop.locator('#levelTitle').innerText(),/lejos/i);
 await desktop.locator('#tab-inicial').click();
 assert.match(await desktop.locator('#levelTitle').innerText(),/magia/i);
});
await check('Selector de niveles opera con teclado',async()=>{
 await desktop.locator('#tab-inicial').focus();await desktop.keyboard.press('ArrowDown');
 assert.equal(await desktop.evaluate(()=>document.activeElement?.id),'tab-basica');
 await desktop.keyboard.press('End');
 assert.equal(await desktop.locator('#tab-media').getAttribute('aria-selected'),'true');
 await desktop.keyboard.press('Home');
 assert.equal(await desktop.locator('#tab-inicial').getAttribute('aria-selected'),'true');
});
await check('Consultar un nivel precompleta admisión',async()=>{
 await desktop.locator('#tab-media').click();
 await desktop.locator('#levelLink').click();
 assert.equal(await desktop.locator('#academicLevel').inputValue(),'Educación Media');
 assert.equal(await desktop.evaluate(()=>location.hash),'#admision');
});
await check('Formulario arma consulta de WhatsApp sin guardar datos',async()=>{
 await desktop.locator('#adultName').fill('Responsable prueba');
 await desktop.locator('#academicLevel').selectOption('Escolar Básica');
 await desktop.locator('#questionType').selectOption({label:'Vacantes y turnos'});
 await desktop.locator('#message').fill('Quiero saber los horarios');
 await desktop.evaluate(()=>{window.__sent='';window.open=(url)=>{window.__sent=url;return {}}});
 await desktop.locator('#inquiryForm button[type=submit]').click();
 const link=await desktop.evaluate(()=>window.__sent);
 assert.match(link,/wa\.me\/595986251205/);
 for(const value of ['Responsable prueba','Escolar Básica','Quiero saber los horarios']) assert.match(decodeURIComponent(link),new RegExp(value));
});
await check('Acordeón de preguntas se expande',async()=>{
 const faq=desktop.locator('.faq-items details').first();
 await faq.locator('summary').click();assert.equal(await faq.getAttribute('open'),'');
});
await check('Fotografías de secciones cargan',async()=>{
 const imgs=desktop.locator('.about-photo img,.life-media img,.visit-photo>img');
 const failed=[];
 for(let i=0;i<await imgs.count();i++){const el=imgs.nth(i);await el.scrollIntoViewIfNeeded();await el.evaluate(img=>img.decode().catch(()=>{}));if(!(await el.evaluate(img=>img.complete&&img.naturalWidth>0)))failed.push(await el.getAttribute('src'));}
 assert.deepEqual(failed,[]);
});
await desktop.goto(origin,{waitUntil:'domcontentloaded'});await desktop.waitForTimeout(3200);
await desktop.evaluate(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=630){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,55))}window.scrollTo(0,0)});
await desktop.screenshot({path:'test-results/cela-escritorio.png',fullPage:true,animations:'disabled'});

const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
mobile.on('pageerror',e=>errors.push('mobile: '+e.message));
await mobile.goto(origin,{waitUntil:'domcontentloaded'});await mobile.waitForTimeout(3300);
await check('Navegación móvil abre y cierra',async()=>{
 await mobile.locator('#menuToggle').click();
 assert.equal(await mobile.locator('#menuToggle').getAttribute('aria-expanded'),'true');
 await mobile.locator('#mobileMenu a[href="#vida-cela"]').click();
 assert.equal(await mobile.evaluate(()=>location.hash),'#vida-cela');
 assert.equal(await mobile.locator('#menuToggle').getAttribute('aria-expanded'),'false');
});
await check('Sin scroll lateral en 320, 390, 768, 1440',async()=>{
 for(const width of [320,390,768,1440]){await mobile.setViewportSize({width,height:844});const v=await mobile.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:innerWidth}));assert.ok(v.scroll<=v.width+2,'Ancho '+width+' '+JSON.stringify(v));}
 await mobile.setViewportSize({width:390,height:844});
});
await check('Sin excepciones JS de navegador',async()=>assert.deepEqual(errors,[]));
await mobile.goto(origin,{waitUntil:'domcontentloaded'});await mobile.waitForTimeout(3200);
await mobile.evaluate(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=480){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,50))}window.scrollTo(0,0)});
await mobile.screenshot({path:'test-results/cela-celular.png',fullPage:true,animations:'disabled'});
await browser.close();
console.log(passed+'/'+(passed+failures.length)+' pruebas aprobadas');
if(failures.length){console.error(JSON.stringify(failures,null,2));process.exitCode=1}
