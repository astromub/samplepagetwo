const SUPABASE_URL = 'https://ntxnbrvbzykiciueqnha.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50eG5icnZienlraWNpdWVxbmhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwODg4ODksImV4cCI6MjA3OTY2NDg4OX0.kn0fQLobIvR--hBiXSB71SFQgID_vaCQWEYYjyO5XiE';

// Initialize Supabase client
let supabase;
try {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    window.supabase = supabase;
    console.log('Supabase client initialized successfully');
} catch (error) {
    console.error('Failed to initialize Supabase client:', error);
}

// Auth state management
let authInitialized = false;
let currentSession = null;

// Utility function to show loading state
function setAuthLoading(isLoading) {
    const userNav = document.getElementById('user-nav');
    if (userNav && isLoading) {
        userNav.innerHTML = '<span style="color: #666;">Loading...</span>';
    }
}

// Get redirect URL
function getRedirectUrl() {
    return `${window.location.origin}/samplepagetwo/login-callback.html`;
}

// Handle user logout
async function handleLogout() {
    setAuthLoading(true);
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        
        console.log('Logout successful');
        window.location.href = '/samplepagetwo/';
    } catch (error) {
        console.error('Logout error:', error);
        alert('Logout failed. Please try again.');
        setAuthLoading(false);
    }
}

// Handle user login - FIXED: Minimal GitHub permissions
async function handleLogin() {
    setAuthLoading(true);
    try {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: { 
                redirectTo: getRedirectUrl(),
                // Minimal scopes - only what we actually need
                scopes: 'user:email'
            }
        });
        if (error) throw error;
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Please try again.');
        setAuthLoading(false);
    }
}

// Update UI based on authentication state
function updateAuthUI(session) {
    const userNav = document.getElementById('user-nav');
    if (!userNav) return;

    if (session?.user) {
        const userName = session.user.user_metadata?.full_name || 
                        session.user.user_metadata?.user_name || 
                        session.user.email?.split('@')[0] || 
                        'User';
        
        userNav.innerHTML = `
            <span class="welcome-text">👋 Welcome, ${userName}</span>
            <a href="/samplepagetwo/profile.html" class="nav-link">📱 Profile</a>
            <a href="/samplepagetwo/products.html" class="nav-link">🛍️ Products</a>
            <div style="position: relative;">
                <a href="/samplepagetwo/cart.html" class="nav-link">
                    🛒 Cart 
                    <span class="cart-count">${window.cart?.getTotalItems() || 0}</span>
                </a>
            </div>
            <a href="#" id="logout-btn" class="nav-link logout-btn">🚪 Logout</a>
        `;
        
        // Remove existing event listeners and add new one
        const logoutBtn = document.getElementById('logout-btn');
        logoutBtn?.replaceWith(logoutBtn.cloneNode(true));
        document.getElementById('logout-btn')?.addEventListener('click', async (e) => {
            e.preventDefault();
            await handleLogout();
        });
        
    } else {
        userNav.innerHTML = `
            <a href="#" id="login-btn" class="nav-link login-btn">🔐 Login with GitHub</a>
            <a href="/samplepagetwo/products.html" class="nav-link">🛍️ Products</a>
            <a href="/samplepagetwo/cart.html" class="nav-link">🛒 Cart</a>
        `;
        
        // Remove existing event listeners and add new one
        const loginBtn = document.getElementById('login-btn');
        loginBtn?.replaceWith(loginBtn.cloneNode(true));
        document.getElementById('login-btn')?.addEventListener('click', async (e) => {
            e.preventDefault();
            await handleLogin();
        });
    }
}

// Initialize authentication system
async function initializeAuth() {
    if (authInitialized) return;
    
    try {
        setAuthLoading(true);
        
        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
            console.error('Error getting session:', error);
            updateAuthUI(null);
            return;
        }
        
        currentSession = session;
        updateAuthUI(session);
        authInitialized = true;
        
        // Set up auth state change listener (only once)
        supabase.auth.onAuthStateChange((event, session) => {
            console.log('Auth state changed:', event);
            
            // Only update if session actually changed
            if (JSON.stringify(session) !== JSON.stringify(currentSession)) {
                currentSession = session;
                updateAuthUI(session);
            }
        });
        
    } catch (error) {
        console.error('Auth initialization error:', error);
        updateAuthUI(null);
    } finally {
        setAuthLoading(false);
    }
}

// Get current user with profile data
async function getCurrentUserWithProfile() {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        
        if (user) {
            // Get profile data
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();
            
            if (profileError && profileError.code !== 'PGRST116') {
                console.error('Error fetching profile:', profileError);
            }
            
            return { user, profile: profile || {} };
        }
        return null;
    } catch (error) {
        console.error('Error getting user with profile:', error);
        return null;
    }
}

// Check if user is authenticated
async function isAuthenticated() {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
}

// Initialize auth when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (supabase) {
        // Small delay to ensure DOM is fully ready
        setTimeout(() => {
            initializeAuth();
        }, 50);
    } else {
        console.error('Supabase client not available');
    }
});

// Export functions for use in other scripts
window.authUtils = {
    getCurrentUser: getCurrentUserWithProfile,
    isAuthenticated,
    initializeAuth,
    handleLogout,
    handleLogin
};

// Add basic CSS for auth elements
const authStyles = `
<style>
.welcome-text {
    color: #333;
    font-weight: 500;
    margin-right: 15px;
    font-size: 14px;
}

.nav-link {
    color: #007bff;
    text-decoration: none;
    margin: 0 8px;
    padding: 8px 12px;
    border-radius: 6px;
    transition: all 0.2s;
    font-size: 14px;
    border: 1px solid transparent;
    display: inline-flex;
    align-items: center;
    gap: 5px;
}

.nav-link:hover {
    background-color: #f8f9fa;
    border-color: #007bff;
    transform: translateY(-1px);
}

.logout-btn {
    color: #dc3545;
    border-color: #dc3545;
}

.logout-btn:hover {
    background-color: #fff5f5;
}

.login-btn {
    color: #28a745;
    border-color: #28a745;
    font-weight: 500;
}

.login-btn:hover {
    background-color: #f8fff9;
}

#user-nav {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
}

.cart-count {
    background: #dc3545;
    color: white;
    border-radius: 50%;
    padding: 2px 6px;
    font-size: 0.7rem;
    position: relative;
    top: -8px;
    right: -2px;
}

@media (max-width: 768px) {
    #user-nav {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }
    
    .welcome-text {
        margin-right: 0;
        margin-bottom: 5px;
        font-size: 13px;
    }
    
    .nav-link {
        margin: 2px 0;
        font-size: 13px;
        padding: 6px 10px;
    }
}

/* Fix for broken layout */
.hero-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 2rem 1rem;
}

.hero-text {
    max-width: 600px;
    margin-bottom: 2rem;
}

.eyebrow {
    display: block;
    font-size: 0.9rem;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 1rem;
}

.hero-text h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: #333;
}

.bio {
    font-size: 1.1rem;
    line-height: 1.6;
    color: #666;
    margin-bottom: 2rem;
}

.product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    width: 100%;
    max-width: 1000px;
}

.product-card {
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    transition: transform 0.3s ease;
}

.product-card:hover {
    transform: translateY(-5px);
}

.product-card img {
    width: 100%;
    height: 300px;
    object-fit: cover;
}

.btn-product {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #007bff;
    color: white;
    padding: 12px 24px;
    border-radius: 6px;
    text-decoration: none;
    font-weight: 500;
}

.gallery-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    padding: 2rem 1rem;
    max-width: 1200px;
    margin: 0 auto;
}

.gallery-section img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', authStyles);
