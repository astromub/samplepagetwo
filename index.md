---
layout: default
title: AstroMub Store
---

<div class="hero-container">
  <div class="hero-text">
    <span class="eyebrow">GET EVERY SINGLE SOLUTIONS</span>
    <h1>ASTROMUB STORE</h1>
    <p class="bio">
      Welcome to AstroMub Store - your premier destination for quality products. 
      We offer a wide range of items with excellent customer service and fast shipping.
    </p>
    
    <a href="/samplepagetwo/products.html" class="btn btn-primary">Shop Now</a>
    <a href="/samplepagetwo/profile.html" class="btn btn-outline">My Account</a>
  </div>

  <div class="product-grid">
    <div class="product-card">
        <img src="{{ site.baseurl }}/images/model1.jpg" alt="Premium Product 1">
        <a href="/samplepagetwo/products.html" class="btn btn-product">SHOP NOW</a>
    </div>
    
    <div class="product-card">
        <img src="{{ site.baseurl }}/images/model2.jpg" alt="Premium Product 2">
        <a href="/samplepagetwo/products.html" class="btn btn-product">SHOP NOW</a>
    </div>
    
    <div class="product-card">
        <img src="{{ site.baseurl }}/images/model3.jpg" alt="Premium Product 3">
        <a href="/samplepagetwo/products.html" class="btn btn-product">SHOP NOW</a>
    </div>
  </div>
</div>

<div class="gallery-section">
    <img src="{{ site.baseurl }}/images/gallery/item1.jpg" alt="Featured Product 1">
    <img src="{{ site.baseurl }}/images/gallery/item2.jpg" alt="Featured Product 2">
    <img src="{{ site.baseurl }}/images/gallery/item3.jpg" alt="Featured Product 3">
    <img src="{{ site.baseurl }}/images/gallery/item4.jpg" alt="Featured Product 4">
</div>

<!-- Add navigation bar with auth -->
<nav class="navbar">
  <a href="/samplepagetwo/" class="logo">AstroMub Store</a>
  <div id="user-nav">
    <!-- Auth content will be injected here by auth.js -->
    <span style="color: #666;">Loading...</span>
  </div>
</nav>

<!-- Load Supabase and auth scripts -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="/samplepagetwo/assets/auth.js"></script>
<script src="/samplepagetwo/assets/cart.js"></script>

<style>
/* Navigation Styles */
.navbar {
    background: white;
    padding: 1rem 2rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 1000;
}

.logo {
    font-size: 1.5rem;
    font-weight: bold;
    color: #007bff;
    text-decoration: none;
}

/* Hero Section Styles */
.hero-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 4rem 1rem 2rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    min-height: 80vh;
    justify-content: center;
}

.hero-text {
    max-width: 600px;
    margin-bottom: 3rem;
}

.eyebrow {
    display: block;
    font-size: 0.9rem;
    color: rgba(255,255,255,0.8);
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 1rem;
    font-weight: 500;
}

.hero-text h1 {
    font-size: 3.5rem;
    margin-bottom: 1.5rem;
    color: white;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.bio {
    font-size: 1.2rem;
    line-height: 1.6;
    color: rgba(255,255,255,0.9);
    margin-bottom: 2.5rem;
}

.btn {
    display: inline-block;
    padding: 14px 28px;
    margin: 0 12px;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
    font-size: 1rem;
    border: 2px solid transparent;
}

.btn-primary {
    background: #ff6b6b;
    color: white;
    border-color: #ff6b6b;
}

.btn-primary:hover {
    background: #ff5252;
    border-color: #ff5252;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(255,107,107,0.3);
}

.btn-outline {
    background: transparent;
    color: white;
    border-color: white;
}

.btn-outline:hover {
    background: white;
    color: #667eea;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(255,255,255,0.2);
}

/* Product Grid Styles */
.product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    width: 100%;
    max-width: 1200px;
    margin-top: 2rem;
}

.product-card {
    position: relative;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 8px 30px rgba(0,0,0,0.2);
    transition: all 0.3s ease;
    background: white;
}

.product-card:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
}

.product-card img {
    width: 100%;
    height: 320px;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.product-card:hover img {
    transform: scale(1.1);
}

.btn-product {
    position: absolute;
    bottom: 25px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(255,255,255,0.95);
    color: #333;
    padding: 14px 28px;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.2);
    transition: all 0.3s ease;
}

.btn-product:hover {
    background: white;
    transform: translateX(-50%) translateY(-2px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.2);
}

/* Gallery Section Styles */
.gallery-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    padding: 4rem 1rem;
    max-width: 1200px;
    margin: 0 auto;
    background: #f8f9fa;
}

.gallery-section img {
    width: 100%;
    height: 250px;
    object-fit: cover;
    border-radius: 12px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.gallery-section img:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 25px rgba(0,0,0,0.2);
}

/* Responsive Design */
@media (max-width: 768px) {
    .hero-text h1 {
        font-size: 2.5rem;
    }
    
    .bio {
        font-size: 1.1rem;
    }
    
    .btn {
        padding: 12px 24px;
        margin: 0 8px 10px;
        display: block;
        width: 200px;
        margin-left: auto;
        margin-right: auto;
    }
    
    .product-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }
    
    .gallery-section {
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        padding: 2rem 1rem;
    }
    
    .navbar {
        padding: 1rem;
        flex-direction: column;
        gap: 1rem;
    }
    
    .hero-container {
        padding: 6rem 1rem 2rem;
        min-height: 70vh;
    }
}

@media (max-width: 480px) {
    .hero-text h1 {
        font-size: 2rem;
    }
    
    .product-card img {
        height: 250px;
    }
    
    .gallery-section img {
        height: 200px;
    }
}

/* Animation for page load */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.hero-text, .product-grid, .gallery-section {
    animation: fadeInUp 0.8s ease-out;
}

.gallery-section {
    animation-delay: 0.2s;
}
</style>

<script>
// Additional initialization for the home page
document.addEventListener('DOMContentLoaded', function() {
    console.log('AstroMub Store home page loaded');
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    document.querySelectorAll('.product-card, .gallery-section img').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});
</script>
