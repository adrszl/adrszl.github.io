import { certificatesData } from './certifications.js';
import { portfolioData } from './portfolioData.js';

// Scroll to section function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    const header = document.getElementById('header');
    if (section) {
        const headerHeight = header.offsetHeight;
        const targetPosition = section.offsetTop - headerHeight;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Open link function
function openProjectLink(link) {
    window.open(link);
}

// Initialize particles for sections
function initParticles() {
    const particlesContainers = document.querySelectorAll('.particles');
    const particleCount = 60;

    particlesContainers.forEach(particlesContainer => {

        // prevent duplicates if function runs multiple times
        if (particlesContainer.classList.contains('particles-initialized')) return;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';

            // Random horizontal position
            particle.style.left = Math.random() * 100 + '%';

            // Start particles at random vertical positions throughout the section
            particle.style.top = Math.random() * 100 + '%';

            // Random animation delay for natural movement
            particle.style.animationDelay = Math.random() * 20 + 's';

            // Random animation duration for variety
            particle.style.animationDuration = (18 + Math.random() * 8) + 's';

            particlesContainer.appendChild(particle);
        }

        particlesContainer.classList.add('particles-initialized');
    });
}

// Initialize carousel
let currentIndex = 0;
const carousel = document.getElementById('carousel');
const indicatorsContainer = document.getElementById('indicators');

function initCarousel() {
    // Create carousel items
    portfolioData.forEach((data, index) => {
        const item = createCarouselItem(data, index);
        carousel.appendChild(item);

        // Create indicator
        const indicator = document.createElement('div');
        indicator.className = 'indicator';
        if (index === 0) indicator.classList.add('active');
        indicator.dataset.index = index;
        indicator.addEventListener('click', () => goToSlide(index));
        indicatorsContainer.appendChild(indicator);
    });

    updateCarousel();
}

function createCarouselItem(data, index) {
    const item = document.createElement('div');

    item.className = 'carousel-item';
    item.dataset.index = index;

    const techBadges = data.tech.map(tech =>
        `<span class="tech-badge">${tech}</span>`
    ).join('');

    item.innerHTML = `
        <div class="card">
            <div class="card-number">0${data.id}</div>
            <div class="card-image">
                <img src="${data.image}" alt="${data.title}">
            </div>
            <h3 class="card-title">${data.title}</h3>
            <p class="card-description">${data.description}</p>
            <div class="card-tech">${techBadges}</div>
            <button class="card-cta">
                ${data.projectLink === '404' ? 'Explore' : 'Check'}
            </button>
        </div>
    `;

    const button = item.querySelector('.card-cta');

    if (data.projectLink === '404') {
        button.addEventListener('click', () => {
            scrollToSection('about');
        });
    } else {
        button.addEventListener('click', () => {
            openProjectLink(data.projectLink);
        });
    }

    return item;
}

function updateCarousel() {
    const items = document.querySelectorAll('.carousel-item');
    const indicators = document.querySelectorAll('.indicator');
    const totalItems = items.length;
    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth <= 1024;

    items.forEach((item, index) => {
        // Calculate relative position
        let offset = index - currentIndex;

        // Wrap around for continuous rotation
        if (offset > totalItems / 2) {
            offset -= totalItems;
        } else if (offset < -totalItems / 2) {
            offset += totalItems;
        }

        const absOffset = Math.abs(offset);
        const sign = offset < 0 ? -1 : 1;

        // Reset transform
        item.style.transform = '';
        item.style.opacity = '';
        item.style.zIndex = '';
        item.style.transition = 'all 0.8s cubic-bezier(0.4, 0.0, 0.2, 1)';

        // Adjust spacing based on screen size
        let spacing1 = 400;
        let spacing2 = 600;
        let spacing3 = 750;

        if (isMobile) {
            spacing1 = 280;  // Was 400, now 100px closer
            spacing2 = 420;  // Was 600, now 180px closer
            spacing3 = 550;  // Was 750, now 200px closer
        } else if (isTablet) {
            spacing1 = 340;
            spacing2 = 520;
            spacing3 = 650;
        }

        if (absOffset === 0) {
            // Center item
            item.style.transform = 'translate(-50%, -50%) translateZ(0) scale(1)';
            item.style.opacity = '1';
            item.style.zIndex = '10';
        } else if (absOffset === 1) {
            // Side items
            const translateX = sign * spacing1;
            const rotation = isMobile ? 25 : 30;
            const scale = isMobile ? 0.88 : 0.85;
            item.style.transform = `translate(-50%, -50%) translateX(${translateX}px) translateZ(-200px) rotateY(${-sign * rotation}deg) scale(${scale})`;
            item.style.opacity = '0.8';
            item.style.zIndex = '5';
        } else if (absOffset === 2) {
            // Further side items
            const translateX = sign * spacing2;
            const rotation = isMobile ? 35 : 40;
            const scale = isMobile ? 0.75 : 0.7;
            item.style.transform = `translate(-50%, -50%) translateX(${translateX}px) translateZ(-350px) rotateY(${-sign * rotation}deg) scale(${scale})`;
            item.style.opacity = '0.5';
            item.style.zIndex = '3';
        } else if (absOffset === 3) {
            // Even further items
            const translateX = sign * spacing3;
            const rotation = isMobile ? 40 : 45;
            const scale = isMobile ? 0.65 : 0.6;
            item.style.transform = `translate(-50%, -50%) translateX(${translateX}px) translateZ(-450px) rotateY(${-sign * rotation}deg) scale(${scale})`;
            item.style.opacity = '0.3';
            item.style.zIndex = '2';
        } else {
            // Hidden items (behind)
            item.style.transform = 'translate(-50%, -50%) translateZ(-500px) scale(0.5)';
            item.style.opacity = '0';
            item.style.zIndex = '1';
        }
    });

    // Update indicators
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentIndex);
    });
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % portfolioData.length;
    updateCarousel();
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + portfolioData.length) % portfolioData.length;
    updateCarousel();
}

