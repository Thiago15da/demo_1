(() => {
  'use strict';

  // The opening is a decorative sequence; remove it entirely once played.
  // Do not trap keyboard focus or touch events while it is visible.
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  const intro = document.getElementById('intro');
  if (intro) {
    window.setTimeout(() => intro.remove(), reducedMotion ? 0 : 2720);
  }

  const header = document.getElementById('header');
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  function syncHeader() {
    header?.classList.toggle('scrolled', window.scrollY > 60);
  }
  window.addEventListener('scroll', syncHeader, {passive:true});
  syncHeader();

  function toggleMenu(shouldOpen) {
    if (!mobileMenu || !menuToggle) return;
    mobileMenu.classList.toggle('open', shouldOpen);
    mobileMenu.setAttribute('aria-hidden', String(!shouldOpen));
    menuToggle.setAttribute('aria-expanded', String(shouldOpen));
    menuToggle.setAttribute('aria-label', shouldOpen ? 'Cerrar menú' : 'Abrir menú');
    document.body.classList.toggle('menu-open', shouldOpen);
  }
  menuToggle?.addEventListener('click', () => {
    toggleMenu(!mobileMenu.classList.contains('open'));
  });
  mobileMenu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => toggleMenu(false)));
  window.addEventListener('keydown', event => {
    if (event.key === 'Escape') toggleMenu(false);
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1020 && mobileMenu?.classList.contains('open')) toggleMenu(false);
  }, {passive:true});

  // Respect reduced motion and older browsers.
  const reveals = document.querySelectorAll('.reveal');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('visible'));
  } else {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {rootMargin:'0px 0px -35px 0px', threshold:.07});
    reveals.forEach(el => observer.observe(el));
  }

  const levels = [
    {
      eyebrow:'01 / PRIMEROS DESCUBRIMIENTOS',
      title:'Un comienzo <em>lleno de magia.</em>',
      description:'Una etapa para explorar, preguntar, jugar y desarrollar la confianza. Cada pequeño logro es el inicio de algo grande.',
      image:'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1300&q=85',
      alt:'Útiles y entorno de aprendizaje inicial, imagen ilustrativa',
      level:'Jardín',
      note:'Referencial / Nivel Inicial',
      label:'Consultar por Educación Inicial'
    },
    {
      eyebrow:'02 / APRENDER Y CRECER',
      title:'Cada pregunta <em>abre un camino.</em>',
      description:'La Escolar Básica es una oportunidad para desarrollar conocimientos, hábitos de estudio, amistades y nuevas formas de mirar el mundo.',
      image:'https://images.unsplash.com/photo-1427504494785-3a9ca7044f5d?auto=format&fit=crop&w=1300&q=85',
      alt:'Aula educativa iluminada, fotografía referencial de Escolar Básica',
      level:'Escolar Básica',
      note:'Referencial / Escolar Básica',
      label:'Consultar por Escolar Básica'
    },
    {
      eyebrow:'03 / CONSTRUIR EL FUTURO',
      title:'Ideas para <em>ir más lejos.</em>',
      description:'Una etapa de decisiones, descubrimiento de intereses y preparación para los nuevos desafíos personales, académicos y sociales.',
      image:'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1300&q=85',
      alt:'Estudiantes trabajando en equipo, fotografía referencial de Educación Media',
      level:'Educación Media',
      note:'Referencial / Educación Media',
      label:'Consultar por Educación Media'
    }
  ];
  const tabs = Array.from(document.querySelectorAll('.level-tab'));
  const levelImage = document.getElementById('levelImage');
  const levelImageWrap = document.getElementById('levelImageWrap');
  const levelPanel = document.getElementById('levelPanel');
  const levelEyebrow = document.getElementById('levelEyebrow');
  const levelTitle = document.getElementById('levelTitle');
  const levelDescription = document.getElementById('levelDescription');
  const levelLink = document.getElementById('levelLink');
  const academicLevel = document.getElementById('academicLevel');
  let selectedLevel = 0;
  let imageSequence = 0;

  function showLevel(index) {
    if (!levels[index]) return;
    selectedLevel = index;
    const level = levels[index];
    tabs.forEach((tab,i) => {
      const active = i === index;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    levelPanel?.setAttribute('aria-labelledby', tabs[index].id);
    if (levelEyebrow) levelEyebrow.textContent = level.eyebrow;
    if (levelTitle) levelTitle.innerHTML = level.title; // authored constants, not user input
    if (levelDescription) levelDescription.textContent = level.description;
    if (levelLink) levelLink.setAttribute('aria-label', level.label);
    const note = levelImageWrap?.querySelector('span');
    if (note) note.textContent = level.note;
    const currentSequence = ++imageSequence;
    levelImageWrap?.classList.add('loading');
    const image = new Image();
    image.onload = () => {
      if (currentSequence !== imageSequence) return;
      if (levelImage) {
        levelImage.src = level.image;
        levelImage.alt = level.alt;
      }
      levelImageWrap?.classList.remove('loading');
    };
    image.onerror = () => {
      if (currentSequence === imageSequence) levelImageWrap?.classList.remove('loading');
    };
    image.src = level.image;
  }
  tabs.forEach(tab => {
    tab.addEventListener('click', () => showLevel(Number(tab.dataset.level)));
    tab.addEventListener('keydown', event => {
      if (!['ArrowRight','ArrowDown','ArrowLeft','ArrowUp','Home','End'].includes(event.key)) return;
      event.preventDefault();
      const delta = event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : -1;
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length-1 : (Number(tab.dataset.level) + delta + tabs.length) % tabs.length;
      showLevel(next);
      tabs[next]?.focus();
    });
  });
  levelLink?.addEventListener('click', () => {
    if (academicLevel) academicLevel.value = levels[selectedLevel].level;
  });

  // Plain HTML form: submit directly to a prepared WhatsApp message, no collection or backend.
  const inquiryForm = document.getElementById('inquiryForm');
  inquiryForm?.addEventListener('submit', event => {
    event.preventDefault();
    if (!inquiryForm.reportValidity()) return;
    const valueOf = id => document.getElementById(id)?.value.trim() ?? '';
    const lines = [
      'Hola, Centro Educativo de las Américas (CELA). Quisiera solicitar información.',
      '',
      'Responsable: ' + valueOf('adultName'),
      'Nivel de interés: ' + valueOf('academicLevel')
    ];
    if (valueOf('questionType')) lines.push('Consulta: ' + valueOf('questionType'));
    if (valueOf('neighborhood')) lines.push('Ciudad/zona: ' + valueOf('neighborhood'));
    if (valueOf('message')) lines.push('Mensaje: ' + valueOf('message'));
    lines.push('', 'Consulta elaborada desde una demo visual no oficial de NovaTec Engineering.');
    const url = 'https://wa.me/595986251205?text=' + encodeURIComponent(lines.join('\n'));
    const opened = window.open(url, '_blank', 'noopener,noreferrer');
    if (!opened) window.location.assign(url);
  });
})();