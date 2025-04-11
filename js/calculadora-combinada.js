document.addEventListener('DOMContentLoaded', function() {
    // Menu hamburguesa
    const hamburger = document.querySelector('.hamburger');
    const menu = document.querySelector('nav ul');
    
    hamburger.addEventListener('click', function(event) {
        event.stopPropagation();
        menu.classList.toggle('show');
        hamburger.classList.toggle('open');
    });
    
    document.addEventListener('click', function(event) {
        if (!menu.contains(event.target) && !hamburger.contains(event.target)) {
            menu.classList.remove('show');
            hamburger.classList.remove('open');
        }
    });
    
    // Calculadora de cotización
    const areaSelect = document.getElementById('area');
    const customAreaGroup = document.getElementById('customAreaGroup');
    const customAreaInput = document.getElementById('customArea');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultDiv = document.getElementById('result');
    const formatoImpreso = document.getElementById('formato-impreso');
    const tamanoPapelGroup = document.getElementById('tamano-papel-group');
    const fechaInicioInput = document.getElementById('fecha-inicio');
    const fechaEntregaSelect = document.getElementById('fecha-entrega');
    
    // Mostrar campo de hectáreas exactas cuando sea necesario
    areaSelect.addEventListener('change', function() {
        const selectedValue = this.value;
        if (selectedValue === '2500' || selectedValue === '2000' || selectedValue === '1500') {
            customAreaGroup.style.display = 'block';
        } else {
            customAreaGroup.style.display = 'none';
        }
    });
    
    // Mostrar opciones de tamaño de papel si se selecciona formato impreso
    formatoImpreso.addEventListener('change', function() {
        tamanoPapelGroup.style.display = this.checked ? 'block' : 'none';
    });
    
    // Calcular cotización
    calculateBtn.addEventListener('click', calculateQuote);
    
    function calculateQuote() {
        // Obtener precio base
        let basePrice = 0;
        const areaValue = areaSelect.value;
        
        if (areaValue === '5000') {
            basePrice = 5000;
        } else if (areaValue === '15000') {
            basePrice = 15000 + Math.random() * (30000 - 15000); // Aleatorio entre 15k-30k
        } else if (areaValue === '2500' || areaValue === '2000' || areaValue === '1500') {
            const customArea = parseFloat(customAreaInput.value);
            if (isNaN(customArea) || customArea <= 0) {
                alert('Por favor ingrese un número válido de hectáreas');
                return;
            }
            
            let pricePerHa = parseFloat(areaValue);
            let maxPricePerHa = 0;
            
            // Establecer precio máximo por hectárea según rango
            if (areaValue === '2500') maxPricePerHa = 4000;
            else if (areaValue === '2000') maxPricePerHa = 3500;
            else if (areaValue === '1500') maxPricePerHa = 3000;
            
            // Calcular precio aleatorio por hectárea dentro del rango
            pricePerHa = pricePerHa + Math.random() * (maxPricePerHa - pricePerHa);
            basePrice = customArea * pricePerHa;
        }
        
        // Obtener ajustes
        const locationAdj = parseFloat(document.getElementById('location').value);
        const equipmentAdj = parseFloat(document.getElementById('equipment').value);
        const terrainAdj = parseFloat(document.getElementById('terrain').value);
        const vegetationAdj = parseFloat(document.getElementById('vegetation').value);
        const surfaceAdj = parseFloat(document.getElementById('surface').value);
        
        // Calcular ajuste por productos
        let productsAdj = 0;
        const productCheckboxes = document.querySelectorAll('.calculator-section input[type="checkbox"]:checked');
        productCheckboxes.forEach(checkbox => {
            if (!checkbox.name) { // Solo checkboxes de productos, no de formato
                productsAdj += parseFloat(checkbox.value);
            }
        });
        
        // Calcular ajuste por tiempo de entrega
        const tiempoEntrega = document.getElementById('fecha-entrega').value;
        let tiempoAdj = 0;
        if (tiempoEntrega === '3') tiempoAdj = 0.15;
        
        // Calcular ajuste por formato impreso
        let formatoAdj = 0;
        if (formatoImpreso.checked) {
            const tamanoPapel = document.getElementById('tamano-papel').value;
            if (tamanoPapel === 'Oficio') formatoAdj = 100;
            else if (tamanoPapel === 'A1') formatoAdj = 300;
            else if (tamanoPapel === 'A2') formatoAdj = 200;
        }
        
        // Calcular total de ajustes porcentuales
        const totalAdj = locationAdj + productsAdj + equipmentAdj + terrainAdj + vegetationAdj + surfaceAdj + tiempoAdj;
        const adjustedPrice = basePrice * (1 + totalAdj) + formatoAdj;
        
        // Mostrar resultados
        document.getElementById('basePrice').textContent = formatCurrency(basePrice);
        document.getElementById('locationAdjustment').textContent = (locationAdj * 100).toFixed(0) + '%';
        document.getElementById('productsAdjustment').textContent = (productsAdj * 100).toFixed(0) + '%';
        document.getElementById('equipmentAdjustment').textContent = (equipmentAdj * 100).toFixed(0) + '%';
        document.getElementById('terrainAdjustment').textContent = ((terrainAdj + vegetationAdj + surfaceAdj) * 100).toFixed(0) + '%';
        document.getElementById('totalPrice').textContent = formatCurrency(adjustedPrice);
        document.getElementById('finalPrice').textContent = formatCurrency(adjustedPrice) + ' MXN';
        
        // Mostrar resultados
        resultDiv.style.display = 'block';
        
        // Hacer scroll suave a los resultados
        resultDiv.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Formatear moneda
    function formatCurrency(amount) {
        return '$' + amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    
    // Manejo del formulario completo
    const form = document.getElementById('presupuesto-form');
    const formMessage = document.getElementById('form-message');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar que se haya calculado el precio primero
        if (document.getElementById('finalPrice').textContent === '$0.00 MXN') {
            showMessage('Por favor calcule primero la cotización', 'error');
            return;
        }
        
        showMessage('Generando PDF...', 'info');
        
        try {
            // Recopilar todos los datos del formulario
            const data = collectFormData();
            
            // Generar y descargar PDF
            generateAndDownloadPDF(data);
            
            showMessage('¡PDF generado correctamente!', 'success');
        } catch (error) {
            console.error('Error:', error);
            showMessage('Error al generar el PDF. Por favor intente nuevamente.', 'error');
        }
    });

    // Función para recopilar datos del formulario
    function collectFormData() {
        const formData = new FormData(form);
        const data = {};
        
        // Datos básicos del formulario
        formData.forEach((value, key) => {
            // Corregir nombres de campos si es necesario
            if (key === 'fecha-cortega') key = 'fecha-entrega';
            if (key === 'ubicador') key = 'ubicacion';
            data[key] = value;
        });
        
        // Datos de la cotización
        data.cotizacion = {
            precioBase: document.getElementById('basePrice').textContent,
            ajusteUbicacion: document.getElementById('locationAdjustment').textContent,
            ajusteProductos: document.getElementById('productsAdjustment').textContent,
            ajusteEquipo: document.getElementById('equipmentAdjustment').textContent,
            ajusteTerreno: document.getElementById('terrainAdjustment').textContent,
            total: document.getElementById('totalPrice').textContent
        };
        
        // Obtener datos de condiciones del terreno
        data.condicionesTerreno = {
            equipo: document.getElementById('equipment').options[document.getElementById('equipment').selectedIndex].text,
            tipoTerreno: document.getElementById('terrain').options[document.getElementById('terrain').selectedIndex].text,
            vegetacion: document.getElementById('vegetation').options[document.getElementById('vegetation').selectedIndex].text,
            superficie: document.getElementById('surface').options[document.getElementById('surface').selectedIndex].text
        };
        
        // Productos seleccionados
        data.productos = [];
        document.querySelectorAll('.calculator-section input[type="checkbox"]:checked').forEach(checkbox => {
            if (!checkbox.name) { // Solo productos, no formatos
                data.productos.push({
                    nombre: checkbox.nextElementSibling.textContent.trim(),
                    valor: checkbox.value
                });
            }
        });
        
        // Formatos seleccionados (modificado para mostrar "PDF Digital" y "PDF Impreso")
        data.formato = [];
        document.querySelectorAll('.minimal-form input[type="checkbox"][name="formato[]"]:checked').forEach(checkbox => {
            let formatoTexto = checkbox.value;
            if (checkbox.value === 'PDF') formatoTexto = 'PDF Digital';
            if (checkbox.value === 'Impreso') formatoTexto = 'PDF Impreso';
            data.formato.push(formatoTexto);
        });
        
        // Calcular fecha final basada en la fecha de inicio y días de entrega
        if (data['fecha-inicio'] && data['fecha-entrega']) {
            const fechaInicio = new Date(data['fecha-inicio']);
            const diasEntrega = parseInt(data['fecha-entrega']) + 1; // +1 porque el día inicial cuenta
            fechaInicio.setDate(fechaInicio.getDate() + diasEntrega - 1);
            data.fechaFinal = formatDate(fechaInicio);
        }
        return data;
    }

    // Función para formatear fecha
    function formatDate(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('es-MX', options);
    }

    // Función para generar y descargar PDF
    function generateAndDownloadPDF(data) {
        try {
            // Verificar que jsPDF esté cargado
            if (!window.jspdf) {
                throw new Error('La librería jsPDF no está cargada correctamente');
            }
    
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            // Configuración inicial
            doc.setProperties({
                title: `Cotización MANBAL - ${data.nombre || 'Cliente'}`,
                subject: 'Cotización de servicios topográficos',
                author: 'Grupo MANBAL',
                keywords: 'cotización, topografía, medición, terreno',
                creator: 'Grupo MANBAL'
            });
    
            // Logo y encabezado (primera página)
            doc.addImage('img/Logo.png', 'PNG', 10, 10, 30, 30);
            doc.setFontSize(18);
            doc.setTextColor(40, 40, 40);
            doc.text('Grupo MANBAL - Cotización Topográfica', 45, 20);
            doc.setFontSize(12);
            doc.text('Ingeniería & Topografía', 45, 26);
            
            // Información de contacto
            doc.setFontSize(10);
            doc.setTextColor(44, 62, 80);
            doc.text('Para cualquier duda contáctate mediante WhatsApp o Gmail:', 10, 40);
            doc.setTextColor(0, 0, 128);
            doc.text('+52 2321091909', 10, 45);
            doc.text('grupomandal@gmail.com', 10, 50);
    
            // Fecha y número de cotización
            doc.setTextColor(0, 0, 0);
            doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 160, 15);
            doc.text(`N° Cotización: ${Math.floor(Math.random() * 10000)}`, 160, 22);
    
            // Línea separadora
            doc.setDrawColor(44, 62, 80);
            doc.setLineWidth(0.5);
            doc.line(10, 55, 200, 55);
    
            // Información del cliente
            doc.setFontSize(14);
            doc.setTextColor(44, 62, 80);
            doc.text('Información del Cliente', 10, 65);
            
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            doc.text(`Nombre: ${data.nombre || 'No especificado'}`, 10, 72);
            doc.text(`Email: ${data.email || 'No especificado'}`, 10, 80);
            doc.text(`Teléfono: ${data.telefono || 'No especificado'}`, 10, 88);
            doc.text(`Ubicación del proyecto: ${data.ubicacion || 'No especificado'}`, 10, 96);
    
            // Detalles del proyecto
            doc.setFontSize(14);
            doc.setTextColor(44, 62, 80);
            doc.text('Detalles del Proyecto', 10, 110);
            
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            let yPosition = 118;
            doc.text(`Fecha de inicio: ${data['fecha-inicio'] || 'No especificada'}`, 10, yPosition);
            yPosition += 8;
            doc.text(`Plazo de entrega: ${getPlazoText(data['fecha-entrega'])} días`, 10, yPosition);
            yPosition += 8;
            doc.text(`Fecha estimada de entrega: ${data.fechaFinal || 'No especificada'}`, 10, yPosition);
            yPosition += 8;
            doc.text(`Formatos requeridos: ${getFormatosText(data)}`, 10, yPosition);
            yPosition += 8;
            
            if (data['formato'] && data['formato'].includes('PDF Impreso') && data['tamano-papel']) {
                doc.text(`Tamaño de papel: ${data['tamano-papel']}`, 10, yPosition);
                yPosition += 8;
            }
            // Descripción del proyecto
            doc.setFontSize(14);
            doc.setTextColor(44, 62, 80);
            doc.text('Descripción del Proyecto', 10, yPosition + 5);
            
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            const proyectoText = data.proyecto || 'No se proporcionó descripción';
            const splitText = doc.splitTextToSize(proyectoText, 180);
            doc.text(splitText, 10, yPosition + 15);

            // Segunda página - Detalles de la cotización
            doc.addPage();
            
            doc.setFontSize(14);
            doc.setTextColor(44, 62, 80);
            doc.text('Detalles de la Cotización', 10, 20);
            
            // Tabla de resumen de cotización
            doc.autoTable({
                startY: 30,
                head: [['Concepto', 'Valor']],
                body: [
                    ['Precio base', data.cotizacion.precioBase || '$0.00'],
                    ['Ajuste por ubicación', data.cotizacion.ajusteUbicacion || '0%'],
                    ['Ajuste por productos', data.cotizacion.ajusteProductos || '0%'],
                    ['Ajuste por equipo', data.cotizacion.ajusteEquipo || '0%'],
                    ['Ajuste por condiciones del terreno', data.cotizacion.ajusteTerreno || '0%'],
                    ['TOTAL', { content: data.cotizacion.total || '$0.00', styles: { fontStyle: 'bold' } }]
                ],
                theme: 'grid',
                headStyles: { 
                    fillColor: [44, 62, 80],
                    textColor: [255, 255, 255],
                    fontStyle: 'bold'
                },
                alternateRowStyles: {
                    fillColor: [240, 240, 240]
                },
                margin: { top: 30 }
            });

            // Tabla de condiciones del terreno
            doc.setFontSize(14);
            doc.setTextColor(44, 62, 80);
            doc.text('Condiciones del Terreno', 10, doc.autoTable.previous.finalY + 15);
            
            doc.autoTable({
                startY: doc.autoTable.previous.finalY + 20,
                head: [['Característica', 'Valor']],
                body: [
                    ['Equipo a utilizar', data.condicionesTerreno.equipo],
                    ['Tipo de terreno', data.condicionesTerreno.tipoTerreno],
                    ['Vegetación', data.condicionesTerreno.vegetacion],
                    ['Superficie del suelo', data.condicionesTerreno.superficie]
                ],
                theme: 'grid',
                headStyles: { 
                    fillColor: [44, 62, 80],
                    textColor: [255, 255, 255],
                    fontStyle: 'bold'
                },
                alternateRowStyles: {
                    fillColor: [240, 240, 240]
                }
            });

            // Productos seleccionados
            if (data.productos && data.productos.length > 0) {
                doc.setFontSize(12);
                doc.text('Productos/Servicios seleccionados:', 10, doc.autoTable.previous.finalY + 15);
                
                const productosBody = data.productos.map(p => [
                    p.nombre, 
                    { content: `${(parseFloat(p.valor) * 100)}%`, styles: { halign: 'right' } }
                ]);
                
                doc.autoTable({
                    startY: doc.autoTable.previous.finalY + 20,
                    head: [['Producto', 'Ajuste']],
                    body: productosBody,
                    theme: 'grid',
                    headStyles: { 
                        fillColor: [44, 62, 80],
                        textColor: [255, 255, 255],
                        fontStyle: 'bold'
                    },
                    columnStyles: {
                        1: { halign: 'right' }
                    },
                    alternateRowStyles: {
                        fillColor: [240, 240, 240]
                    }
                });
            }
    
            // Términos y condiciones
            doc.addPage();
            doc.setFontSize(14);
            doc.setTextColor(44, 62, 80);
            doc.text('Términos y Condiciones', 10, 20);
            
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            const terminos = [
                "1. Esta cotización es válida por 15 días a partir de la fecha de emisión.",
                "2. Los precios no incluyen IVA.",
                "3. El plazo de entrega comienza a contar una vez recibida la orden de compra y el anticipo correspondiente.",
                "4. Se requiere un anticipo del 50% para iniciar los trabajos.",
                "5. Cualquier cambio en los requerimientos iniciales podrá afectar el costo y plazo de entrega.",
                "6. Los trabajos se realizan de acuerdo a los estándares profesionales de topografía.",
                "7. El cliente es responsable de proporcionar acceso al terreno y cualquier permiso necesario."
            ];
            
            let y = 30;
            terminos.forEach(termino => {
                doc.text(termino, 10, y);
                y += 7;
            });

            // Pie de página en todas las páginas
            const pageCount = doc.internal.getNumberOfPages();
            for(let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setTextColor(100, 100, 100);
                doc.text(`Página ${i} de ${pageCount}`, 105, 285, { align: 'center' });
                doc.text('© 2025 Grupo MANBAL. Todos los derechos reservados.', 105, 290, { align: 'center' });
            }

            // Guardar PDF
            const nombreArchivo = `Cotizacion_MANBAL_${data.nombre ? data.nombre.replace(/ /g, '_') : 'Cliente'}.pdf`;
            doc.save(nombreArchivo);
            
        } catch (error) {
            console.error('Error al generar PDF:', error);
            throw error;
        }
    }

    // Función para obtener texto de plazo
    function getPlazoText(plazo) {
        if (!plazo) return 'No especificado';
        
        switch(plazo) {
            case '3': return '3';
            case '5': return '5';
            case '7': return '7 ';
            case '10': return '10 ';
            default: return plazo;
        }
    }

    // Función para obtener texto de formatos
    function getFormatosText(data) {
        if (!data['formato'] || !Array.isArray(data['formato']) || data['formato'].length === 0) {
            return 'No especificado';
        }
        return data['formato'].join(', ');
    }

    // Función para mostrar mensajes
    function showMessage(text, type) {
        formMessage.textContent = text;
        formMessage.className = `form-message ${type}`;
        formMessage.style.display = 'block';
        
        // Ocultar mensaje después de 5 segundos
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }

    // Calcular fecha final cuando cambia la fecha de inicio o días de entrega
    function updateFechaFinal() {
        if (fechaInicioInput.value && fechaEntregaSelect.value) {
            // Parsear la fecha de inicio (el formato YYYY-MM-DD se interpreta correctamente)
            const fechaInicio = new Date(fechaInicioInput.value);
            
            // Sumar los días (agregamos 1 porque el día de inicio cuenta como día 1)
            const diasEntrega = parseInt(fechaEntregaSelect.value) + 1;
            fechaInicio.setDate(fechaInicio.getDate() + diasEntrega - 1);
            
            // Formatear la fecha resultante
            const fechaFinal = formatDate(fechaInicio);
            console.log('Fecha estimada de entrega:', fechaFinal);
        }
    }
});
