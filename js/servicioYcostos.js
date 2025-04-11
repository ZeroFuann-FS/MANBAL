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


// Cerrar modal al hacer clic fuera del contenido
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
      window.location.hash = '#cerrar';
    }
  });