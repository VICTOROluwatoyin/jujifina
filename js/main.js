/**
 * Jujifina - Main JavaScript
 * Handles all interactive elements across the website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            // Toggle menu icon between bars and times
            const icon = mobileMenuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                document.body.style.overflow = ''; // Re-enable scrolling
            }
            // Toggle aria-expanded attribute for accessibility
            const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true' || false;
            mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
        });
        
        // Close mobile menu when clicking on a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuBtn.querySelector('i').classList.remove('fa-times');
                mobileMenuBtn.querySelector('i').classList.add('fa-bars');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = ''; // Re-enable scrolling
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                navLinks.classList.remove('active');
                mobileMenuBtn.querySelector('i').classList.remove('fa-times');
                mobileMenuBtn.querySelector('i').classList.add('fa-bars');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = ''; // Re-enable scrolling
            }
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '#!') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                // Close mobile menu if open
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                    mobileMenuButton.setAttribute('aria-expanded', 'false');
                }
                
                // Calculate the position to scroll to
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                // Smooth scroll to the target
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without jumping
                history.pushState(null, null, targetId);
            }
        });
    });

    // Handle contact form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            // In a real implementation, you would send this data to a server
            console.log('Form submitted:', formObject);
            
            // Show success message
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Sending...';
            
            // Simulate API call
            setTimeout(() => {
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'mt-4 p-4 bg-green-100 text-green-700 rounded-lg';
                successMessage.innerHTML = '<p class="font-medium">Thank you for your message!</p><p>We will get back to you soon.</p>';
                
                // Insert after form
                this.parentNode.insertBefore(successMessage, this.nextSibling);
                
                // Reset form
                this.reset();
                submitButton.disabled = false;
                submitButton.textContent = originalText;
                
                // Remove success message after 5 seconds
                setTimeout(() => {
                    successMessage.style.opacity = '0';
                    setTimeout(() => {
                        successMessage.remove();
                    }, 300);
                }, 5000);
            }, 1500);
        });
    }
    
    // Handle newsletter subscription
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email && validateEmail(email)) {
                // In a real implementation, you would send this to a server
                console.log('Newsletter subscription:', email);
                
                // Show success message
                const successMessage = document.createElement('p');
                successMessage.className = 'mt-2 text-sm text-green-600';
                successMessage.textContent = 'Thank you for subscribing!';
                
                // Clear input
                emailInput.value = '';
                
                // Insert after button
                this.insertBefore(successMessage, this.lastElementChild.nextSibling);
                
                // Remove success message after 5 seconds
                setTimeout(() => {
                    successMessage.style.opacity = '0';
                    setTimeout(() => {
                        successMessage.remove();
                    }, 300);
                }, 5000);
            } else {
                // Show error message
                const errorMessage = document.createElement('p');
                errorMessage.className = 'mt-2 text-sm text-red-600';
                errorMessage.textContent = 'Please enter a valid email address.';
                
                // Remove any existing error messages
                const existingError = this.querySelector('.text-red-600');
                if (existingError) {
                    existingError.remove();
                }
                
                // Insert after input
                emailInput.parentNode.insertBefore(errorMessage, emailInput.nextSibling);
                
                // Focus the input
                emailInput.focus();
            }
        });
    }
    
    // Initialize video players
    initializeVideoPlayers();
    
    // Initialize image lightbox if it exists on the page
    if (typeof lightGallery !== 'undefined') {
        const gallery = document.querySelector('.gallery-container');
        if (gallery) {
            lightGallery(gallery, {
                selector: '.gallery-item',
                download: false,
                videojs: true,
                videojsOptions: {
                    muted: true,
                    controls: true
                },
                plugins: [lgVideo],
                speed: 500,
                mode: 'lg-fade',
                hideBarsDelay: 2000,
                showCloseIcon: true,
                closable: true,
                loop: true,
                escKey: true,
                keyPress: true
            });
        }
    }
    
    // Add animation on scroll for elements with data-aos attribute
    initializeAOS();
    
    // Handle tabbed content if it exists on the page
    initializeTabs();
    
    // Handle accordion functionality if it exists on the page
    initializeAccordions();
});

/**
 * Initialize video players with custom controls
 */
