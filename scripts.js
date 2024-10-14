"use strict";

// Smooth scrolling for internal links
function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
        window.scrollTo({
            top: element.offsetTop - 70,
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
}

if (hamburgerMenu) {
    hamburgerMenu.addEventListener('click', toggleSidebar);
}

if (overlay) {
    overlay.addEventListener('click', toggleSidebar);
}

// Modal Functionality
function openModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

// Close modal when clicking outside of it
window.onclick = function (event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        closeModal();
    }
};

// Contact Form Submission
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.getElementById('contact-name').value;
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
    }
}

// Load Recommended Articles
function loadRecommendedArticles() {
    let preferences = JSON.parse(localStorage.getItem('preferences')) || [];
    const recommendationsContainer = document.getElementById('recommended-articles');

    if (recommendationsContainer && preferences.length > 0) {
        fetchArticlesByIds(preferences).then(articles => {
            articles.forEach(article => {
                const articleItem = document.createElement('div');
                articleItem.classList.add('article-grid-item');

                articleItem.innerHTML = `
                    <img src="${article.image}" alt="${article.title}">
                    <div class="article-content">
                        <h3>${article.title}</h3>
                        <p>${article.description}</p>
                        <a href="#" class="btn-secondary">Read More</a>
                    </div>
                `;

                recommendationsContainer.appendChild(articleItem);
            });
        });
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
            }
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
    const query = searchBar ? searchBar.value : '';
    alert(`You searched for: ${query}`);
    // Implement actual search functionality here
}
