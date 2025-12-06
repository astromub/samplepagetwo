// cart.js - Shopping Cart Functionality
(function() {
    console.log('🛒 Initializing cart system...');
    
    class ShoppingCart {
        constructor() {
            this.items = JSON.parse(localStorage.getItem('astromub_cart')) || [];
            console.log('Cart loaded with items:', this.items);
        }
        
        // Save cart to localStorage
        save() {
            localStorage.setItem('astromub_cart', JSON.stringify(this.items));
            this.updateCartUI();
        }
        
        // Add item to cart
        addItem(product, quantity = 1) {
            const existingItem = this.items.find(item => item.sku === product.sku);
            
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                this.items.push({
                    sku: product.sku,
                    title: product.title,
                    price: product.price,
                    image_url: product.image_url,
                    quantity: quantity
                });
            }
            
            this.save();
            console.log('Item added:', product.sku, 'Quantity:', quantity);
        }
        
        // Remove item from cart
        removeItem(sku) {
            this.items = this.items.filter(item => item.sku !== sku);
            this.save();
            console.log('Item removed:', sku);
        }
        
        // Update item quantity
        updateQuantity(sku, quantity) {
            if (quantity < 1) {
                this.removeItem(sku);
                return;
            }
            
            const item = this.items.find(item => item.sku === sku);
            if (item) {
                item.quantity = quantity;
                this.save();
            }
        }
        
        // Get all items
        getItems() {
            return this.items;
        }
        
        // Get total number of items
        getTotalItems() {
            return this.items.reduce((total, item) => total + item.quantity, 0);
        }
        
        // Get cart total
        getCartTotal() {
            return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        }
        
        // Clear cart
        clear() {
            this.items = [];
            this.save();
        }
        
        // Checkout
        async checkout() {
            try {
                if (!window.supabase) {
                    throw new Error('Authentication not available');
                }
                
                const { data: { session } } = await window.supabase.auth.getSession();
                
                if (!session) {
                    alert('Please login to checkout');
                    return;
                }
                
                // Create purchases for each item
                for (const item of this.items) {
                    const { error } = await window.supabase
                        .from('purchases')
                        .insert({
                            user_id: session.user.id,
                            product_sku: item.sku,
                            amount: item.price * item.quantity,
                            status: 'completed'
                        });
                    
                    if (error) throw error;
                }
                
                // Clear cart after successful purchase
                this.clear();
                alert('Checkout successful! Thank you for your purchase.');
                window.location.href = '/samplepagetwo/profile.html';
                
            } catch (error) {
                console.error('Checkout error:', error);
                alert('Checkout failed: ' + error.message);
            }
        }
        
        // Update cart UI across all pages
        updateCartUI() {
            const cartCounts = document.querySelectorAll('.cart-count');
            const totalItems = this.getTotalItems();
            
            cartCounts.forEach(count => {
                count.textContent = totalItems;
            });
            
            // Dispatch event for cart updates
            window.dispatchEvent(new CustomEvent('cartUpdated', {
                detail: { items: this.items, total: this.getCartTotal() }
            }));
        }
    }
    
    // Initialize cart
    window.cart = new ShoppingCart();
    
    // Initial UI update
    setTimeout(() => {
        window.cart.updateCartUI();
    }, 500);
    
    console.log('✅ Cart system initialized');
})();
