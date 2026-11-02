(() => {
'use strict';
const $=(selector,root=document)=>root.querySelector(selector);
const $$=(selector,root=document)=>Array.from(root.querySelectorAll(selector));
const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
const escapeHTML=(str)=>String(str??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[ch]));

// Mechanical intro remains decorative; it is removed, not merely hidden.
const opening=$('#opening');
if(opening)window.setTimeout(()=>opening.remove(),reduced?0:3190);
const header=$('#header'),toggle=$('#menuToggle'),mobileNav=$('#mobileNav');
function syncHeader(){header?.classList.toggle('scrolled',window.scrollY>70)}
syncHeader();window.addEventListener('scroll',syncHeader,{passive:true});
function menu(open){
  if(!toggle||!mobileNav)return;
  toggle.setAttribute('aria-expanded',String(open));
  toggle.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');
  toggle.textContent=open?'✕':'☰';
  mobileNav.classList.toggle('open',open);
  mobileNav.setAttribute('aria-hidden',String(!open));
  document.body.classList.toggle('nav-open',open);
}
toggle?.addEventListener('click',()=>menu(!mobileNav.classList.contains('open')));
mobileNav?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>menu(false)));
window.addEventListener('keydown',event=>{
 if(event.key==='Escape'){menu(false);closeProjectModal()}
});
window.addEventListener('resize',()=>{if(window.innerWidth>980&&mobileNav?.classList.contains('open'))menu(false)},{passive:true});

const reveals=$$('.reveal');
if(reduced||!('IntersectionObserver'in window))reveals.forEach(el=>el.classList.add('in'));
else {
 const observer=new IntersectionObserver(entries=>{
   entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in');observer.unobserve(entry.target)}});
 },{threshold:.07,rootMargin:'0px 0px -22px 0px'});
 reveals.forEach(el=>observer.observe(el));
}

// External photos are optional for the demo; fall back to licensed illustrative imagery.
function attachFallbacks(root=document){
 $$('img[data-fallback]',root).forEach(img=>{
  if(img.dataset.fallbackBound)return;
  img.dataset.fallbackBound='true';
  img.addEventListener('error',function(){
    if(!this.dataset.fallback||this.dataset.triedFallback)return;
    this.dataset.triedFallback='true';this.src=this.dataset.fallback;
  });
  if(img.complete&&img.naturalWidth===0&&img.dataset.fallback){img.dispatchEvent(new Event('error'))}
 });
}
attachFallbacks();

