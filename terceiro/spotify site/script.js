// Espera o DOM carregar para garantir que os elementos existam
document.addEventListener('DOMContentLoaded', () => {
  const elements = document.querySelectorAll('.fade');

  function checkFade() {
    const trigger = window.innerHeight * 0.9;
    elements.forEach(el => {
      const rectTop = el.getBoundingClientRect().top;
      if (rectTop < trigger) el.classList.add('show');
    });
  }

  // executa no load e no scroll / resize
  checkFade();
  window.addEventListener('scroll', checkFade);
  window.addEventListener('resize', checkFade);
});
