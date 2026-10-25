(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  $('#year').textContent = new Date().getFullYear();

  // Reveal elements as the page scrolls into view.
  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealEls.forEach(el => observer.observe(el));
  } else revealEls.forEach(el => el.classList.add('visible'));

  // Mobile navigation.
  const toggle = $('.menu-toggle');
  const nav = $('.nav');
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? '×' : '☰';
  });
  $$('.nav a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.textContent = '☰';
  }));

  // Collection category filters.
  $$('.filter').forEach(button => button.addEventListener('click', () => {
    $$('.filter').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    const category = button.dataset.filter;
    $$('.product-card').forEach(card => {
      const show = category === 'toate' || card.dataset.category === category;
      card.classList.toggle('hidden', !show);
    });
  }));

  // Paper-like preview modal.
  const modal = $('#preview-modal');
  const modalTitle = $('#modal-title');
  const modalMessage = $('#modal-message');
  const orderButton = $('#modal-order');
  let selectedTitle = '';
  function openPreview(title, message) {
    selectedTitle = title;
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closePreview() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  $$('[data-close]').forEach(el => el.addEventListener('click', closePreview));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closePreview(); });
  $$('.preview-button').forEach(button => button.addEventListener('click', () => {
    openPreview(button.dataset.title, button.dataset.message);
  }));
  $$('.choose-link').forEach(button => button.addEventListener('click', () => {
    $('#felicitare').value = `${button.dataset.title} — ${button.dataset.price}`;
    $('#contact').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => $('#nume').focus({ preventScroll: true }), 650);
  }));
  orderButton.addEventListener('click', () => {
    closePreview();
    const select = $('#felicitare');
    const matching = [...select.options].find(option => option.text.toLowerCase().startsWith(selectedTitle.toLowerCase()));
    if (matching) select.value = matching.value;
    else select.value = 'Vreau un design personalizat';
    $('#contact').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => $('#nume').focus({ preventScroll: true }), 650);
  });

  // Contact form prepares an email; it does not pretend to submit to a server.
  $('#contact-form').addEventListener('submit', event => {
    event.preventDefault();
    const name = $('#nume').value.trim();
    const product = $('#felicitare').value;
    const message = $('#mesaj').value.trim();
    const subject = encodeURIComponent(`Comandă felicitare digitală — ${product}`);
    const body = encodeURIComponent(`Bună! Sunt ${name} și aș dori detalii despre:\n${product}\n\nOcazie și mesaj:\n${message}\n\nMulțumesc!`);
    window.location.href = `mailto:alexandruu376@gmail.com?subject=${subject}&body=${body}`;
  });
})();