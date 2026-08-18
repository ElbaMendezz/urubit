const burger = document.querySelector<HTMLButtonElement>('#nav-burger');
const menu = document.querySelector<HTMLElement>('#nav-mobile-menu');

if (burger && menu) {
  const setOpen = (open: boolean) => {
    burger.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-hidden', String(!open));
    menu.classList.toggle('is-open', open);
  };

  const close = (returnFocus = false) => {
    setOpen(false);
    if (returnFocus) burger.focus();
  };

  burger.addEventListener('click', () => {
    setOpen(burger.getAttribute('aria-expanded') !== 'true');
  });

  menu.addEventListener('click', (event) => {
    if ((event.target as HTMLElement).closest('a')) close();
  });

  document.addEventListener('keydown', (event) => {
    if (burger.getAttribute('aria-expanded') !== 'true') return;

    if (event.key === 'Escape') {
      close(true);
      return;
    }

    if (event.key === 'Tab') {
      const focusables = Array.from(menu.querySelectorAll<HTMLElement>('a[href]'));
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
}
