"use strict";

// Theme Toggle Functionality
const themeToggleBtn = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

function toggleTheme() {
    if (htmlElement.getAttribute('data-theme') === 'dark') {
        htmlElement.setAttribute('data-theme', 'light');
        themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        htmlElement.setAttribute('data-theme', 'dark');
        themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
    }
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
}

// Smooth scrolling for internal links
function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
        const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - 70;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Sticky Header
window.addEventListener('scroll', function () {
    const header = document.getElementById('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Hamburger Menu Toggle
const hamburgerMenu = document.getElementById('hamburger-menu');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebar-overlay');

function toggleSidebar() {
    hamburgerMenu.classList.toggle('active');
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');

    // Update aria-expanded attribute for accessibility
    const expanded = hamburgerMenu.getAttribute('aria-expanded') === 'true' || false;
    hamburgerMenu.setAttribute('aria-expanded', !expanded);

    // Update aria-hidden for sidebar
    const isHidden = sidebar.getAttribute('aria-hidden') === 'true';
    sidebar.setAttribute('aria-hidden', !isHidden);
}

if (hamburgerMenu) {
    hamburgerMenu.addEventListener('click', toggleSidebar);
    hamburgerMenu.addEventListener('keypress', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleSidebar();
        }
    });
}

if (overlay) {
    overlay.addEventListener('click', toggleSidebar);
}

// Modal Functionality
function openModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    // Focus the first input
    const firstInput = modal.querySelector('input, textarea');
    if (firstInput) firstInput.focus();
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto'; // Restore background scrolling
}

const closeButton = document.querySelector('.close-button');
if (closeButton) {
    closeButton.addEventListener('click', closeModal);
}

// Close modal when pressing Esc key
window.addEventListener('keydown', function (e) {
    const modal = document.getElementById('modal');
    if (e.key === 'Escape' && modal.style.display === 'block') {
        closeModal();
    }
});

// Close modal when clicking outside of it
window.onclick = function (event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        closeModal();
    }
};

// Contact Form Submission with Validation
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.getElementById('contact-name').value.trim();
        const email = document.getElementById('contact-email').value.trim();
        const message = document.getElementById('contact-message').value.trim();

        if (name === '' || email === '' || message === '') {
            alert('Please fill in all fields.');
            return;
        }

        // Basic email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        // Simulate form submission
        alert(`Thank you for your message, ${name}! We'll get back to you soon.`);
        contactForm.reset();
        closeModal();
    });
}

// Carousel Functionality
document.addEventListener('DOMContentLoaded', function () {
    const slides = document.querySelectorAll('.carousel-slide');
    const nextButton = document.querySelector('.carousel-nav.next');
    const prevButton = document.querySelector('.carousel-nav.prev');
    let currentIndex = 0;

    function updateCarousel() {
        slides.forEach((slide, index) => {
            slide.classList.remove('active', 'next', 'prev');
            if (index === currentIndex) {
                slide.classList.add('active');
            } else if (index === (currentIndex + 1) % slides.length) {
                slide.classList.add('next');
            } else if (index === (currentIndex - 1 + slides.length) % slides.length) {
                slide.classList.add('prev');
            }
        });
    }

    if (nextButton && prevButton) {
        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        });

        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        });
    }

    // Gesture Support using Hammer.js
    const carousel = document.querySelector('.carousel-3d');
    if (carousel) {
        const hammer = new Hammer(carousel);

        hammer.on('swipeleft', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        });

        hammer.on('swiperight', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        });
    }

    updateCarousel();
});

// Save User Preferences
function savePreference(articleId) {
    let preferences = JSON.parse(localStorage.getItem('preferences')) || [];
    if (!preferences.includes(articleId)) {
        preferences.push(articleId);
        localStorage.setItem('preferences', JSON.stringify(preferences));
        alert('Article added to your recommendations!');
    } else {
        alert('Article already in your recommendations.');
    }
}

// Load Recommended Articles
function loadRecommendedArticles() {
    let preferences = JSON.parse(localStorage.getItem('preferences')) || [];
    const recommendationsContainer = document.getElementById('recommended-articles');

    if (recommendationsContainer && preferences.length > 0) {
        fetchArticlesByIds(preferences).then(articles => {
            recommendationsContainer.innerHTML = ''; // Clear existing content
            articles.forEach(article => {
                const articleItem = document.createElement('div');
                articleItem.classList.add('article-grid-item');

                articleItem.innerHTML = `
                    <img src="${article.image}" alt="${article.title}">
                    <div class="article-content">
                        <h3>${article.title}</h3>
                        <p>${article.description}</p>
                        <a href="#" class="btn-secondary" aria-label="Read More about ${article.title}">Read More <i class="fas fa-arrow-right"></i></a>
                    </div>
                `;

                recommendationsContainer.appendChild(articleItem);
            });
        });
    } else {
        recommendationsContainer.innerHTML = '<p>No recommendations yet. Explore articles and save your favorites!</p>';
    }
}

// Mock function to simulate fetching articles by IDs
function fetchArticlesByIds(ids) {
    return new Promise(resolve => {
        // Mock articles data
        const allArticles = [
            {
                id: 'article1',
                title: 'Electric Revolution',
                description: 'How electric vehicles are reshaping the automotive landscape.',
                image: 'https://via.placeholder.com/300x200'
            },
            {
                id: 'article2',
                title: 'Autonomous Driving',
                description: 'The journey towards fully self-driving cars.',
                image: 'https://via.placeholder.com/300x200'
            },
            {
                id: 'article3',
                title: 'Sustainable Materials',
                description: 'Exploring eco-friendly materials in modern car manufacturing.',
                image: 'https://via.placeholder.com/300x200'
            },
            // Add more articles as needed
        ];

        const articles = allArticles.filter(article => ids.includes(article.id));
        resolve(articles);
    });
}

// Load recommendations on page load
window.addEventListener('load', loadRecommendedArticles);

// Debounced Search Functionality
let searchTimeout;
function debouncedSearch() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(executeSearch, 300);
}

function executeSearch() {
    const searchBar = document.getElementById('search-bar') || document.getElementById('sidebar-search-bar');
    const query = searchBar ? searchBar.value.trim() : '';
    const searchResults = document.getElementById('search-results');

    if (query === '') {
        searchResults.innerHTML = '';
        return;
    }

    // Simulate search results
    searchResults.innerHTML = `<p>Searching for "<strong>${query}</strong>"...</p>`;

    // Replace with actual search functionality
    setTimeout(() => {
        searchResults.innerHTML = `
            <h3>Search Results for "${query}":</h3>
            <ul>
                <li><a href="#blog">Sample Blog Post 1</a></li>
                <li><a href="#reviews">Sample Review 1</a></li>
                <li><a href="#articles">Sample Article 1</a></li>
            </ul>
        `;
    }, 500);
}

// Accessibility: Trap focus within modal when open
const modal = document.getElementById('modal');
if (modal) {
    modal.addEventListener('keydown', function (e) {
        const focusableElements = modal.querySelectorAll('a[href], button, textarea, input, select');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.key === 'Tab') {
            if (e.shiftKey) { // Shift + Tab
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else { // Tab
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    });
}
