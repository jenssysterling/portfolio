/* ==========================================
   JENSSY STERLING · SCRIPT PRINCIPAL
   Funcionalidades compartidas para todas las páginas
   ========================================== */

// ==========================================
// MENÚ MÓVIL
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            mainNav.classList.toggle('is-open');
            
            // Actualizar aria-expanded
            const isOpen = mainNav.classList.contains('is-open');
            this.setAttribute('aria-expanded', isOpen);
        });

        // Cerrar menú al hacer click en un enlace
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                mainNav.classList.remove('is-open');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });

        // Cerrar menú al hacer click fuera
        document.addEventListener('click', function(e) {
            const header = document.querySelector('.header');
            if (header && !header.contains(e.target)) {
                menuToggle.classList.remove('active');
                mainNav.classList.remove('is-open');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
});


// ==========================================
// SCROLL SUAVE PARA ENLACES INTERNOS
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(function(link) {
        // Ignorar enlaces que solo son "#" o que tienen http
        const href = link.getAttribute('href');
        if (href === '#' || href === '' || href.startsWith('http')) return;
        
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(href);
            if (!target) return;
            
            const header = document.querySelector('.header');
            const navHeight = header ? header.offsetHeight : 70;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 16;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
});


// ==========================================
// NAVBAR SHADOW AL HACER SCROLL
// ==========================================

document.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    if (window.scrollY > 20) {
        header.style.boxShadow = '0 2px 24px rgba(0, 0, 0, 0.08)';
    } else {
        header.style.boxShadow = 'none';
    }
});


// ==========================================
// ANIMACIONES AL HACER SCROLL (INTERSECTION OBSERVER)
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    // Elementos a animar
    const elements = document.querySelectorAll(
        '.story-card, .project-item, .process-step, .platform-card, ' +
        '.moodboard-item, .collapsible, .social-link'
    );
    
    if (elements.length === 0) return;
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
    });
    
    elements.forEach(function(el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
});

// Estilos para la animación (se añaden dinámicamente)
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
});


// ==========================================
// COLLAPSIBLE: ABRIR DESDE MENÚ (PARA LECTORA)
// ==========================================

// Función global para abrir un collapsible desde el menú
window.openCollapsible = function(id) {
    const element = document.getElementById(id);
    if (!element) return;
    
    // Abrir el collapsible
    element.open = true;
    
    // También abrir la primera letra (A) de la sección
    const firstLetter = element.querySelector('.collapsible-letter-section');
    if (firstLetter) {
        firstLetter.open = true;
    }
    
    // Scroll hacia el elemento
    setTimeout(function() {
        const header = document.querySelector('.header');
        const navHeight = header ? header.offsetHeight : 70;
        const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - navHeight - 16;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }, 150);
    
    // Cerrar menú móvil si está abierto
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');
    if (menuToggle && mainNav) {
        menuToggle.classList.remove('active');
        mainNav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
    }
};


// ==========================================
// COMPORTAMIENTO: CERRAR OTROS COLLAPSIBLES
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    // Cerrar todos los collapsibles principales al cargar
    document.querySelectorAll('.collapsible-section').forEach(details => {
        details.open = false;
    });
    
    // Si hay un hash en la URL, abrir el correspondiente
    if (window.location.hash) {
        const id = window.location.hash.replace('#', '');
        const details = document.getElementById(id);
        if (details) {
            details.open = true;
            // También abrir la primera letra (A) de la sección
            const firstLetter = details.querySelector('.collapsible-letter-section');
            if (firstLetter) {
                firstLetter.open = true;
            }
        }
    }
});

// Comportamiento: Cerrar SOLO otros collapsibles principales al abrir uno
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.collapsible-section').forEach(details => {
        details.addEventListener('toggle', function() {
            if (this.open) {
                document.querySelectorAll('.collapsible-section').forEach(other => {
                    if (other !== this && other.id) {
                        other.open = false;
                    }
                });
            }
        });
    });
});