// Catalogue is structured data, so editing/additions do not require rewriting page templates.
let projectData=[];
let lastModalTrigger=null;
async function loadProjects(){
  const grid=$('#projectsGrid');
  if(!grid)return;
  try{
    const response=await fetch('assets/projects.json',{cache:'no-store'});
    if(!response.ok)throw Error('No se pudo cargar el catálogo.');
    const payload=await response.json();
    if(!Array.isArray(payload.projects))throw Error('El archivo de proyectos no es válido.');
    projectData=payload.projects;
    const initialLimit=Number(grid.dataset.limit||0);
    function render(filter='todos'){
      const subset=projectData.filter(p=>filter==='todos'||p.category===filter);
      const projects=initialLimit?subset.slice(0,initialLimit):subset;
      grid.replaceChildren();
      if(!projects.length){
        const empty=document.createElement('p');empty.className='empty';empty.textContent='No hay proyectos publicados para este filtro.';
        grid.appendChild(empty);return;
      }
      for(const p of projects){
        const card=document.createElement('article');card.className='project-card';
        const photo=document.createElement('div');photo.className='project-image';
        const img=document.createElement('img');img.loading='eager'; img.decoding='async';img.src=p.image||p.fallback;img.dataset.fallback=p.fallback||'';img.alt='Imagen de referencia del proyecto '+p.title;
        const tag=document.createElement('span');tag.textContent=p.categoryLabel;
        photo.append(img,tag);
        const box=document.createElement('div');box.className='project-info';
        const meta=document.createElement('span');meta.className='meta';meta.textContent=p.location+' / '+p.area;
        const title=document.createElement('h3');title.textContent=p.title;
        const desc=document.createElement('p');desc.textContent=p.description;
        const action=document.createElement('button');action.type='button';action.textContent='Ver ficha de proyecto ↗';action.setAttribute('aria-label','Abrir ficha de '+p.title);
        action.addEventListener('click',()=>showProjectModal(p,action));
        box.append(meta,title,desc,action);
        card.append(photo,box);grid.appendChild(card);
      }
      attachFallbacks(grid);
    }
    render();
    $$('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
       const target=button.dataset.filter;
       $$('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
       render(target);
    }));
  } catch(err){
    grid.replaceChildren();
    const empty=document.createElement('div');empty.className='empty';
    empty.textContent='No se pudo cargar el catálogo en este momento. Podés consultar los proyectos en la web actual de MCA.';
    const source=document.createElement('a');source.href='https://www.mcaconstructora.com/projects';source.target='_blank';source.rel='noopener noreferrer';source.textContent=' Abrir fuente MCA ↗';
    empty.appendChild(source);grid.appendChild(empty);
    console.warn('Catálogo MCA:',err.message);
  }
}
function showProjectModal(p,trigger){
 const modal=$('#projectModal');if(!modal)return;
 lastModalTrigger=trigger;
 const text=(id,value)=>{const el=$('#'+id);if(el)el.textContent=String(value??'—')};
 text('modalCategory',p.categoryLabel);text('modalTitle',p.title);text('modalDescription',p.description);
 text('modalLocation',p.location);text('modalArea',p.area);text('modalStatus',p.status);
 text('modalScope',(p.scope||[]).join(' · '));text('modalCredit',p.imageCredit+' · Estado y alcances completos a validar con MCA.');
 const source=$('#modalSource');if(source)source.href=p.source||'https://www.mcaconstructora.com/';
 const pic=$('#modalImage');if(pic){
  pic.src=p.image||p.fallback;pic.dataset.fallback=p.fallback||'';pic.dataset.triedFallback='';
  pic.alt='Referencia visual: '+p.title;pic.dataset.fallbackBound='';
  attachFallbacks(modal);
 }
 modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.classList.add('modal-open');
 $('#modalClose')?.focus();
}
function closeProjectModal(){
 const modal=$('#projectModal');if(!modal?.classList.contains('open'))return;
 modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.classList.remove('modal-open');
 lastModalTrigger?.focus();lastModalTrigger=null;
}
$('#modalClose')?.addEventListener('click',closeProjectModal);
$('#projectModal')?.addEventListener('click',e=>{if(e.target===e.currentTarget)closeProjectModal()});
loadProjects();

// Concept plan: none of these polygons are real lots or inventory.
const lotData={
 A:{title:'A / Industria general',desc:'Sector ilustrativo dedicado a implantaciones de industria general, con acceso a infraestructura vial y servicios según el proyecto.',use:'PRODUCTIVO',phase:'ETAPA 01'},
 B:{title:'B / Plataforma logística',desc:'Sector conceptual para depósitos, centros de distribución o infraestructura logística vinculada a rutas y accesos.',use:'LOGÍSTICO',phase:'ETAPA 01'},
 C:{title:'C / Industria liviana',desc:'Sector conceptual pensado para actividades productivas de menor escala o cadenas complementarias.',use:'INDUSTRIAL',phase:'ETAPA 02'},
 D:{title:'D / Operación productiva',desc:'Sector ilustrativo para instalaciones productivas con necesidades de ingeniería e infraestructura propia.',use:'PRODUCTIVO',phase:'ETAPA 02'},
 E:{title:'E / Soporte operativo',desc:'Espacio conceptual para servicios técnicos, mantenimiento o infraestructura complementaria.',use:'SOPORTE',phase:'ETAPA 03'},
 F:{title:'F / Servicios comunes',desc:'Franja ilustrativa para espacios de servicios comunes, accesos o soporte comercial del parque.',use:'SERVICIOS',phase:'ETAPA 03'}
};
const lotButtons=$$('.lot[data-lot]');
function chooseLot(key){
 const info=lotData[key];if(!info)return;
 lotButtons.forEach(el=>el.classList.toggle('selected',el.dataset.lot===key));
 const fields={lotTitle:info.title,lotDescription:info.desc,lotUse:info.use,lotPhase:info.phase};
 for(const [id,value]of Object.entries(fields)){const el=$('#'+id);if(el)el.textContent=value}
}
lotButtons.forEach(el=>{
 el.addEventListener('click',()=>chooseLot(el.dataset.lot));
 el.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();chooseLot(el.dataset.lot)}});
});