function initializeVideoPlayers() {
    document.querySelectorAll('.video-player').forEach(player => {
        const video = player.querySelector('video');
        const playButton = player.querySelector('.play-button');
        const progress = player.querySelector('.progress');
        const progressBar = player.querySelector('.progress__filled');
        const skipButtons = player.querySelectorAll('[data-skip]');
        const volumeSlider = player.querySelector('.player-slider[name="volume"]');
        const playbackRate = player.querySelector('.player-slider[name="playbackRate"]');
        const fullscreenButton = player.querySelector('.fullscreen-button');
        
        if (!video) return;
        
        // Play/Pause
        function togglePlay() {
            const method = video.paused ? 'play' : 'pause';
            video[method]();
        }
        
        function updateButton() {
            const icon = video.paused ? '▶' : '❚ ❚';
            if (playButton) playButton.textContent = icon;
        }
        
        if (playButton) {
            playButton.addEventListener('click', togglePlay);
        }
        
        video.addEventListener('click', togglePlay);
        video.addEventListener('play', updateButton);
        video.addEventListener('pause', updateButton);
        
        // Progress bar
        function handleProgress() {
            if (!progressBar) return;
            const percent = (video.currentTime / video.duration) * 100;
            progressBar.style.flexBasis = `${percent}%`;
        }
        
        function scrub(e) {
            if (!progress) return;
            const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
            video.currentTime = scrubTime;
        }
        
        if (progress) {
            let mousedown = false;
            progress.addEventListener('click', scrub);
            progress.addEventListener('mousemove', (e) => mousedown && scrub(e));
            progress.addEventListener('mousedown', () => mousedown = true);
            progress.addEventListener('mouseup', () => mousedown = false);
            video.addEventListener('timeupdate', handleProgress);
        }
        
        // Skip buttons
        if (skipButtons) {
            skipButtons.forEach(button => {
                button.addEventListener('click', function() {
                    video.currentTime += parseFloat(this.dataset.skip);
                });
            });
        }
        
        // Volume and playback rate
        if (volumeSlider) {
            volumeSlider.addEventListener('input', function() {
                video.volume = this.value;
            });
        }
        
        if (playbackRate) {
            playbackRate.addEventListener('input', function() {
                video.playbackRate = this.value;
            });
        }
        
        // Fullscreen
        if (fullscreenButton) {
            fullscreenButton.addEventListener('click', function() {
                if (video.requestFullscreen) {
                    video.requestFullscreen();
                } else if (video.mozRequestFullScreen) { /* Firefox */
                    video.mozRequestFullScreen();
                } else if (video.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
                    video.webkitRequestFullscreen();
                } else if (video.msRequestFullscreen) { /* IE/Edge */
                    video.msRequestFullscreen();
                }
            });
        }
    });
}

/**
 * Initialize Animate On Scroll (AOS) if included
 */
function initializeAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100,
            delay: 100
        });
    }
}

/**
 * Initialize tabbed content
 */
function initializeTabs() {
    const tabContainers = document.querySelectorAll('.tabs-container');
    
    tabContainers.forEach(container => {
        const tabs = container.querySelectorAll('[role="tab"]');
        const tabPanels = container.querySelectorAll('[role="tabpanel"]');
        
        if (tabs.length === 0 || tabPanels.length === 0) return;
        
        // Set up click event handlers for tabs
        tabs.forEach(tab => {
            tab.addEventListener('click', e => {
                e.preventDefault();
                
                // Hide all tab panels
                tabPanels.forEach(panel => {
                    panel.classList.add('hidden');
                });
                
                // Deactivate all tabs
                tabs.forEach(t => {
                    t.setAttribute('aria-selected', 'false');
                    t.classList.remove('active');
                });
                
                // Activate the clicked tab
                tab.setAttribute('aria-selected', 'true');
                tab.classList.add('active');
                
                // Show the corresponding panel
                const panelId = tab.getAttribute('aria-controls');
                const panel = document.getElementById(panelId);
                if (panel) {
                    panel.classList.remove('hidden');
                    
                    // Trigger a custom event in case other scripts need to know about the tab change
                    const event = new CustomEvent('tabChanged', {
                        detail: {
                            tabId: tab.id,
                            panelId: panelId
                        }
                    });
                    container.dispatchEvent(event);
                }
            });
        });
        
        // Activate the first tab by default
        if (tabs.length > 0) {
            tabs[0].click();
        }
    });
}

