// Script para manejar el menú hamburguesa
const hamburger = document.querySelector('.hamburger');
const menu = document.querySelector('nav ul');

// Abre/cierra el menú cuando se hace clic en el icono de la hamburguesa
hamburger.addEventListener('click', function(event) {
    event.stopPropagation(); // Evita que el clic se propague y cierre el menú inmediatamente
    menu.classList.toggle('show');
    hamburger.classList.toggle('open');  // Cambiar el color o estado del icono
});

// Cierra el menú cuando se hace clic fuera de él
document.addEventListener('click', function(event) {
    if (!menu.contains(event.target) && !hamburger.contains(event.target)) {
        menu.classList.remove('show');
        hamburger.classList.remove('open');  // Restaura el icono cuando se cierra
    }
});