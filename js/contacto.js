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

// Manejo del formulario de contacto
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('presupuesto-form');
    const formMessage = document.getElementById('form-message');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        formMessage.textContent = 'Enviando solicitud...';
        formMessage.className = 'form-message';
        formMessage.style.display = 'block';
        
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        
        fetch('https://formsubmit.co/ajax/nancigalindo085@gmail.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            // Mostrar mensaje de éxito
            formMessage.textContent = '¡Gracias! Hemos recibido tu solicitud. Nos pondremos en contacto contigo en menos de 24 horas.';
            formMessage.className = 'form-message success';
            form.reset();
        })
        .catch(error => {
            // Mostrar mensaje de error
            formMessage.textContent = 'Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo más tarde.';
            formMessage.className = 'form-message error';
            console.error('Error:', error);
        });
    });
});