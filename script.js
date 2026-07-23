const nav = document.getElementById('nav');
const hero = document.getElementById('hero');

const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.textContent = isOpen ? '✕' : '☰';
  menuToggle.setAttribute('aria-expanded', isOpen);
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.textContent = '☰';
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});




const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function lerp(a,b,t){ return a + (b-a)*t; }
function hexToRgb(h){ h=h.replace('#',''); return [parseInt(h.substr(0,2),16),parseInt(h.substr(2,2),16),parseInt(h.substr(4,2),16)]; }
function mixHex(h1,h2,t){
  const a=hexToRgb(h1), b=hexToRgb(h2);
  const r=Math.round(lerp(a[0],b[0],t)), g=Math.round(lerp(a[1],b[1],t)), bl=Math.round(lerp(a[2],b[2],t));
  return `rgb(${r},${g},${bl})`;
}

if(hero){
  // HOME PAGE: nav starts transparent over the hero, and the enso/hero scene animates on scroll
  const content = document.querySelector('.hero-content');
  const cue = document.querySelector('.scroll-cue');
  const ring = document.getElementById('ensoRing');
  const glow1 = document.getElementById('glowStop1');
  const glow2 = document.getElementById('glowStop2');
  const ridgeBack = document.getElementById('ridgeBack');
  const ridgeMid = document.getElementById('ridgeMid');

  const R = 92;
  const CIRC = 2 * Math.PI * R;
  ring.style.strokeDasharray = CIRC;
  ring.style.strokeDashoffset = CIRC;

  function render(progress){
    const drawT = Math.min(progress / 0.7, 1);
    ring.style.strokeDashoffset = CIRC - (CIRC * 0.94 * drawT);
    ring.setAttribute('stroke', mixHex('#EFC08A', '#CC7A3B', progress));

    glow1.setAttribute('stop-color', mixHex('#FBEFD3', '#F3C989', progress));
    glow2.setAttribute('stop-color', mixHex('#FBEFD3', '#F3C989', progress));

    ridgeBack.setAttribute('fill', mixHex('#DCCFA6', '#C9A45E', progress));
    ridgeMid.setAttribute('fill', mixHex('#9C9159', '#8C5A2E', progress));

    const fadeStart = 0.5, fadeEnd = 0.95;
    let f = (progress - fadeStart) / (fadeEnd - fadeStart);
    f = Math.min(Math.max(f,0),1);
    content.style.opacity = 1 - f;
    content.style.transform = `translateY(${f*22}px)`;
    cue.style.opacity = progress < 0.12 ? 1 : Math.max(0, 1 - (progress-0.12)/0.2);
  }

  function onScroll(){
    const total = hero.offsetHeight - window.innerHeight;
    const rect = hero.getBoundingClientRect();
    let progress = total > 0 ? (-rect.top / total) : 0;
    progress = Math.min(Math.max(progress,0),1);
    render(progress);
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }

  if(reduced){
    render(0.4);
    window.addEventListener('scroll', ()=> nav.classList.toggle('scrolled', window.scrollY > 40), {passive:true});
  } else {
    let ticking = false;
    window.addEventListener('scroll', ()=>{
      if(!ticking){ requestAnimationFrame(()=>{ onScroll(); ticking = false; }); ticking = true; }
    }, {passive:true});
    onScroll();
  }
} else {
  // SUBPAGES: no hero, nav is solid from the start
  nav.classList.add('scrolled');
}
