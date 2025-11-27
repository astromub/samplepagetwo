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

<style>
.btn {
    display: inline-block;
    padding: 12px 24px;
    margin: 0 10px;
    border-radius: 6px;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;
}

.btn-primary {
    background: #007bff;
    color: white;
    border: 2px solid #007bff;
}

.btn-primary:hover {
    background: #0056b3;
    border-color: #0056b3;
    transform: translateY(-2px);
}

.btn-outline {
    background: transparent;
    color: #007bff;
    border: 2px solid #007bff;
}

.btn-outline:hover {
    background: #007bff;
    color: white;
    transform: translateY(-2px);
}
</style>
