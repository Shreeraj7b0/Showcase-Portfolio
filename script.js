// script.js

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Modals Logic
    const projectCards = document.querySelectorAll('.project-card');
    
    // Modals
    const projectModal = document.getElementById('projectModal');
    const aboutModal = document.getElementById('aboutModal');
    
    // Close Buttons
    const closeProjectBtn = document.getElementById('closeProjectModal');
    const closeAboutBtn = document.getElementById('closeAboutModal');
    
    // About Button
    const aboutBtn = document.getElementById('aboutBtn');
    
    // Project Modal Content Elements
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const modalLink = document.getElementById('modalLink');

    // Open Project Modal
    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.getAttribute('data-title');
            const desc = card.getAttribute('data-desc');
            const link = card.getAttribute('data-link');

            modalTitle.textContent = title;
            modalDesc.textContent = desc;
            modalLink.href = link;

            projectModal.classList.add('active');
        });
    });

    // Open About Modal
    aboutBtn.addEventListener('click', () => {
        aboutModal.classList.add('active');
    });

    // Close Modals Function
    const closeModals = () => {
        projectModal.classList.remove('active');
        aboutModal.classList.remove('active');
    };

    closeProjectBtn.addEventListener('click', closeModals);
    closeAboutBtn.addEventListener('click', closeModals);
    
    // Close modal on clicking outside the content
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModals();
            }
        });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModals();
        }
    });

    // 2. Form Submission Prevent Default
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            // Visual feedback
            submitBtn.textContent = 'Message Sent';
            submitBtn.style.background = 'rgba(255,255,255,0.3)';
            
            contactForm.reset();
            
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.background = '';
            }, 3000);
        });
    }

    // 3. Scroll Intersection Observer for fade-in animations
    const sections = document.querySelectorAll('.section-title, .project-card, .anecdote-card, .form-glass, .social-links-container, .hero-subtext');
    sections.forEach(sec => sec.classList.add('fade-in'));

    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -100px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    sections.forEach(section => {
        appearOnScroll.observe(section);
    });

    // 4. Flame Cursor Effect
    const canvas = document.getElementById('pixelCanvas');
    const ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let isMoving = false;
    let moveTimeout;
    let particles = [];

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        isMoving = true;
        
        clearTimeout(moveTimeout);
        moveTimeout = setTimeout(() => {
            isMoving = false;
        }, 100);
    });

    class FlameParticle {
        constructor(x, y) {
            // Spawn around cursor
            this.x = x + (Math.random() - 0.5) * 8;
            this.y = y + (Math.random() - 0.5) * 8;
            this.size = Math.random() * 6 + 3;
            this.life = 1;
            this.decay = Math.random() * 0.04 + 0.02;
            this.speedY = Math.random() * -2 - 0.5; // Move up like fire
            this.speedX = (Math.random() - 0.5) * 1;
            
            // Fire colors
            const colors = ['#ffcc00', '#ff9900', '#ff3300', '#cc0000'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.size *= 0.95; // Shrink as it rises
            this.life -= this.decay;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.life;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    const animateFlame = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Generate flame at cursor
        if (isMoving) {
            for (let i = 0; i < 2; i++) {
                particles.push(new FlameParticle(mouseX, mouseY));
            }
        }

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            
            if (particles[i].life <= 0 || particles[i].size <= 0.1) {
                particles.splice(i, 1);
                i--;
            }
        }

        requestAnimationFrame(animateFlame);
    };

    animateFlame();
});
