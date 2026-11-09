// Zuria Tahir - Portfolio interactions

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- Mobile navigation ----------
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

function setMenu(open) {
  hamburger.classList.toggle('active', open);
  navMenu.classList.toggle('active', open);
  navbar.classList.toggle('menu-open', open);
  hamburger.setAttribute('aria-expanded', String(open));
}

hamburger.addEventListener('click', () => setMenu(!navMenu.classList.contains('active')));
document.querySelectorAll('.nav-menu a').forEach(link => link.addEventListener('click', () => setMenu(false)));

// ---------- Scroll: navbar, progress bar, active link ----------
const progress = document.querySelector('.scroll-progress');
const sections = [...document.querySelectorAll('section[id]')];
const navLinks = [...document.querySelectorAll('.nav-link')];

function onScroll() {
  const y = window.scrollY;
  navbar.classList.toggle('scrolled', y > 20);

  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;

  let current = sections[0].id;
  sections.forEach(section => {
    if (y >= section.offsetTop - 160) current = section.id;
  });
  navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ---------- Reveal on scroll ----------
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !reduceMotion) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.classList.add('in');
        observer.unobserve(el);
        setTimeout(() => { el.style.transitionDelay = ''; }, 1000);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 3) * 80}ms`;
    observer.observe(el);
  });
} else {
  revealEls.forEach(el => el.classList.add('in'));
}

// ---------- Typed roles in the hero ----------
const typedEl = document.querySelector('.typed');
const roles = ['AI Automation Engineer', 'AI Engineer', 'Agentic Systems Builder'];

if (typedEl && !reduceMotion) {
  let roleIndex = 0;
  let charIndex = roles[0].length;
  let deleting = true;

  function tick() {
    const role = roles[roleIndex];
    if (deleting) {
      charIndex--;
      typedEl.textContent = role.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
      setTimeout(tick, 35);
    } else {
      const next = roles[roleIndex];
      charIndex++;
      typedEl.textContent = next.slice(0, charIndex);
      if (charIndex === next.length) {
        deleting = true;
        setTimeout(tick, 2200);
      } else {
        setTimeout(tick, 70);
      }
    }
  }
  setTimeout(tick, 2400);
}

// ---------- Workflow log ticker ----------
const logLine = document.querySelector('.log-line');
const logs = [
  'lead captured from website form',
  'agent answered from knowledge base',
  'CRM updated with contact + tags',
  'meeting booked, reminders scheduled'
];

if (logLine && !reduceMotion) {
  let logIndex = 0;
  setInterval(() => {
    logLine.classList.add('swap');
    setTimeout(() => {
      logIndex = (logIndex + 1) % logs.length;
      logLine.textContent = logs[logIndex];
      logLine.classList.remove('swap');
    }, 350);
  }, 2600);
}

// ---------- Project filters ----------
const grid = document.querySelector('.projects-grid');
const cards = [...document.querySelectorAll('.project-card')];
const filters = [...document.querySelectorAll('.filter')];

filters.forEach(btn => {
  const key = btn.dataset.filter;
  const count = key === 'all' ? cards.length : cards.filter(c => c.dataset.cat === key).length;
  btn.querySelector('.count').textContent = count;

  btn.addEventListener('click', () => {
    filters.forEach(b => b.classList.toggle('is-active', b === btn));
    grid.classList.toggle('is-filtered', key !== 'all');
    cards.forEach(card => {
      const show = key === 'all' || card.dataset.cat === key;
      card.classList.toggle('is-hidden', !show);
      if (show) card.classList.add('in');
    });
  });
});

// ---------- Spotlight that follows the cursor on project cards ----------
cards.forEach(card => {
  card.addEventListener('pointermove', e => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    card.style.setProperty('--my', `${e.clientY - rect.top}px`);
  });
});
