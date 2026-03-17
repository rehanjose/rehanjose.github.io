// Initialize Lucide icons
lucide.createIcons();

// --- PRELOADER LOGIC ---
const preloader = document.getElementById('preloader');
const mainContent = document.getElementById('main-content');
const skipButton = document.getElementById('skip-button');

const lines = [
    "I'm Rehan.",
    "It's <span style='color: #ef4444'>not</span> Rehaaaaaaaaan.",
    "It's Rehan."
];

let animationComplete = false;

function playLine(text, duration) {
    return new Promise((resolve) => {
        const el = document.createElement('div');
        el.className = 'loader-text';
        el.innerHTML = text;
        preloader.appendChild(el);

        // Animate IN
        requestAnimationFrame(() => el.classList.add('text-enter'));

        // Wait, then Animate OUT
        setTimeout(() => {
            el.classList.remove('text-enter');
            el.classList.add('text-exit');

            // Cleanup after exit animation (Matches CSS 0.5s)
            setTimeout(() => {
                el.remove();
                resolve();
            }, 500);
        }, duration);
    });
}

function finishPreloader() {
    if (animationComplete) return;
    animationComplete = true;

    // Hide skip button
    if (skipButton) {
        skipButton.style.opacity = '0';
        setTimeout(() => skipButton.remove(), 300);
    }

    // Finish preloader
    preloader.style.opacity = '0';
    setTimeout(() => preloader.remove(), 500);

    // Reveal Site
    mainContent.classList.add('visible');
    document.body.style.overflow = 'auto';
}

async function runSequence() {
    // CHANGED: Much shorter durations
    await playLine(lines[0], 600);   // Fast Intro
    await playLine(lines[1], 900);   // Just enough to read the joke
    await playLine(lines[2], 600);   // Fast confirm

    finishPreloader();
}

// Skip button handler
if (skipButton) {
    skipButton.addEventListener('click', () => {
        finishPreloader();
    });
}

// Start
runSequence();

// Clock
setInterval(() => {
    const now = new Date();
    const clock = document.getElementById('clock');
    if (clock) clock.innerText = now.toLocaleTimeString('en-US', { hour12: false });
}, 1000);

// Mobile Menu Toggle
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuClose = document.getElementById('mobile-menu-close');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

function openMobileMenu() {
    mobileMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
    // Reinitialize Lucide icons in the mobile menu
    setTimeout(() => lucide.createIcons(), 100);
}

function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    document.body.style.overflow = 'auto';
}

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', openMobileMenu);
}

if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', closeMobileMenu);
}

// Close menu when clicking on nav links
mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
        closeMobileMenu();
    });
});

// Close menu when clicking outside
mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) {
        closeMobileMenu();
    }
});

// Photo Click - Wave Emoji Animation (REMOVED)

// --- SCROLL-BASED ACTIVE SECTION HIGHLIGHTING ---
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

function updateActiveNavLink() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

    // Find which section is currently in view
    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 200; // Offset for navbar height
        const sectionHeight = section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    // If we're at the very top, highlight home
    if (scrollPosition < 100) {
        currentSection = 'home';
    }

    // Update active class on nav links
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === currentSection) {
            link.classList.add('active');
        }
    });
}

// Run on scroll with debouncing
let scrollTimeout;
window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateActiveNavLink, 10);
});

// Initial call to set the active link on page load
updateActiveNavLink();

// --- HERO SECTION SCROLL ANIMATIONS ---
const heroSection = document.querySelector('.hero-section');
const heroWelcomeLeft = document.querySelector('.hero-welcome-left');
const heroSkillsLeft = document.querySelector('.hero-skills-left');
const heroQuoteRight = document.querySelector('.hero-quote-right');
const heroNameRight = document.querySelector('.hero-name-right');
const heroImage = document.querySelector('.hero-image');

function updateHeroAnimations() {
    if (!heroSection) return;

    const scrollPosition = window.pageYOffset;
    const heroHeight = heroSection.offsetHeight;

    // Calculate progress (0 to 1) based on how much of hero section is scrolled
    // Start animating when we start scrolling, complete by the time we're halfway through hero section
    const progress = Math.min(scrollPosition / (heroHeight * 0.5), 1);

    // Calculate movement distances (in pixels)
    const moveDistance = progress * 300; // Move up to 300px
    const opacity = 1 - progress; // Fade out as we scroll

    // Left side elements - move left and fade out
    if (heroWelcomeLeft) {
        heroWelcomeLeft.style.transform = `translateX(-${moveDistance}px)`;
        heroWelcomeLeft.style.opacity = opacity;
    }

    if (heroSkillsLeft) {
        heroSkillsLeft.style.transform = `translateX(-${moveDistance}px)`;
        heroSkillsLeft.style.opacity = opacity;
    }

    // Right side elements - move right and fade out
    if (heroQuoteRight) {
        heroQuoteRight.style.transform = `translateX(${moveDistance}px)`;
        heroQuoteRight.style.opacity = opacity;
    }

    if (heroNameRight) {
        heroNameRight.style.transform = `translateX(${moveDistance}px)`;
        heroNameRight.style.opacity = opacity;
    }

    // Center image - move up and fade out
    if (heroImage) {
        const imageMove = progress * 200; // Move up by 200px
        const imageOpacity = 1 - (progress * 0.5); // Fade to 50% opacity
        heroImage.style.transform = `translateY(-${imageMove}px)`;
        heroImage.style.opacity = imageOpacity;
    }
}

// Run on scroll with requestAnimationFrame for smooth performance
let rafId = null;
window.addEventListener('scroll', () => {
    if (rafId) return;

    rafId = requestAnimationFrame(() => {
        updateHeroAnimations();
        rafId = null;
    });
});

// Initial call
updateHeroAnimations();