// Commercial forms deliberately have no remote endpoint in this static concept.
const form=$('#contactForm'),type=$('#contactType'),investorField=$('#investorField');
const params=new URLSearchParams(window.location.search);
const inquiryType=params.get('tipo');
if(type&&inquiryType&&Array.from(type.options).some(o=>o.value===inquiryType))type.value=inquiryType;
function updateType(){
 if(!type||!investorField)return;
 investorField.hidden=!['inversion','industrial','integral'].includes(type.value);
}
type?.addEventListener('change',updateType);updateType();
function buildMessage(){
 if(!form?.reportValidity())return null;
 const val=id=>String($('#'+id)?.value??'').trim();
 const labels={inversion:'MCA · Parques industriales / inversión',industrial:'MCA · Proyecto industrial o logístico',gerenciamiento:'MCA · Dirección y gerenciamiento',ingenieria:'MCA · Ingeniería y control de obras',montaje:'MCA · Construcción y montaje',energia:'MCA · Infraestructura eléctrica',integral:'MCA · Gestión integral de proyectos',smart:'Servicios Smart · Servicios técnicos y mantenimiento'};
 const lines=['Hola, quisiera solicitar una reunión o propuesta comercial.','',
 'Unidad / consulta: '+(labels[val('contactType')]||val('contactType')),
 'Nombre: '+val('contactName'),'Empresa: '+val('contactCompany'),'Email: '+val('contactEmail')];
 if(val('contactPhone'))lines.push('Teléfono: '+val('contactPhone'));
 lines.push('Ubicación: '+val('contactLocation'));
 if(val('contactPhase'))lines.push('Etapa: '+val('contactPhase'));
 if(val('contactArea')&&investorField&&!investorField.hidden)lines.push('Superficie estimada: '+val('contactArea'));
 lines.push('Descripción: '+val('contactDetails'));
 lines.push('','Enviado desde la demostración conceptual NovaTec de MCA y Servicios Smart.');
 return lines.join('\n');
}
function navigateExternal(url){
 const w=window.open(url,'_blank','noopener,noreferrer');
 if(!w)window.location.href=url;
}
function sendMessage(destination){
 const message=buildMessage();if(!message)return false;
 const status=$('#formStatus');
 if(destination==='whatsapp'){
   navigateExternal('https://wa.me/595981876316?text='+encodeURIComponent(message));
   if(status)status.textContent='Mensaje preparado: revisá WhatsApp para enviarlo.';
 } else {
   const subject='Consulta empresarial MCA & Smart: '+(type?.selectedOptions[0]?.textContent||'Nuevo proyecto');
   navigateExternal('mailto:camaidana@mcapy.solutions?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(message));
   if(status)status.textContent='Mensaje preparado: revisá tu aplicación de correo.';
 }
 return true;
}
form?.addEventListener('submit',e=>{e.preventDefault();sendMessage('whatsapp')});
$('#sendEmail')?.addEventListener('click',()=>sendMessage('email'));
})();