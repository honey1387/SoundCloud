document.addEventListener('DOMContentLoaded', function() {
    // Slider
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        currentSlide = index;
    }

    function nextSlide() {
        showSlide((currentSlide + 1) % slides.length);
    }

    function prevSlide() {
        showSlide((currentSlide - 1 + slides.length) % slides.length);
    }

    function startAutoSlide() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoSlide() {
        clearInterval(slideInterval);
    }

    // Slider events
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); stopAutoSlide(); startAutoSlide(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); stopAutoSlide(); startAutoSlide(); });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            stopAutoSlide();
            startAutoSlide();
        });
    });

    const slider = document.querySelector('.hero-slider');
    if (slider) {
        slider.addEventListener('mouseenter', stopAutoSlide);
        slider.addEventListener('mouseleave', startAutoSlide);
    }

    showSlide(currentSlide);
    startAutoSlide();

    // Categories
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            handleCategoryClick(category, this);
        });
    });

    function handleCategoryClick(category, card) {
        console.log(`Category clicked: ${category}`);
        
        card.style.transform = 'translateY(-15px) scale(1.05)';
        setTimeout(() => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        }, 200);

        const messages = {
            'body': 'Loading Body Care products...',
            'face': 'Loading Face Care products...',
            'all': 'Loading All Products...'
        };
        showNotification(messages[category] || 'Loading products...');
    }

    // Products
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('.price').textContent;
            
            addToCart(productName, productPrice, this);
        });
    });

    // Products Navigation
    function setupProductNavigation(container) {
        const productsGrid = container.querySelector('.products-grid');
        const prevProductBtn = container.querySelector('.products-nav-btn.prev-btn');
        const nextProductBtn = container.querySelector('.products-nav-btn.next-btn');

        if (prevProductBtn && nextProductBtn && productsGrid) {
            const scrollAmount = 330; // card width + gap

            prevProductBtn.addEventListener('click', () => {
                productsGrid.scrollBy({
                    left: -scrollAmount,
                    behavior: 'smooth'
                });
            });

            nextProductBtn.addEventListener('click', () => {
                productsGrid.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            });

            // Show/hide navigation buttons based on scroll position
            function updateNavButtons() {
                const isAtStart = productsGrid.scrollLeft === 0;
                const isAtEnd = productsGrid.scrollLeft + productsGrid.clientWidth >= productsGrid.scrollWidth;

                prevProductBtn.style.opacity = isAtStart ? '0.5' : '1';
                nextProductBtn.style.opacity = isAtEnd ? '0.5' : '1';
            }

            productsGrid.addEventListener('scroll', updateNavButtons);
            updateNavButtons(); // Initial check
        }
    }

    // Setup navigation for all product sections
    const productContainers = document.querySelectorAll('.products-container');
    productContainers.forEach(container => {
        setupProductNavigation(container);
    });

    function addToCart(productName, price, button) {
        const originalText = button.textContent;
        button.textContent = 'Added!';
        button.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = 'linear-gradient(135deg, #9370db, #8a2be2)';
        }, 2000);

        showNotification(`${productName} added to cart!`);
        updateCartIcon();
    }

    function updateCartIcon() {
        const cartIcon = document.querySelector('.nav-icons a[href="#cart"]');
        if (cartIcon) {
            cartIcon.style.transform = 'scale(1.2)';
            setTimeout(() => {
                cartIcon.style.transform = 'scale(1)';
            }, 300);
        }
    }

    // Notification system
    function showNotification(message) {
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) existingNotification.remove();

        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #9370db, #8a2be2);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(147, 112, 219, 0.3);
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;

        notification.querySelector('.notification-content').style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
        `;

        notification.querySelector('.notification-close').style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        });

        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 300);
            }
        }, 3000);
    }

    // Search
    const searchIcon = document.querySelector('.nav-icons a[href="#search"]');
    if (searchIcon) {
        searchIcon.addEventListener('click', function(e) {
            e.preventDefault();
            showSearchModal();
        });
    }

    function showSearchModal() {
        const modal = document.createElement('div');
        modal.className = 'search-modal';
        modal.innerHTML = `
            <div class="search-modal-content">
                <div class="search-header">
                    <h3>Search Products</h3>
                    <button class="search-close">&times;</button>
                </div>
                <div class="search-input-container">
                    <input type="text" placeholder="Search for products..." class="search-input">
                    <button class="search-submit">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
                <div class="search-suggestions">
                    <h4>Popular Searches:</h4>
                    <div class="suggestion-tags">
                        <span class="suggestion-tag">Face Cream</span>
                        <span class="suggestion-tag">Body Oil</span>
                        <span class="suggestion-tag">Serum</span>
                        <span class="suggestion-tag">Moisturizer</span>
                    </div>
                </div>
            </div>
        `;

        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        modal.querySelector('.search-modal-content').style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 20px;
            width: 90%;
            max-width: 500px;
            box-shadow: 0 20px 40px rgba(147, 112, 219, 0.2);
        `;

        modal.querySelector('.search-header').style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        `;

        modal.querySelector('.search-close').style.cssText = `
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #6a5acd;
        `;

        modal.querySelector('.search-input-container').style.cssText = `
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
        `;

        modal.querySelector('.search-input').style.cssText = `
            flex: 1;
            padding: 12px 15px;
            border: 2px solid #e6e6fa;
            border-radius: 25px;
            outline: none;
            font-size: 16px;
        `;

        modal.querySelector('.search-submit').style.cssText = `
            background: linear-gradient(135deg, #9370db, #8a2be2);
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 25px;
            cursor: pointer;
            transition: all 0.3s ease;
        `;

        modal.querySelector('.suggestion-tags').style.cssText = `
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 10px;
        `;

        modal.querySelectorAll('.suggestion-tag').forEach(tag => {
            tag.style.cssText = `
                background: #f0f0ff;
                color: #6a5acd;
                padding: 8px 15px;
                border-radius: 20px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 14px;
            `;
        });

        document.body.appendChild(modal);

        setTimeout(() => {
            modal.style.opacity = '1';
        }, 100);

        modal.querySelector('.search-close').addEventListener('click', () => {
            modal.style.opacity = '0';
            setTimeout(() => modal.remove(), 300);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.opacity = '0';
                setTimeout(() => modal.remove(), 300);
            }
        });

        const searchInput = modal.querySelector('.search-input');
        const searchSubmit = modal.querySelector('.search-submit');

        searchSubmit.addEventListener('click', () => {
            const query = searchInput.value.trim();
            if (query) {
                showNotification(`Searching for: ${query}`);
                modal.style.opacity = '0';
                setTimeout(() => modal.remove(), 300);
            }
        });

        modal.querySelectorAll('.suggestion-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                searchInput.value = tag.textContent;
            });
        });

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') searchSubmit.click();
        });

        searchInput.focus();
    }

    // Newsletter
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            if (email) {
                showNotification('Thank you for subscribing!');
                this.querySelector('input[type="email"]').value = '';
            }
        });
    }

    // Smooth scrolling
    const navLinks = document.querySelectorAll('.nav-links a, .footer-section a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Scroll effects
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(230, 230, 250, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.background = 'linear-gradient(135deg, #e6e6fa 0%, #f0f0ff 100%)';
            navbar.style.backdropFilter = 'none';
        }
    });

    // Signup form show/hide logic
    const signupIcon = document.getElementById('signup-icon');
    const signupFormContainer = document.getElementById('signup-form-container');
    if (signupIcon && signupFormContainer) {
        signupIcon.addEventListener('click', function(e) {
            e.preventDefault();
            signupFormContainer.classList.toggle('active');
        });
        document.addEventListener('click', function(e) {
            if (
                signupFormContainer.classList.contains('active') &&
                !signupFormContainer.contains(e.target) &&
                e.target !== signupIcon && !signupIcon.contains(e.target)
            ) {
                signupFormContainer.classList.remove('active');
            }
        });
    }

    // Signup/Login tab switching logic
    const signupTab = document.getElementById('signup-tab');
    const loginTab = document.getElementById('login-tab');
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');
    if (signupTab && loginTab && signupForm && loginForm) {
        signupTab.addEventListener('click', function() {
            signupTab.classList.add('active');
            loginTab.classList.remove('active');
            signupForm.style.display = 'block';
            loginForm.style.display = 'none';
        });
        loginTab.addEventListener('click', function() {
            loginTab.classList.add('active');
            signupTab.classList.remove('active');
            loginForm.style.display = 'block';
            signupForm.style.display = 'none';
        });
        // Default: show signup
        signupTab.classList.add('active');
        loginTab.classList.remove('active');
        signupForm.style.display = 'block';
        loginForm.style.display = 'none';
    }

    // Signup form validation
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = signupForm.querySelector('input[placeholder="نام کاربری"]').value.trim();
            const email = signupForm.querySelector('input[placeholder="ایمیل"]').value.trim();
            const password = signupForm.querySelector('input[placeholder="رمز عبور"]').value;
            const confirmPassword = signupForm.querySelector('input[placeholder="تکرار رمز عبور"]').value;
            const errorDiv = document.getElementById('signup-error');
            let error = '';
            if (!username || !email || !password || !confirmPassword) {
                error = 'لطفاً تمام فیلدها را پر کنید.';
            } else if (!/^\S+@\S+\.\S+$/.test(email)) {
                error = 'لطفاً یک ایمیل معتبر وارد کنید.';
            } else if (password.length < 6) {
                error = 'رمز عبور باید حداقل ۶ کاراکتر باشد.';
            } else if (password !== confirmPassword) {
                error = 'رمزهای عبور مطابقت ندارند.';
            }
            if (error) {
                errorDiv.textContent = error;
                errorDiv.classList.add('active');
                return;
            } else {
                errorDiv.textContent = '';
                errorDiv.classList.remove('active');
                // You can add AJAX or success message here
                signupForm.reset();
                signupFormContainer.classList.remove('active');
                showNotification('ثبت‌نام با موفقیت انجام شد!');
            }
        });
    }
    // Login form validation
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = loginForm.querySelector('input[placeholder="ایمیل"]').value.trim();
            const password = loginForm.querySelector('input[placeholder="رمز عبور"]').value;
            const errorDiv = document.getElementById('login-error');
            let error = '';
            if (!email || !password) {
                error = 'لطفاً تمام فیلدها را پر کنید.';
            } else if (!/^\S+@\S+\.\S+$/.test(email)) {
                error = 'لطفاً یک ایمیل معتبر وارد کنید.';
            }
            if (error) {
                errorDiv.textContent = error;
                errorDiv.classList.add('active');
                return;
            } else {
                errorDiv.textContent = '';
                errorDiv.classList.remove('active');
                // You can add AJAX or success message here
                loginForm.reset();
                signupFormContainer.classList.remove('active');
                showNotification('ورود با موفقیت انجام شد!');
            }
        });
    }

    console.log('Beauty Glow website initialized successfully!');
});
