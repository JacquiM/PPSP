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
            const phone = formData.get('phone');
            const propertyType = formData.get('propertyType');
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

            // Create comprehensive email body with all form fields
            let emailBody = `${message}\n\n---\nContact Information:\nName: ${firstName} ${lastName}\nEmail: ${email}`;
            
            if (phone) {
                emailBody += `\nPhone: ${phone}`;
            }
            
            if (propertyType) {
                const propertyTypeLabels = {
                    'body-corporate': 'Body Corporate',
                    'hoa': 'Home Owners Association',
                    'sectional-title': 'Sectional Title',
                    'other': 'Other'
                };
                emailBody += `\nProperty Type: ${propertyTypeLabels[propertyType] || propertyType}`;
            }

            // Check if config is loaded
            if (!window.CONFIG?.emailjs?.serviceId || !window.CONFIG?.emailjs?.templateId) {
                showNotification('Configuration error. Please try again later.', 'error');
                console.error('EmailJS configuration not loaded');
                return;
            }

            emailjs.send(
                window.CONFIG.emailjs.serviceId, 
                window.CONFIG.emailjs.templateId, 
                {
                    from_name: `${firstName} ${lastName}`,
                    reply_to: email,
                    message: emailBody
                }
            ).then(() => {
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

    // Reviews Carousel
    const reviewsTrack = document.getElementById('reviews-track');
    const prevButton = document.getElementById('prev-review');
    const nextButton = document.getElementById('next-review');
    const reviewDots = document.querySelectorAll('.review-dot');
    
    if (reviewsTrack && prevButton && nextButton) {
        let currentIndex = 0;
        const totalReviews = reviewDots.length;
        
        function updateCarousel() {
            const translateX = -currentIndex * 100;
            reviewsTrack.style.transform = `translateX(${translateX}%)`;
            
            // Update dots
            reviewDots.forEach((dot, index) => {
                if (index === currentIndex) {
                    dot.classList.remove('bg-gray-300');
                    dot.classList.add('bg-ppsp-red');
                } else {
                    dot.classList.remove('bg-ppsp-red');
                    dot.classList.add('bg-gray-300');
                }
            });
        }
        
        function nextReview() {
            currentIndex = (currentIndex + 1) % totalReviews;
            updateCarousel();
        }
        
        function prevReview() {
            currentIndex = (currentIndex - 1 + totalReviews) % totalReviews;
            updateCarousel();
        }
        
        // Event listeners
        nextButton.addEventListener('click', nextReview);
        prevButton.addEventListener('click', prevReview);
        
        // Dot navigation
        reviewDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
        });
        
        // Auto-play carousel
        setInterval(nextReview, 7000);
        
        // Touch/swipe support for mobile
        let startX = 0;
        let endX = 0;
        
        reviewsTrack.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        reviewsTrack.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            handleSwipe();
        });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const deltaX = startX - endX;
            
            if (Math.abs(deltaX) > swipeThreshold) {
                if (deltaX > 0) {
                    nextReview();
                } else {
                    prevReview();
                }
            }
        }
    }
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
