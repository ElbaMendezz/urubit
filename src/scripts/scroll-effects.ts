type Paint = () => void;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function initBackToTop(): Paint | null {
  const btn = document.querySelector<HTMLButtonElement>('#back-to-top');
  if (!btn) return null;

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  return () => {
    btn.classList.toggle('is-visible', window.scrollY > 700);
  };
}

function runHeroIntro(): void {
  const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-hero]')).sort(
    (a, b) => Number(a.dataset.hero) - Number(b.dataset.hero),
  );
  if (!nodes.length) return;

  nodes.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(26px)';
    el.style.filter = 'blur(6px)';
    requestAnimationFrame(() => {
      const delay = 120 + i * 150;
      el.style.transition =
        `opacity 900ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, ` +
        `transform 1000ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, ` +
        `filter 900ms ease ${delay}ms`;
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
      el.style.filter = 'blur(0)';
    });
  });
}

function runCounters(): void {
  const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-count]'));
  if (!nodes.length) return;

  nodes.forEach((el, i) => {
    const raw = el.getAttribute('data-count') ?? '0';
    const target = parseInt(raw, 10);
    const pad = raw.length;
    const duration = 1100;
    const start = performance.now() + 160 + i * 130;

    el.textContent = '0'.padStart(pad, '0');

    const step = (now: number) => {
      const progress = clamp((now - start) / duration, 0, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = String(Math.round(target * eased)).padStart(pad, '0');
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}

function initReveal(): Paint | null {
  const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-rv]'));
  if (!nodes.length) return null;

  nodes.forEach((el, i) => {
    const delay = (i % 4) * 90;
    el.style.transition =
      `opacity 800ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, ` +
      `transform 900ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`;
    el.style.willChange = 'opacity, transform';
  });

  const revealed = new WeakSet<HTMLElement>();

  return () => {
    const vh = window.innerHeight;
    nodes.forEach((el) => {
      if (revealed.has(el)) return;
      const r = el.getBoundingClientRect();
      const shown = r.top < vh * 0.88 && r.bottom > vh * 0.06;
      el.style.opacity = shown ? '1' : '0';
      el.style.transform = shown ? 'translateY(0) scale(1)' : 'translateY(34px) scale(0.985)';
      if (shown) revealed.add(el);
    });
  };
}

interface TitleTarget {
  heading: HTMLElement;
  eyebrow: HTMLElement | null;
}

/**
 * Reemplazo del "texto cinético" del original (descartado por accesibilidad
 * y mantenibilidad — ver CLAUDE.md): en vez de partir el <h2> en un <span>
 * por palabra, aplica el mismo tipo de revelado (máscara que se abre desde
 * abajo) al bloque completo con clip-path + transform, y reproduce el pulso
 * de letter-spacing del eyebrow tal cual el original. Misma duración/easing
 * que el original usaba para el movimiento de cada palabra (900ms
 * cubic-bezier(0.16,1,0.3,1)), mismo umbral de disparo (85% del viewport).
 * Aplica solo a Lab, Servicios y Metodología: son las 3 únicas secciones
 * que el original anima con texto cinético.
 */
function initTitleReveal(): Paint | null {
  const targets: TitleTarget[] = [];
  const push = (headingSelector: string, eyebrowSelector: string) => {
    const heading = document.querySelector<HTMLElement>(headingSelector);
    if (!heading) return;
    targets.push({ heading, eyebrow: document.querySelector<HTMLElement>(eyebrowSelector) });
  };
  push('#c-lab .lab-title', '#c-lab .lab-eyebrow');
  push('#c-hacemos .head-heading', '#c-hacemos .eyebrow');
  push('#c-metodo .head-heading', '#c-metodo .eyebrow');
  if (!targets.length) return null;

  targets.forEach(({ heading, eyebrow }) => {
    heading.style.clipPath = 'inset(0 0 100% 0)';
    heading.style.transform = 'translateY(24px)';
    heading.style.transition =
      'clip-path 900ms cubic-bezier(0.16,1,0.3,1), transform 900ms cubic-bezier(0.16,1,0.3,1)';
    if (eyebrow) {
      eyebrow.style.opacity = '0';
      eyebrow.style.letterSpacing = '0.5em';
      eyebrow.style.transition = 'opacity 700ms ease 120ms, letter-spacing 900ms cubic-bezier(0.16,1,0.3,1) 120ms';
    }
  });

  const done = new WeakSet<HTMLElement>();
  return () => {
    const vh = window.innerHeight;
    targets.forEach(({ heading, eyebrow }) => {
      if (done.has(heading)) return;
      const r = heading.getBoundingClientRect();
      if (r.top > vh * 0.85) return;
      heading.style.clipPath = 'inset(0 0 0% 0)';
      heading.style.transform = 'translateY(0)';
      if (eyebrow) {
        eyebrow.style.opacity = '1';
        eyebrow.style.letterSpacing = '0.16em';
      }
      done.add(heading);
    });
  };
}

function initPhases(): Paint | null {
  const section = document.getElementById('c-metodo');
  if (!section) return null;
  const cards = Array.from(section.querySelectorAll<HTMLElement>('.phase'));
  if (cards.length !== 4) return null;

  const state = cards.map((card) => {
    card.style.transition =
      'transform 600ms cubic-bezier(0.16,1,0.3,1), opacity 500ms ease, box-shadow 500ms ease, ' +
      'background-color 450ms ease, color 450ms ease';
    card.style.willChange = 'transform, opacity';
    const bg = getComputedStyle(card).backgroundColor;
    const fg = getComputedStyle(card).color;
    // Fuerza herencia en los hijos para que el toggle de color de la
    // tarjeta activa (más abajo) se propague a número/título/descripción
    // sin tener que tocarlos uno por uno — igual que en el original.
    card.querySelectorAll<HTMLElement>('h3, p, span').forEach((t) => {
      t.style.color = 'inherit';
    });
    const svg = card.querySelector<SVGElement>('svg');
    if (svg) svg.style.transition = 'transform 600ms cubic-bezier(0.16,1,0.3,1)';
    return { bg, fg, svg };
  });

  return () => {
    const r = section.getBoundingClientRect();
    const vh = window.innerHeight;
    const p = (vh * 0.85 - r.top) / (r.height * 0.85);
    const active = clamp(Math.floor(p * 4.6) - 1, -1, 3);

    cards.forEach((card, i) => {
      const { bg, fg, svg } = state[i];
      const on = i <= active;
      const isActive = i === active;
      const wasLime = bg.replace(/\s/g, '') === 'rgb(220,232,74)';
      card.style.opacity = on ? '1' : '0.82';
      card.style.transform = isActive ? 'translateY(-16px)' : 'translateY(0)';
      card.style.boxShadow = isActive ? '0 24px 48px rgba(22, 34, 27, 0.2)' : 'none';
      card.style.backgroundColor = isActive ? (wasLime ? '#1E2A23' : '#DCE84A') : bg;
      card.style.color = isActive ? (wasLime ? '#EDEFE9' : '#16221B') : fg;
      if (svg) svg.style.transform = isActive ? 'scale(1.14)' : 'scale(1)';
    });
  };
}

function initDif(): Paint | null {
  const card = document.querySelector<HTMLElement>('#c-dif .dif-card');
  if (!card) return null;

  const heading = card.querySelector<HTMLElement>('.dif-title');
  const copy = card.querySelector<HTMLElement>('.dif-copy');
  const bg = card.querySelector<HTMLElement>('.dif-bg');
  const panels = Array.from(card.querySelectorAll<HTMLElement>('.dif-aside > *'));

  if (heading) {
    heading.style.clipPath = 'inset(0 0 100% 0)';
    heading.style.transform = 'translateY(18px)';
    heading.style.transition =
      'clip-path 1200ms cubic-bezier(0.16,1,0.3,1), transform 1200ms cubic-bezier(0.16,1,0.3,1)';
  }
  if (copy) {
    copy.style.opacity = '0';
    copy.style.transition = 'opacity 900ms ease 320ms';
  }
  panels.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateX(46px)';
    const delay = 380 + i * 160;
    el.style.transition = `opacity 900ms ease ${delay}ms, transform 1000ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`;
  });

  let done = false;
  return () => {
    const r = card.getBoundingClientRect();
    const vh = window.innerHeight;
    const prog = clamp((vh - r.top) / (vh + r.height), 0, 1);
    if (bg) bg.style.transform = `translateY(${Math.round((0.5 - prog) * 90)}px)`;

    if (done || r.top > vh * 0.82) return;
    if (heading) {
      heading.style.clipPath = 'inset(0 0 0% 0)';
      heading.style.transform = 'translateY(0)';
    }
    if (copy) copy.style.opacity = '1';
    panels.forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'translateX(0)';
    });
    done = true;
  };
}

