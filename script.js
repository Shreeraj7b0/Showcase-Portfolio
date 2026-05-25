// script.js

document.addEventListener('DOMContentLoaded', () => {

    // 1. Neon Green Blob Cursor
    const cursor = document.getElementById('customCursor');
    
    // 2. Modern UI Peek Effect Logic
    // We need to pass the mouse coordinates relative to each peek-element as CSS variables
    const peekElements = document.querySelectorAll('.peek-element');

    window.addEventListener('mousemove', (e) => {
        // Update Cursor
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';

        // Update Peek Elements
        peekElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            // Calculate mouse position relative to the element
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Set variables
            el.style.setProperty('--mouse-x', `${x}px`);
            el.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // 3. Matrix Digital Rain on Left Sidebar
    const matrixCanvas = document.getElementById('matrixCanvas');
    const ctx = matrixCanvas.getContext('2d');
    const matrixSidebar = document.getElementById('matrixSidebar');

    let matrixInterval;
    let isMatrixRunning = false;

    // Set canvas dimensions to match sidebar
    const resizeMatrix = () => {
        matrixCanvas.width = matrixSidebar.clientWidth;
        matrixCanvas.height = matrixSidebar.clientHeight;
    };
    window.addEventListener('resize', resizeMatrix);
    resizeMatrix();

    // Characters for the rain
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%""\'#&_(),.;:?!\\|{}<>[]^~'.split('');
    const fontSize = 14;
    let columns = matrixCanvas.width / fontSize;
    let drops = [];

    const resetDrops = () => {
        columns = matrixCanvas.width / fontSize;
        drops = [];
        for (let x = 0; x < columns; x++) {
            drops[x] = 1;
        }
    };
    resetDrops();

    const drawMatrix = () => {
        // Translucent black to create fading trail
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

        ctx.fillStyle = '#0F0'; // Neon green text
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    };

    // Only run matrix on hover
    matrixSidebar.addEventListener('mouseenter', () => {
        if (!isMatrixRunning) {
            isMatrixRunning = true;
            matrixInterval = setInterval(drawMatrix, 33); // ~30fps
        }
    });

    matrixSidebar.addEventListener('mouseleave', () => {
        isMatrixRunning = false;
        clearInterval(matrixInterval);
        // Clear canvas
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
    });

    // 4. Modals Logic
    const projectRows = document.querySelectorAll('.project-row');
    const projectModal = document.getElementById('projectModal');
    const aboutModal = document.getElementById('aboutModal');
    const closeProjectBtn = document.getElementById('closeProjectModal');
    const closeAboutBtn = document.getElementById('closeAboutModal');
    const aboutBtn = document.getElementById('aboutBtn');
    
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const modalLink = document.getElementById('modalLink');

    projectRows.forEach(row => {
        row.addEventListener('click', () => {
            modalTitle.textContent = row.getAttribute('data-title');
            modalDesc.textContent = row.getAttribute('data-desc');
            modalLink.href = row.getAttribute('data-link');
            projectModal.classList.add('active');
        });
    });

    aboutBtn.addEventListener('click', () => {
        aboutModal.classList.add('active');
    });

    const closeModals = () => {
        projectModal.classList.remove('active');
        aboutModal.classList.remove('active');
    };

    closeProjectBtn.addEventListener('click', closeModals);
    closeAboutBtn.addEventListener('click', closeModals);
    
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModals();
        });
    });

    // 5. Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'PING SENT_';
            
            contactForm.reset();
            
            setTimeout(() => {
                submitBtn.textContent = originalText;
            }, 3000);
        });
    }

    // 6. Smooth Scrolling for Sidebar Navigation
    document.querySelectorAll('.nav-btn').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Scroll the center-content container, not the window
                document.querySelector('.center-content').scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
});
