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

// Efecto para resaltar la opción seleccionada
const menuLinks = document.querySelectorAll('nav a');
menuLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuLinks.forEach(l => l.classList.remove('selected'));
        link.classList.add('selected');
    });
});

// Carrusel automático con navegación por puntos
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-container input');
const totalSlides = slides.length;

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    slides[currentSlide].checked = true;
}


let slideInterval = setInterval(nextSlide, 5000);


const dots = document.querySelectorAll('.slides-nav label');
dots.forEach(dot => {
    dot.addEventListener('click', () => {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000);
        currentSlide = parseInt(dot.htmlFor.split('-')[1]) - 1;
    });
});