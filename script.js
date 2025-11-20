// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.about-content, .skills-grid, .timeline-item, .experience-item, .project-card, .contact-item');
    
    animateElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    initializeContactForm();
});

// Header background on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(15, 12, 41, 0.98)';
    } else {
        header.style.background = 'rgba(15, 12, 41, 0.95)';
    }
});

// Skill buttons hover effect
document.querySelectorAll('.skill-btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.05)';
    });
    
    btn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Typing effect for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when page loads
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-text h1');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText, 150);
    }
    const printCvBtn = document.getElementById('print-cv-btn');
    if (printCvBtn) {
        printCvBtn.addEventListener('click', () => {
            window.open('cv.html?print=1', '_blank');
        });
    }
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Active navigation link highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Contact form validation (if form is added later)
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    const fields = {
        name: document.getElementById('contact-name'),
        email: document.getElementById('contact-email'),
        message: document.getElementById('contact-message')
    };
    const statusEl = document.getElementById('contact-status');

    const updateStatus = (message, isError = false) => {
        if (!statusEl) return;
        statusEl.textContent = message;
        statusEl.classList.toggle('error', isError);
    };

    const setFieldError = (field, message) => {
        if (!field) return;
        field.classList.add('input-error');
        const errorSpan = contactForm.querySelector(`.input-error-text[data-for=\"${field.id}\"]`);
        if (errorSpan) {
            errorSpan.textContent = message;
        }
    };

    const clearFieldError = (field) => {
        if (!field) return;
        field.classList.remove('input-error');
        const errorSpan = contactForm.querySelector(`.input-error-text[data-for=\"${field.id}\"]`);
        if (errorSpan) {
            errorSpan.textContent = '';
        }
    };

    Object.values(fields).forEach(field => {
        if (!field) return;
        field.addEventListener('input', () => {
            clearFieldError(field);
            updateStatus('');
        });
    });

    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();
        let hasErrors = false;

        const nameValue = fields.name?.value.trim() || '';
        const emailValue = fields.email?.value.trim() || '';
        const messageValue = fields.message?.value.trim() || '';

        if (!nameValue) {
            setFieldError(fields.name, 'Please enter your name.');
            hasErrors = true;
        }

        if (!emailValue) {
            setFieldError(fields.email, 'Please enter your email.');
            hasErrors = true;
        } else if (!validateEmail(emailValue)) {
            setFieldError(fields.email, 'Please enter a valid email address.');
            hasErrors = true;
        }

        if (!messageValue) {
            setFieldError(fields.message, 'Please add a short message.');
            hasErrors = true;
        }

        if (hasErrors) {
            updateStatus('Please fix the highlighted fields and try again.', true);
            return;
        }

        console.group('Contact form submission');
        console.log('Name:', nameValue);
        console.log('Email:', emailValue);
        console.log('Message:', messageValue);
        console.groupEnd();

        updateStatus(`Thanks, ${nameValue}! I\'ll reach out soon.`);
        contactForm.reset();
    });
}

// Copy contact information to clipboard
document.querySelectorAll('.contact-details p').forEach(element => {
    element.addEventListener('click', function() {
        const text = this.textContent;
        navigator.clipboard.writeText(text).then(() => {
            // Show a temporary tooltip or notification
            const originalText = this.textContent;
            this.textContent = 'Copied!';
            this.style.color = '#667eea';
            
            setTimeout(() => {
                this.textContent = originalText;
                this.style.color = '#b8b8b8';
            }, 2000);
        });
    });
    
    // Add cursor pointer to indicate clickable
    element.style.cursor = 'pointer';
});

// Loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in-out';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Back to top button functionality
function createBackToTopButton() {
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTop.className = 'back-to-top';
    backToTop.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(45deg, #667eea, #764ba2);
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        font-size: 1.2rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
    `;
    
    document.body.appendChild(backToTop);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    backToTop.addEventListener('mouseenter', () => {
        backToTop.style.transform = 'translateY(-3px)';
        backToTop.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
    });
    
    backToTop.addEventListener('mouseleave', () => {
        backToTop.style.transform = 'translateY(0)';
        backToTop.style.boxShadow = '0 5px 15px rgba(102, 126, 234, 0.3)';
    });
}

// Initialize back to top button
createBackToTopButton();

// Add CSS for active navigation link
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: #667eea !important;
    }
    
    .nav-link.active::after {
        width: 100% !important;
    }
`;
document.head.appendChild(style);
