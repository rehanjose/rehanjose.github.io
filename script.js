// --- THEME TOGGLE (init before anything else to avoid FOUC) ---
(function () {
    const saved = localStorage.getItem('portfolio-theme');
    if (saved === 'light') document.documentElement.setAttribute('data-theme', 'light');
})();

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

// --- THEME TOGGLE ---
const themeToggle = document.getElementById('theme-toggle');

function applyTheme(theme) {
    if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('portfolio-theme', theme);
    // Re-init Lucide so icon strokes get the right color
    lucide.createIcons();
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        applyTheme(isLight ? 'dark' : 'light');
    });
}

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

// --- CATEGORY DROPDOWN & PROJECT FILTERING ---
const categoryDropdown = document.getElementById('category-select');
const projectCards = document.querySelectorAll('.project-card');

// Function to filter projects by category
function filterProjects(selectedCategory) {
    // Filter and show/hide projects with smooth transition
    projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');

        if (cardCategory === selectedCategory) {
            // Show matching projects
            card.classList.remove('hidden');
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';

            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 50);
        } else {
            // Hide non-matching projects
            card.style.opacity = '0';
            card.style.transform = 'translateY(-20px)';

            setTimeout(() => {
                card.classList.add('hidden');
            }, 400);
        }
    });
}

// Add change handler to dropdown
if (categoryDropdown) {
    categoryDropdown.addEventListener('change', (e) => {
        const category = e.target.value;
        filterProjects(category);
    });

    // Initialize with first category (product-design)
    filterProjects('product-design');
}

// --- ABOUT SECTION SCROLL ANIMATION & PROJECTS TRANSITION ---
const aboutSection = document.getElementById('about');
const aboutContainer = document.querySelector('.about-container');
const aboutText = document.getElementById('about-text');
const aboutLink = document.getElementById('about-link');
const projectsTitle = document.querySelector('.projects-title');

// Pre-define random scattering values for consistent animation
const letterPhysics = [];