// ==========================================
// GUARDAR ESTADO DE COLLAPSIBLES EN LOCALSTORAGE
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    // Guardar estado cuando se abre/cierra un collapsible
    document.querySelectorAll('.collapsible-section, .collapsible-letter-section').forEach(details => {
        details.addEventListener('toggle', function() {
            const id = this.id || this.querySelector('.bl-letter')?.textContent || 'unknown';
            const key = 'collapsible-' + id;
            localStorage.setItem(key, this.open);
        });
    });
    
    // Restaurar estado guardado (solo para secciones principales, no sobrescribir el hash)
    if (!window.location.hash) {
        document.querySelectorAll('.collapsible-section, .collapsible-letter-section').forEach(details => {
            const id = details.id || details.querySelector('.bl-letter')?.textContent || 'unknown';
            const key = 'collapsible-' + id;
            const savedState = localStorage.getItem(key);
            if (savedState !== null) {
                details.open = savedState === 'true';
            }
        });
    }
});


// ==========================================
// BUSCADOR DE TÍTULOS
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    // Crear buscador en cada sección colapsable
    document.querySelectorAll('.collapsible-section').forEach(section => {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        searchContainer.style.cssText = `
            margin: 1rem 0 1.5rem 0;
            padding: 0 0.5rem;
        `;
        
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = '🔍 Buscar título...';
        searchInput.style.cssText = `
            width: 100%;
            padding: 0.75rem 1rem;
            border: 2px solid rgba(255, 107, 157, 0.2);
            border-radius: 12px;
            font-size: 1rem;
            font-family: inherit;
            background: rgba(255, 255, 255, 0.05);
            color: inherit;
            transition: all 0.3s ease;
        `;
        
        searchInput.addEventListener('focus', function() {
            this.style.borderColor = 'rgba(255, 107, 157, 0.6)';
            this.style.boxShadow = '0 0 20px rgba(255, 107, 157, 0.1)';
        });
        
        searchInput.addEventListener('blur', function() {
            this.style.borderColor = 'rgba(255, 107, 157, 0.2)';
            this.style.boxShadow = 'none';
        });
        
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();
            const items = section.querySelectorAll('.bl-item');
            const letterSections = section.querySelectorAll('.collapsible-letter-section');
            
            if (query === '') {
                // Mostrar todo
                items.forEach(item => item.style.display = '');
                letterSections.forEach(letter => {
                    letter.open = true;
                    letter.style.display = '';
                });
                // Limpiar mensaje de no resultados
                const existingMsg = section.querySelector('.no-results');
                if (existingMsg) existingMsg.remove();
                return;
            }
            
            let hasResults = false;
            letterSections.forEach(letter => {
                const itemsInLetter = letter.querySelectorAll('.bl-item');
                let letterHasMatch = false;
                
                itemsInLetter.forEach(item => {
                    const title = item.querySelector('.bl-title')?.textContent.toLowerCase() || '';
                    const match = title.includes(query);
                    item.style.display = match ? '' : 'none';
                    if (match) letterHasMatch = true;
                });
                
                // Mostrar/ocultar la letra según si tiene resultados
                if (letterHasMatch) {
                    letter.style.display = '';
                    letter.open = true;
                    hasResults = true;
                } else {
                    letter.style.display = 'none';
                }
            });
            
            // Mostrar mensaje si no hay resultados
            const existingMsg = section.querySelector('.no-results');
            if (!hasResults) {
                if (!existingMsg) {
                    const msg = document.createElement('p');
                    msg.className = 'no-results';
                    msg.textContent = 'No se encontraron títulos con ese nombre';
                    msg.style.cssText = `
                        text-align: center;
                        padding: 2rem;
                        color: rgba(0, 0, 0, 0.5);
                        font-style: italic;
                    `;
                    section.querySelector('.collapsible-content').appendChild(msg);
                }
            } else if (existingMsg) {
                existingMsg.remove();
            }
        });
        
        searchContainer.appendChild(searchInput);
        const content = section.querySelector('.collapsible-content');
        if (content) {
            content.insertBefore(searchContainer, content.firstChild);
        }
    });
});


