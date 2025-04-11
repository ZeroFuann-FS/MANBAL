// Script para manejar el menú hamburguesa
const hamburger = document.querySelector('.hamburger');
const menu = document.querySelector('nav ul');

// Abre/cierra el menú cuando se hace clic en el icono de la hamburguesa
hamburger.addEventListener('click', function(event) {
    event.stopPropagation();
    menu.classList.toggle('show');
    hamburger.classList.toggle('open');
});

// Cierra el menú cuando se hace clic fuera de él
document.addEventListener('click', function(event) {
    if (!menu.contains(event.target) && !hamburger.contains(event.target)) {
        menu.classList.remove('show');
        hamburger.classList.remove('open');
    }
});

  // Carrusel del hero
  document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    let currentSlide = 0;
    const slideInterval = 6000; // 6 segundos
    
    function showSlide(n) {
      slides.forEach(slide => slide.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));
      
      currentSlide = (n + slides.length) % slides.length;
      slides[currentSlide].classList.add('active');
      dots[currentSlide].classList.add('active');
    }
    
    function nextSlide() {
      showSlide(currentSlide + 1);
    }
    
    // Configurar intervalo para cambio automático
    let slideTimer = setInterval(nextSlide, slideInterval);
    
    // Event listeners para los dots
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        clearInterval(slideTimer);
        showSlide(index);
        slideTimer = setInterval(nextSlide, slideInterval);
      });
    });
    
    // Pausar carrusel al hacer hover
    const hero = document.querySelector('.blog-hero');
    hero.addEventListener('mouseenter', () => {
      clearInterval(slideTimer);
    });
    
    hero.addEventListener('mouseleave', () => {
      slideTimer = setInterval(nextSlide, slideInterval);
    });
  });