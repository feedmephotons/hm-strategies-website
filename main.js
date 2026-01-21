/**
 * H&M Strategies - Main JavaScript
 * Handles navigation, animations, and form interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    initPageLoader();
    initNavigation();
    initMobileMenu();
    initScrollReveal();
    initContactForm();
    initSmoothScroll();
    initCounterAnimation();
    initTestimonialSlider();
});

/**
 * Page loader
 */
function initPageLoader() {
    const loader = document.getElementById('page-loader');
    if (!loader) return;

    // Hide loader after content loads
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
            // Remove from DOM after animation
            setTimeout(() => {
                loader.remove();
            }, 500);
        }, 1200); // Match the loading bar animation duration
    });
}

/**
 * Animate numbers on scroll
 */
function initCounterAnimation() {
    const stats = document.querySelectorAll('.stat-number');

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const text = el.textContent;
                const numMatch = text.match(/(\d+)/);

                if (numMatch) {
                    const finalNum = parseInt(numMatch[1]);
                    const prefix = text.split(numMatch[0])[0];
                    const suffix = text.split(numMatch[0])[1];

                    animateNumber(el, finalNum, prefix, suffix);
                }

                observer.unobserve(el);
            }
        });
    }, observerOptions);

    stats.forEach(stat => observer.observe(stat));
}

function animateNumber(element, target, prefix, suffix) {
    const duration = 1500;
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * easeOut);

        element.textContent = prefix + current + suffix;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = prefix + target + suffix;
        }
    }

    requestAnimationFrame(update);
}

/**
 * Navigation scroll behavior
 */
function initNavigation() {
    const nav = document.getElementById('nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add/remove scrolled class
        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }, { passive: true });
}

/**
 * Mobile menu toggle
 */
function initMobileMenu() {
    const toggle = document.querySelector('.nav-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = mobileMenu.querySelectorAll('a');

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu on link click
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

/**
 * Scroll reveal animations
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll(
        '.positioning-grid, .industries-headline, .industry-card, ' +
        '.capabilities-headline, .capability-item, ' +
        '.approach-headline, .principle, ' +
        '.credibility-stat, .cta-content, ' +
        '.contact-info, .contact-form-wrapper'
    );

    // Add reveal class to elements
    revealElements.forEach(el => {
        el.classList.add('reveal');
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));

    // Stagger animation for grid items
    const staggerContainers = [
        { selector: '.industries-grid', children: '.industry-card' },
        { selector: '.capabilities-list', children: '.capability-item' },
        { selector: '.approach-principles', children: '.principle' }
    ];

    staggerContainers.forEach(({ selector, children }) => {
        const container = document.querySelector(selector);
        if (!container) return;

        const items = container.querySelectorAll(children);
        const containerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    items.forEach((item, index) => {
                        item.style.transitionDelay = `${index * 0.1}s`;
                        item.classList.add('visible');
                    });
                    containerObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        containerObserver.observe(container);
    });
}

/**
 * Contact form handling
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        // Disable button and show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        // Collect form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Simulate form submission (replace with actual endpoint)
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Show success state
            form.innerHTML = `
                <div class="form-success active">
                    <h3>Thank you!</h3>
                    <p>We've received your message and will be in touch soon.</p>
                </div>
            `;

            // Log form data (for development)
            console.log('Form submitted:', data);
        } catch (error) {
            // Handle error
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            alert('Something went wrong. Please try again or email us directly.');
        }
    });
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                const navHeight = document.getElementById('nav').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Testimonial slider
 */
function initTestimonialSlider() {
    const slider = document.getElementById('testimonial-slider');
    if (!slider) return;

    const slides = slider.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.testimonial-dot');
    let currentSlide = 0;
    let autoplayInterval;

    function goToSlide(index) {
        // Remove active from all
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        // Set new active
        currentSlide = index;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        goToSlide(next);
    }

    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }

    // Dot click handlers
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const slideIndex = parseInt(dot.dataset.slide);
            goToSlide(slideIndex);
            stopAutoplay();
            startAutoplay();
        });
    });

    // Pause on hover
    slider.addEventListener('mouseenter', stopAutoplay);
    slider.addEventListener('mouseleave', startAutoplay);

    // Start autoplay
    startAutoplay();
}

/**
 * Utility: Debounce function
 */
function debounce(func, wait = 10) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