if (aboutText && aboutSection && aboutContainer) {
    // 1. Split text into individual letters wrapped in spans, grouped by word
    const textContent = aboutText.innerText;
    const words = textContent.trim().split(/\s+/);

    aboutText.innerHTML = '';
    words.forEach((word) => {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'about-word';

        for (let i = 0; i < word.length; i++) {
            const letterSpan = document.createElement('span');
            letterSpan.className = 'about-letter';
            letterSpan.innerHTML = word[i];
            wordSpan.appendChild(letterSpan);

            // Generate random physics for the "pop out / scramble" effect
            letterPhysics.push({
                x: (Math.random() - 0.5) * 200, // random X spread (-100vw to 100vw later)
                y: (Math.random() - 0.5) * 200, // random Y spread
                z: Math.random() * 500 + 100,   // random Z depth
                rotateX: (Math.random() - 0.5) * 720,
                rotateY: (Math.random() - 0.5) * 720,
                rotateZ: (Math.random() - 0.5) * 720,
                scale: Math.random() * 3 + 1
            });
        }

        aboutText.appendChild(wordSpan);
        aboutText.appendChild(document.createTextNode(' '));
    });

    const letterElements = document.querySelectorAll('.about-letter');

    // 2. Scroll listener for highlighting, scrambling, & projects transition
    function updateAboutAnimation() {
        if (!aboutSection || !aboutContainer) return;

        const scrollPosition = window.pageYOffset;
        const sectionTop = aboutSection.offsetTop;
        const sectionHeight = aboutSection.offsetHeight;
        const viewportHeight = window.innerHeight;

        // If we're past the about section, maintain the hidden scrambled state
        if (scrollPosition > sectionTop + sectionHeight) {
            aboutContainer.style.opacity = 0;
            aboutContainer.style.pointerEvents = 'none';
        }

        // Only run animation math if we are near or in the about section
        if (scrollPosition > sectionTop - viewportHeight && scrollPosition <= sectionTop + sectionHeight) {

            const stickyScrollDistance = sectionHeight - viewportHeight;
            let progress = 0;

            if (stickyScrollDistance > 0) {
                progress = (scrollPosition - sectionTop) / stickyScrollDistance;
            } else {
                progress = 1;
            }

            progress = Math.max(0, Math.min(1, progress));

            // Phase 1: Reading (0% to 70%)
            const readingProgress = Math.min(1, progress / 0.7);
            const lettersToHighlight = Math.ceil(readingProgress * letterElements.length);

            // Phase 2: Scramble & Pop Out (70% to 100%)
            const scrambleProgress = Math.max(0, (progress - 0.7) / 0.3); // 0 to 1

            // Reveal link right before scrambling starts
            if (aboutLink) {
                if (readingProgress > 0.9 && scrambleProgress < 0.2) {
                    aboutLink.classList.add('visible');
                } else {
                    aboutLink.classList.remove('visible');
                }
            }

            // Ease the scramble progress using cubic-bezier like curve for explosive start
            const easedScramble = scrambleProgress === 0 ? 0 : 1 - Math.pow(1 - scrambleProgress, 3);

            // Apply transforms to each letter
            letterElements.forEach((letter, index) => {
                // Highlighting Logic
                if (index < lettersToHighlight && scrambleProgress === 0) {
                    letter.classList.add('highlighted');
                } else {
                    letter.classList.remove('highlighted');
                }

                // Scrambling Logic
                if (scrambleProgress > 0) {
                    const physics = letterPhysics[index];

                    // Multiply physics by eased scramble progress
                    const tx = physics.x * easedScramble;
                    const ty = physics.y * easedScramble;
                    const tz = physics.z * easedScramble;
                    const rx = physics.rotateX * easedScramble;
                    const ry = physics.rotateY * easedScramble;
                    const rz = physics.rotateZ * easedScramble;

                    // Maintain highlighted color during scramble
                    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
                    letter.style.color = isLight ? 'rgba(17,17,17,1)' : 'rgba(255,255,255,1)';
                    letter.style.textShadow = `0 0 15px var(--highlight-glow)`;

                    // Apply huge 3D transform
                    letter.style.transform = `
                        translate3d(${tx}vw, ${ty}vh, ${tz}px) 
                        rotateX(${rx}deg) 
                        rotateY(${ry}deg) 
                        rotateZ(${rz}deg)
                    `;
                } else {
                    // Reset to normal
                    letter.style.transform = 'translateZ(0)';
                    letter.style.color = '';
                    letter.style.textShadow = '';
                }
            });

            // Fade out the whole container near the end of the scramble
            if (scrambleProgress > 0.6) {
                const fadeOut = 1 - ((scrambleProgress - 0.6) / 0.4);
                aboutContainer.style.opacity = fadeOut;
                aboutContainer.style.pointerEvents = 'none';
            } else {
                aboutContainer.style.opacity = 1;
                aboutContainer.style.pointerEvents = 'auto';
            }
        }

        // --- PROJECTS TITLE FORMING LOGIC ---
        // As the About letters scatter into nothingness, the Projects 
        // title letters fly IN from the scatter to form the word "PROJECTS"
        if (projectsTitle) {
            const projectsTop = document.getElementById('projects').offsetTop;

            // Calculate progress specifically for when Projects title enters viewport
            const titleEnterProgress = (scrollPosition + viewportHeight - projectsTop) / (viewportHeight * 0.5);
            const clampedTitleProgress = Math.max(0, Math.min(1, titleEnterProgress));

            // If the title hasn't been split into letters yet, do it now
            if (!projectsTitle.hasAttribute('data-split')) {
                const titleText = projectsTitle.innerText;
                projectsTitle.innerHTML = '';
                for (let i = 0; i < titleText.length; i++) {
                    const span = document.createElement('span');
                    span.innerHTML = titleText[i];
                    span.style.display = 'inline-block';
                    span.style.willChange = 'transform, opacity, filter';

                    // Assign random coming-in coordinates matching the scatter effect
                    span.setAttribute('data-ix', (Math.random() - 0.5) * 100);
                    span.setAttribute('data-iy', (Math.random() - 0.5) * 100 - 50); // coming from slightly above
                    span.setAttribute('data-irz', (Math.random() - 0.5) * 360);

                    projectsTitle.appendChild(span);
                }
                projectsTitle.setAttribute('data-split', 'true');
            }

            // Animate title letters forming
            const titleLetters = projectsTitle.querySelectorAll('span');
            titleLetters.forEach((letter) => {
                // Ease out back for a snapping effect into place
                const easeOutBack = (x) => {
                    const c1 = 1.70158;
                    const c3 = c1 + 1;
                    return 1 + c3 * Math.pow(clampedTitleProgress - 1, 3) + c1 * Math.pow(clampedTitleProgress - 1, 2);
                };

                const eased = clampedTitleProgress === 1 ? 1 : easeOutBack(clampedTitleProgress);
                const invProgress = 1 - eased;

                const startX = parseFloat(letter.getAttribute('data-ix'));
                const startY = parseFloat(letter.getAttribute('data-iy'));
                const startRz = parseFloat(letter.getAttribute('data-irz'));

                letter.style.transform = `
                    translate3d(${startX * invProgress}vw, ${startY * invProgress}vh, ${200 * invProgress}px)
                    rotateZ(${startRz * invProgress}deg)
                    scale(${1 + invProgress * 2})
                `;

                letter.style.opacity = clampedTitleProgress;
                letter.style.filter = `blur(${invProgress * 10}px)`;
            });
        }
    }

    // Add to scroll listener
    window.addEventListener('scroll', () => {
        requestAnimationFrame(updateAboutAnimation);
    });

    // Initial call
    updateAboutAnimation();
}