function initAliado(): Paint | null {
  const card = document.querySelector<HTMLElement>('#c-aliado .aliado-card');
  const main = card?.querySelector<HTMLElement>('.aliado-main');
  const list = card?.querySelector<HTMLElement>('.aliado-list');
  if (!card || !main || !list) return null;

  const left = Array.from(main.children) as HTMLElement[];
  const rows = Array.from(list.children) as HTMLElement[];

  left.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(22px)';
    const delay = i * 110;
    el.style.transition = `opacity 800ms ease ${delay}ms, transform 900ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`;
  });

  rows.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateX(-26px)';
    const delay = 180 + i * 80;
    el.style.transition = `opacity 700ms ease ${delay}ms, transform 800ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`;
    const path = el.querySelector<SVGPathElement>('svg path');
    if (path) {
      const len = path.getTotalLength();
      path.style.strokeDasharray = String(len);
      path.style.strokeDashoffset = String(len);
      path.style.transition = `stroke-dashoffset 700ms cubic-bezier(0.16,1,0.3,1) ${320 + i * 80}ms`;
    }
  });

  let done = false;
  return () => {
    if (done) return;
    const r = card.getBoundingClientRect();
    if (r.top > window.innerHeight * 0.8) return;
    left.forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
    rows.forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'translateX(0)';
      const path = el.querySelector<SVGPathElement>('svg path');
      if (path) path.style.strokeDashoffset = '0';
    });
    done = true;
  };
}