function goToSlide(index) {
    currentIndex = index;
    updateCarousel();
}

// Event listeners
document.getElementById('nextBtn').addEventListener('click', () => {
    clearInterval(slideInterval);
    nextSlide();
});

document.getElementById('prevBtn').addEventListener('click', () => {
    clearInterval(slideInterval);
    prevSlide();
});

// Auto-rotate carousel
let slideInterval;

function startCarousel() {
    slideInterval = setInterval(nextSlide, 5000);
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
});

// Update carousel on window resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        updateCarousel();
    }, 250);
});

// swiping navigation
function initCarouselSwipe() {
    const slider = document.getElementById('carousel');

    let startX = 0;
    let endX = 0;

    slider.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    slider.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    });

    function handleSwipe() {
        const diff = startX - endX;

        if (Math.abs(diff) < 50) return;

        clearInterval(slideInterval);

        if (diff > 0) {
            nextSlide();
        } else {
            prevSlide();
        }
    }
}

// Initialize hexagonal skills grid
function initSkillsGrid() {
    const skillsGrid = document.getElementById('skillsGrid');
    const categoryTabs = document.querySelectorAll('.category-tab');
    const skillsData = certificatesData;

    function displaySkills(category = 'none') {
        skillsGrid.innerHTML = '';

        if (category === 'none') return; // clear the grid if nothing is chosen

        const filteredSkills = category === 'all'
            ? skillsData
            : skillsData.filter(cert => {
                const desc = cert.description.toLowerCase();
                return desc.includes(category.toLowerCase());
            });

        filteredSkills.forEach((cert, index) => {
            const hexagon = document.createElement('div');
            hexagon.className = 'skill-hexagon';
            hexagon.style.animationDelay = `${index * 0.1}s`;

            hexagon.innerHTML = `
                <div class="hexagon-inner">
                    <div class="hexagon-content">
                        <div class="skill-icon-hex">📜</div>
                        <div class="skill-name-hex">${cert.title}</div>
                        <div class="skill-percentage-hex">${cert.date}</div>
                    </div>
                </div>
            `;

            skillsGrid.appendChild(hexagon);
        });
    }

    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // toggle tab
            if (tab.classList.contains('active')) {
                tab.classList.remove('active');
                displaySkills('none'); // wyczyść grid
            } else {
                // remove active from other tabs
                categoryTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                displaySkills(tab.dataset.category);
            }
        });
    });

    displaySkills('none'); // na starcie grid jest pusty
}

// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

// Header scroll effect
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Smooth scrolling and active navigation
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
            const headerHeight = header.offsetHeight;
            const targetPosition = targetSection.offsetTop - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    });
});

// Update active navigation on scroll
function updateActiveNav() {
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href').substring(1);
                if (href === sectionId) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// Animated counter for stats
function animateCounter(element) {
    const target = parseInt(element.dataset.target);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const counter = setInterval(() => {
        current += step;
        if (current >= target) {
            element.textContent = target;
            clearInterval(counter);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Intersection Observer for stats animation
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(number => {
                if (!number.classList.contains('animated')) {
                    number.classList.add('animated');
                    animateCounter(number);
                }
            });
        }
    });
}, observerOptions);

const statsSection = document.querySelector('.stats-section');
if (statsSection) {
    observer.observe(statsSection);
}

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.hero');

    if (parallax) {
        parallax.style.transform = `translateY(${scrolled * 0.7}px)`;
    }
});

// insert current year
function insertCurrentYear() {
    document.querySelectorAll('.current-year').forEach(element => {
        element.textContent = new Date().getFullYear();
    })
}