/**
 * Initialize accordion functionality
 */
function initializeAccordions() {
    const accordions = document.querySelectorAll('.accordion');
    
    accordions.forEach(accordion => {
        const button = accordion.querySelector('.accordion-button');
        const content = accordion.querySelector('.accordion-content');
        
        if (!button || !content) return;
        
        // Set initial state
        const isExpanded = button.getAttribute('aria-expanded') === 'true' || false;
        content.style.display = isExpanded ? 'block' : 'none';
        
        // Toggle accordion on button click
        button.addEventListener('click', () => {
            const isExpanded = button.getAttribute('aria-expanded') === 'true' || false;
            
            // Toggle the expanded state
            button.setAttribute('aria-expanded', !isExpanded);
            
            // Toggle the content visibility with animation
            if (isExpanded) {
                // Collapse
                content.style.overflow = 'hidden';
                content.style.height = `${content.scrollHeight}px`;
                
                // Trigger reflow
                content.offsetHeight;
                
                content.style.height = '0';
                content.style.opacity = '0';
                
                // After animation completes, set display to none
                setTimeout(() => {
                    content.style.display = 'none';
                    content.style.overflow = '';
                }, 300);
            } else {
                // Expand
                content.style.display = 'block';
                const contentHeight = content.scrollHeight;
                
                content.style.height = '0';
                content.style.opacity = '0';
                content.style.overflow = 'hidden';
                
                // Trigger reflow
                content.offsetHeight;
                
                content.style.height = `${contentHeight}px`;
                content.style.opacity = '1';
                
                // After animation completes, set height to auto
                setTimeout(() => {
                    content.style.height = '';
                    content.style.overflow = '';
                }, 300);
            }
        });
    });
}

/**
 * Validate email format
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

/**
 * Debounce function to limit the rate at which a function can fire
 */
function debounce(func, wait = 20, immediate = true) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

/**
 * Throttle function to limit the rate at which a function can fire
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Handle page transitions
function handlePageTransition(event) {
    // Only handle same-origin navigation
    if (this.hostname !== window.location.hostname) return;
    
    // Don't handle if it's a hash link on the same page
    if (this.hash && this.pathname === window.location.pathname) return;
    
    // Don't handle if it's a target="_blank" link
    if (this.target === '_blank') return;
    
    // Don't handle if it's a download link
    if (this.hasAttribute('download')) return;
    
    event.preventDefault();
    
    // Add loading class to body
    document.body.classList.add('page-transition');
    
    // Wait for the transition to complete
    setTimeout(() => {
        window.location.href = this.href;
    }, 300);
}

// Add smooth page transitions to all internal links
document.addEventListener('click', function(e) {
    // Find the closest anchor element
    let target = e.target;
    while (target && target.nodeName !== 'A') {
        target = target.parentNode;
        if (target === document.body) return;
    }
    
    if (target && target.nodeName === 'A') {
        handlePageTransition.call(target, e);
    }
});

// Handle back/forward navigation
window.addEventListener('pageshow', function(event) {
    // Remove the transition class when the page is shown (including from bfcache)
    document.body.classList.remove('page-transition');
    
    // Re-initialize components that might need it after navigation
    initializeVideoPlayers();
    initializeAOS();
    initializeTabs();
    initializeAccordions();
});

// Make functions available globally if needed
window.jujifina = {
    initializeVideoPlayers,
    initializeAOS,
    initializeTabs,
    initializeAccordions,
    validateEmail,
    debounce,
    throttle
};