function initContacto(): Paint | null {
  const card = document.querySelector<HTMLElement>('#c-contacto .contacto-card');
  if (!card) return null;

  const heading = card.querySelector<HTMLElement>('.head-title');
  const footer = card.querySelector<HTMLElement>('.footer-row');
  const glow = card.querySelector<HTMLElement>('.contacto-glow');

  // El CTA de esta sección no se anima: en el original su selector
  // (`a[href="#c-contacto"]`) nunca coincide con el botón real (que
  // enlaza a WhatsApp), así que ese bloque de animación nunca corría.
  // Se replica omitiéndolo — el botón queda siempre en su estado final.

  if (heading) {
    heading.style.opacity = '0';
    heading.style.transform = 'translateY(30px)';
    heading.style.transition = 'opacity 1000ms ease, transform 1100ms cubic-bezier(0.16,1,0.3,1)';
  }
  if (footer) {
    footer.style.opacity = '0';
    footer.style.transform = 'translateY(18px)';
    footer.style.transition = 'opacity 800ms ease 480ms, transform 900ms cubic-bezier(0.16,1,0.3,1) 480ms';
  }

  let done = false;
  return () => {
    const r = card.getBoundingClientRect();
    const vh = window.innerHeight;
    if (glow) {
      const prog = clamp((vh - r.top) / (vh + r.height), 0, 1);
      const y = Math.round((prog - 0.5) * 70);
      const scale = (0.9 + prog * 0.24).toFixed(3);
      glow.style.transform = `translateX(-50%) translateY(${y}px) scale(${scale})`;
    }
    if (done || r.top > vh * 0.8) return;
    if (heading) {
      heading.style.opacity = '1';
      heading.style.transform = 'translateY(0)';
    }
    if (footer) {
      footer.style.opacity = '1';
      footer.style.transform = 'translateY(0)';
    }
    done = true;
  };
}

function main(): void {
  const painters = [
    initBackToTop(),
    initReveal(),
    initTitleReveal(),
    initPhases(),
    initDif(),
    initAliado(),
    initContacto(),
  ].filter((fn): fn is Paint => fn !== null);

  runHeroIntro();
  runCounters();

  const paint = () => painters.forEach((fn) => fn());

  window.addEventListener('scroll', paint, { passive: true });
  window.addEventListener('resize', paint);
  paint();
}

main();
