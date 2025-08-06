// PPSP Website JavaScript

document.addEventListener('DOMContentLoaded', function () {

    // Mobile Menu Toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function () {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Smooth Scrolling for Navigation Links
    const smoothScrollLinks = document.querySelectorAll('.smooth-scroll');
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });

    // Contact Form Handling with EmailJS
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = new FormData(this);
            const firstName = formData.get('firstName');
            const lastName = formData.get('lastName');
            const email = formData.get('email');
            const message = formData.get('message');

            if (!firstName || !lastName || !email || !message) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }

            const emailBody = `${message}\n\n---\nContact Information:\nEmail: ${email}\nName: ${firstName} ${lastName}`;

            emailjs.send("service_eynsdlh", "template_4da7fag", {
                from_name: `${firstName} ${lastName}`,
                reply_to: email,
                message: emailBody
            }).then(() => {
                showNotification('Thank you for your message! We’ll be in touch shortly.', 'success');
                contactForm.reset();
            }, (error) => {
                showNotification('Oops! Something went wrong. Please try again.', 'error');
                console.error('EmailJS error:', error);
            });
        });
    }

    // Navigation Active State
    window.addEventListener('scroll', function () {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('nav a[href^="#"]');

        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;

            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('text-red-600');
            link.classList.add('text-gray-700');

            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.remove('text-gray-700');
                link.classList.add('text-red-600');
            }
        });
    });

    // Fade in animations on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.service-card, .bg-gray-50.rounded-2xl');
    animateElements.forEach(el => observer.observe(el));

    // Lazy loading for images
    const images = document.querySelectorAll('img');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
});

// Notification system
function showNotification(message, type = 'info') {
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());

    const notification = document.createElement('div');
    notification.className = `notification fixed top-4 right-4 px-6 py-4 rounded-lg shadow-lg z-50 transition-all duration-300 ${
        type === 'error' ? 'bg-red-600 text-white' :
        type === 'success' ? 'bg-green-600 text-white' :
        'bg-blue-600 text-white'
    }`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    }, 100);

    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}
