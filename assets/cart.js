// cart.js - Shopping Cart Management
class ShoppingCart {
    constructor() {
        this.items = this.loadCartFromStorage();
        this.init();
    }

    init() {
        // Initialize cart event listeners
        this.updateCartUI();
    }

    // Load cart from localStorage
    loadCartFromStorage() {
        try {
            const cartData = localStorage.getItem('astromub_cart');
            return cartData ? JSON.parse(cartData) : [];
        } catch (error) {
            console.error('Error loading cart from storage:', error);
            return [];
        }
    }

    // Save cart to localStorage
    saveCartToStorage() {
        try {
            localStorage.setItem('astromub_cart', JSON.stringify(this.items));
        } catch (error) {
            console.error('Error saving cart to storage:', error);
        }
    }

    // Add item to cart
    async addItem(product, quantity = 1) {
        try {
            // Check if user is logged in for cart functionality
            if (!window.supabase) {
                throw new Error('Authentication service not available');
            }
            
            const { data: { session } } = await window.supabase.auth.getSession();
            if (!session) {
                alert('Please login first to add items to cart!');
                const loginBtn = document.getElementById('login-btn');
                if (loginBtn) loginBtn.click();
                return false;
            }

            const existingItemIndex = this.items.findIndex(item => item.sku === product.sku);
            
            if (existingItemIndex > -1) {
                // Update quantity if item already exists
                this.items[existingItemIndex].quantity += quantity;
            } else {
                // Add new item
                this.items.push({
                    sku: product.sku,
                    title: product.title,
                    price: product.price,
                    image_url: product.image_url,
                    quantity: quantity,
                    added_at: new Date().toISOString()
                });
            }

            this.saveCartToStorage();
            this.updateCartUI();
            this.showCartNotification(`Added ${product.title} to cart!`);
            return true;
        } catch (error) {
            console.error('Error adding item to cart:', error);
            alert('Failed to add item to cart. Please try again.');
            return false;
        }
    }

    // Remove item from cart
    removeItem(sku) {
        this.items = this.items.filter(item => item.sku !== sku);
        this.saveCartToStorage();
        this.updateCartUI();
        this.showCartNotification('Item removed from cart!');
    }

    // Update item quantity
    updateQuantity(sku, quantity) {
        if (quantity <= 0) {
            this.removeItem(sku);
            return;
        }

        const item = this.items.find(item => item.sku === sku);
        if (item) {
            item.quantity = quantity;
            this.saveCartToStorage();
            this.updateCartUI();
        }
    }

    // Clear entire cart
    clearCart() {
        this.items = [];
        this.saveCartToStorage();
        this.updateCartUI();
        this.showCartNotification('Cart cleared!');
    }

    // Get cart total
    getCartTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Get total items count
    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    // Show cart notification
    showCartNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 12px 20px;
            border-radius: 4px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Update cart UI (cart icon, count, etc.)
    updateCartUI() {
        const totalItems = this.getTotalItems();
        
        // Update cart count in navbar
        const cartCountElements = document.querySelectorAll('.cart-count');
        cartCountElements.forEach(element => {
            element.textContent = totalItems;
            element.style.display = totalItems > 0 ? 'inline' : 'none';
        });
    }

    // Checkout process
    async checkout() {
        try {
            if (!window.supabase) {
                throw new Error('Authentication service not available');
            }

            const { data: { session } } = await window.supabase.auth.getSession();
            if (!session) {
                alert('Please login to complete your purchase!');
                return;
            }

            if (this.items.length === 0) {
                alert('Your cart is empty!');
                return;
            }

            // Process each item in cart
            for (const item of this.items) {
                const { error } = await window.supabase
                    .from('purchases')
                    .insert({
                        user_id: session.user.id,
                        product_sku: item.sku,
                        amount: item.price * item.quantity
                    });

                if (error) {
                    throw new Error(`Failed to process ${item.title}: ${error.message}`);
                }
            }

            // Clear cart after successful purchase
            this.clearCart();
            
            alert(`Thank you! Your order has been placed successfully. Total: $${this.getCartTotal().toFixed(2)}`);
            window.location.href = '/samplepagetwo/profile.html';
            
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Checkout failed: ' + error.message);
        }
    }

    // Get cart items (for external use)
    getItems() {
        return this.items;
    }
}

// Initialize global cart instance
window.cart = new ShoppingCart();

// Add cart styles to document
const cartStyles = `
<style>
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }

    .cart-count {
        background: #dc3545;
        color: white;
        border-radius: 50%;
        padding: 2px 6px;
        font-size: 0.7rem;
        position: absolute;
        top: -5px;
        right: -5px;
    }
</style>
`;

document.head.insertAdjacentHTML('beforeend', cartStyles);