// hide rest of the cards and show them when 'see more' is clicked
function toggleCertificationVisibility() {
    const certificates = document.querySelectorAll('.certificate');
    const showMoreButton = document.querySelector('.see-more-button');
    let expanded = false;

    certificates.forEach((item, index) => {
        if (index >= 9) {
            item.classList.add('hidden', 'fade-out');
        }
    });

    showMoreButton.addEventListener('click', () => {
        expanded = !expanded;

        certificates.forEach((item, index) => {
            if (index >= 9) {
                if (expanded) {
                    item.classList.remove('hidden');
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            item.classList.remove('fade-out');
                        });
                    });

                } else {
                    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    item.classList.add('fade-out');

                    item.addEventListener('transitionend', () => {
                        item.classList.add('hidden');
                        item.style.transition = '';
                    }, { once: true });
                }
            }
        });

        showMoreButton.textContent = expanded ? 'Hide' : 'See more';

        if (!expanded) {
            const lastVisible = certificates[Math.min(8, certificates.length - 1)];
            lastVisible.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    });
}

// function to animate count
function animateCount(el, target, duration = 1200) {
    let start = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const progress = Math.min((currentTime - startTime) / duration, 1);

        const easeOut = 1 - Math.pow(1 - progress, 3);

        const value = Math.floor(easeOut * target);
        el.textContent = value;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            el.textContent = target;
        }
    }

    requestAnimationFrame(update);
}

// observer for count effect
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');

    counters.forEach(el => {
        const target = parseInt(el.dataset.target, 10);

        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;

        if (isVisible) {
            animateCount(el, target);
            return;
        }

        const observer = new IntersectionObserver((entries, obs) => {
            if (entries[0].isIntersecting) {
                animateCount(el, target);
                obs.disconnect();
            }
        }, { threshold: 0 });

        observer.observe(el);
    });
}

// function to calculate certificates
function generateStatCards() {
    const certificates = document.querySelectorAll('.certificate');
    const totalCertificates = certificates.length;

    const tabs = document.querySelectorAll('.category-tab');
    const keywords = Array.from(tabs)
        .map(tab => tab.dataset.category)
        .filter(cat => cat !== 'all');

    const mapping = {
        javascript: { icon: '🟨', label: 'JavaScript' },
        react: { icon: '⚛️', label: 'React' },
        redux: { icon: '🌀', label: 'Redux' },
        typescript: { icon: '🟦', label: 'TypeScript' },
        jquery: { icon: '💧', label: 'jQuery' },
        html: { icon: '📄', label: 'HTML' },
        css: { icon: '🎨', label: 'CSS' },
        flexbox: { icon: '📐', label: 'Flexbox' },
        bootstrap: { icon: '🅱️', label: 'Bootstrap' },
        sass: { icon: '💅', label: 'SASS' },
        npm: { icon: '📦', label: 'NPM' },
        webpack: { icon: '📦', label: 'Webpack' },
        wordpress: { icon: '📝', label: 'WordPress' },
        other: { icon: '✨', label: 'Other' }
    };

    const statsContainer = document.querySelector('#stats-grid');
    statsContainer.innerHTML = '';

    keywords.forEach(keyword => {
        let count = 0;

        certificates.forEach(cert => {
            const description = cert.querySelector('.certificate-description')?.textContent || '';
            if (description.toLowerCase().includes(keyword.toLowerCase())) {
                count++;
            }
        });

        const percentage = ((count / totalCertificates) * 100).toFixed(1);
        const { icon, label } = mapping[keyword] || { icon: '❓', label: keyword };

        const cardHTML = `
            <div class="stat-card">
                <div class="stat-icon">${icon}</div>
                <div class="stat-number" data-target="${count}">0</div>
                <div class="stat-label">${label}</div>
                <p class="stat-description">${percentage}% of all certificates</p>
            </div>
        `;

        statsContainer.insertAdjacentHTML('beforeend', cardHTML);
    });

    requestAnimationFrame(initCounters);
}

// function to generate all of the certificates
function generateCertificates() {
    const container = document.querySelector('#certifications');

    container.insertAdjacentHTML(
        'afterbegin',
        certificatesData.map(cert => `
        <div class="certificate">
            <h3 class="certificate-title">${cert.title}</h3>
            <h4>${cert.date}</h4>
            <p class="certificate-description">
                ${cert.description}
            </p>
            ${cert.link ? `
                <a href="${cert.link}" 
                   class="certificate-link" 
                   target="_blank">
                   Show certificate
                </a>
            ` : ''}
        </div>
    `).join('')
    );
}

// Loading screen
window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        loader.classList.add('hidden');

        // Initialize on load
        initCarousel();
        startCarousel();
        initCarouselSwipe();
        initSkillsGrid();
        initParticles();
        generateCertificates();
        insertCurrentYear();
        generateStatCards();
        toggleCertificationVisibility();
    }, 1500);
});