// ==========================================
// CONTADOR DE TÍTULOS POR SECCIÓN
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.collapsible-section').forEach(section => {
        const items = section.querySelectorAll('.bl-item');
        const total = items.length;
        
        const header = section.querySelector('.collapsible-header');
        if (header) {
            const counter = document.createElement('span');
            counter.className = 'title-counter';
            counter.textContent = `(${total} títulos)`;
            counter.style.cssText = `
                font-size: 0.75rem;
                opacity: 0.6;
                font-weight: 400;
                margin-left: 0.5rem;
            `;
            const title = header.querySelector('.collapsible-title');
            if (title) {
                title.appendChild(counter);
            }
        }
    });
});

// ==========================================
// ATAJOS DE TECLADO
// ==========================================

document.addEventListener('keydown', function(e) {
    // Ctrl + 1 = Abrir BL
    if (e.ctrlKey && e.key === '1') {
        e.preventDefault();
        openCollapsible('manhwa-bl');
    }
    // Ctrl + 2 = Abrir Webtoons
    if (e.ctrlKey && e.key === '2') {
        e.preventDefault();
        openCollapsible('webtoons');
    }
    // Ctrl + 3 = Ir a lectura actual
    if (e.ctrlKey && e.key === '3') {
        e.preventDefault();
        const target = document.querySelector('#lectura-actual');
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    }
    // Escape = Cerrar todos los collapsibles
    if (e.key === 'Escape') {
        document.querySelectorAll('.collapsible-section').forEach(d => d.open = false);
    }
});

// ==========================================
// LOADING ANIMATION (FADE IN)
// ==========================================

window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.4s ease';
    
    setTimeout(function() {
        document.body.style.opacity = '1';
    }, 80);
});


// ==========================================
// LIGHTBOX PARA MOODBOARD (ESCRITORA)
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    const moodboardImages = document.querySelectorAll('.moodboard-item img');
    
    if (moodboardImages.length === 0) return;
    
    moodboardImages.forEach(function(img) {
        img.style.cursor = 'pointer';
        
        img.addEventListener('click', function() {
            // Crear lightbox
            const lightbox = document.createElement('div');
            lightbox.id = 'lightbox';
            lightbox.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.88);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                cursor: pointer;
                animation: lightboxFade 0.3s ease;
                padding: 2rem;
            `;
            
            // Clonar imagen
            const imgClone = this.cloneNode(true);
            imgClone.style.cssText = `
                max-width: 90%;
                max-height: 90%;
                border-radius: 12px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                object-fit: contain;
            `;
            
            lightbox.appendChild(imgClone);
            document.body.appendChild(lightbox);
            
            // Cerrar al hacer click
            lightbox.addEventListener('click', function() {
                lightbox.remove();
            });
            
            // Cerrar con tecla ESC
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    const lb = document.getElementById('lightbox');
                    if (lb) lb.remove();
                }
            });
        });
    });
});

// Estilos para el lightbox
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes lightboxFade {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
});


// ==========================================
// LOG DE CONSOLA CON INFORMACIÓN ÚTIL
// ==========================================

console.log('✦ Jenssy Sterling · Web cargada correctamente');
console.log('📖 Escritora · Lectora · BL');
console.log('💬 Comunidad en WhatsApp y Discord');
console.log('⌨️ Atajos de teclado: Ctrl+1=BL, Ctrl+2=Webtoons, Ctrl+3=Lectura, Escape=Cerrar todo');
console.log('🎨 Tema guardado en localStorage');
console.log('💾 Estado de collapsibles guardado en localStorage');