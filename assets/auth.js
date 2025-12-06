// ================== ULTRA-EMERGENCY SIGNUP - LOADS FIRST ==================
(function() {
    console.log('🚀 ULTRA-EMERGENCY SIGNUP INITIALIZING...');
    
    // Define signUp function IMMEDIATELY - this runs before anything else
    window.signUp = async function(userData) {
        console.log('🆘 EMERGENCY signUp called with:', userData);
        
        // Validate input
        if (!userData || !userData.email || !userData.password || !userData.fullName) {
            throw new Error('Please fill in all required fields');
        }
        
        if (userData.password.length < 6) {
            throw new Error('Password must be at least 6 characters long');
        }
        
        try {
            // Initialize Supabase if not already done
            const SUPABASE_URL = 'https://ntxnbrvbzykiciueqnha.supabase.co';
            const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50eG5icnZienlraWNpdWVxbmhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwODg4ODksImV4cCI6MjA3OTY2NDg4OX0.kn0fQLobIvR--hBiXSB71SFQgID_vaCQWEYYjyO5XiE';
            
            if (!window.supabase) {
                console.log('🔄 Initializing Supabase in emergency mode...');
                window.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            }
            
            console.log('📤 Creating user in Supabase Auth...');
            
            // Create user in Supabase Auth
            const { data, error } = await window.supabase.auth.signUp({
                email: userData.email,
                password: userData.password,
                options: {
                    data: {
                        full_name: userData.fullName,
                        user_name: userData.fullName.toLowerCase().replace(/\s+/g, '_')
                    }
                }
            });
            
            if (error) {
                console.error('Auth error:', error);
                throw error;
            }
            
            console.log('✅ User created:', data.user);
            
            if (data.user) {
                // Try to create profile in profiles table
                try {
                    console.log('📝 Creating profile...');
                    const { error: profileError } = await window.supabase
                        .from('profiles')
                        .insert({
                            id: data.user.id,
                            username: userData.fullName.toLowerCase().replace(/\s+/g, '_'),
                            full_name: userData.fullName,
                            company: 'Astronub Limited'
                        });
                    
                    if (profileError) {
                        console.warn('⚠️ Profile creation warning (non-critical):', profileError);
                        // Don't throw - this is optional
                    }
                } catch (profileError) {
                    console.warn('⚠️ Could not create profile (non-critical):', profileError);
                }
                
                return {
                    success: true,
                    message: 'Account created successfully! Please check your email to verify your account.',
                    user: data.user
                };
            }
            
            throw new Error('Account creation failed - no user data returned');
            
        } catch (error) {
            console.error('❌ Emergency signup error:', error);
            return {
                success: false,
                message: error.message || 'Signup failed. Please try again.'
            };
        }
    };
    
    console.log('✅ ULTRA-EMERGENCY signUp function INSTALLED');
})();

// ================== MAIN AUTH.JS CODE ==================
const SUPABASE_URL = 'https://ntxnbrvbzykiciueqnha.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50eG5icnZienlraWNpdWVxbmhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwODg4ODksImV4cCI6MjA3OTY2NDg4OX0.kn0fQLobIvR--hBiXSB71SFQgID_vaCQWEYYjyO5XiE';

// Initialize Supabase
(function() {
    console.log('🔄 Initializing Supabase client...');
    if (!window.supabase) {
        try {
            window.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('✅ Supabase client initialized');
        } catch (error) {
            console.error('❌ Failed to initialize Supabase client:', error);
        }
    } else {
        console.log('✅ Supabase already initialized');
    }
})();

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

// Show login modal
function showLoginModal() {
    const modal = document.createElement('div');
    modal.id = 'login-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;
    
    modal.innerHTML = `
        <div style="background: white; padding: 2rem; border-radius: 12px; width: 90%; max-width: 400px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <h2 style="margin: 0; color: #333;">Login to AstroMub Store</h2>
                <button onclick="closeLoginModal()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #666;">&times;</button>
            </div>
            
            <form id="login-form">
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; color: #333; font-weight: 500;">Email</label>
                    <input type="email" id="login-email" required 
                           style="width: 100%; padding: 12px; border: 2px solid #e1e5e9; border-radius: 6px; font-size: 1rem; transition: border-color 0.3s;"
                           placeholder="Enter your email">
                </div>
                
                <div style="margin-bottom: 1.5rem;">
                    <label style="display: block; margin-bottom: 0.5rem; color: #333; font-weight: 500;">Password</label>
                    <input type="password" id="login-password" required 
                           style="width: 100%; padding: 12px; border: 2px solid #e1e5e9; border-radius: 6px; font-size: 1rem; transition: border-color 0.3s;"
                           placeholder="Enter your password">
                </div>
                
                <button type="submit" 
                        style="width: 100%; background: #007bff; color: white; border: none; padding: 12px; border-radius: 6px; font-size: 1rem; font-weight: 500; cursor: pointer; transition: background 0.3s;">
                    Login
                </button>
            </form>
            
            <div style="text-align: center; margin: 1.5rem 0;">
                <span style="color: #666;">Don't have an account? </span>
                <a href="#" id="show-signup" style="color: #007bff; text-decoration: none; font-weight: 500;">Sign up</a>
            </div>
            
            <div style="border-top: 1px solid #e1e5e9; padding-top: 1.5rem;">
                <button onclick="loginWithGitHub()" 
                        style="width: 100%; background: #333; color: white; border: none; padding: 12px; border-radius: 6px; font-size: 1rem; font-weight: 500; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px;">
                    <span>Login with GitHub</span>
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    document.getElementById('login-form').addEventListener('submit', handleEmailLogin);
    document.getElementById('show-signup').addEventListener('click', showSignupModal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeLoginModal();
        }
    });
}

// Show signup modal
function showSignupModal() {
    closeLoginModal();
    
    const modal = document.createElement('div');
    modal.id = 'signup-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;
    
    modal.innerHTML = `
        <div style="background: white; padding: 2rem; border-radius: 12px; width: 90%; max-width: 400px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <h2 style="margin: 0; color: #333;">Create Account</h2>
                <button onclick="closeSignupModal()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #666;">&times;</button>
            </div>
            
            <form id="signup-form">
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; color: #333; font-weight: 500;">Full Name</label>
                    <input type="text" id="signup-name" required 
                           style="width: 100%; padding: 12px; border: 2px solid #e1e5e9; border-radius: 6px; font-size: 1rem; transition: border-color 0.3s;"
                           placeholder="Enter your full name">
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; color: #333; font-weight: 500;">Email</label>
                    <input type="email" id="signup-email" required 
                           style="width: 100%; padding: 12px; border: 2px solid #e1e5e9; border-radius: 6px; font-size: 1rem; transition: border-color 0.3s;"
                           placeholder="Enter your email">
                </div>
                
                <div style="margin-bottom: 1.5rem;">
                    <label style="display: block; margin-bottom: 0.5rem; color: #333; font-weight: 500;">Password</label>
                    <input type="password" id="signup-password" required minlength="6"
                           style="width: 100%; padding: 12px; border: 2px solid #e1e5e9; border-radius: 6px; font-size: 1rem; transition: border-color 0.3s;"
                           placeholder="Create a password (min. 6 characters)">
                </div>
                
                <button type="submit" 
                        style="width: 100%; background: #28a745; color: white; border: none; padding: 12px; border-radius: 6px; font-size: 1rem; font-weight: 500; cursor: pointer; transition: background 0.3s;">
                    Create Account
                </button>
            </form>
            
            <div style="text-align: center; margin: 1.5rem 0;">
                <span style="color: #666;">Already have an account? </span>
                <a href="#" id="show-login" style="color: #007bff; text-decoration: none; font-weight: 500;">Login</a>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    document.getElementById('signup-form').addEventListener('submit', handleEmailSignup);
    document.getElementById('show-login').addEventListener('click', showLoginModal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeSignupModal();
        }
    });
}

// Close modals
function closeLoginModal() {
    const modal = document.getElementById('login-modal');
    if (modal) modal.remove();
}

function closeSignupModal() {
    const modal = document.getElementById('signup-modal');
    if (modal) modal.remove();
}

// Handle email login
async function handleEmailLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    // Show loading state
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Logging in...';
    submitBtn.disabled = true;
    
    try {
        const { data, error } = await window.supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        if (error) throw error;
        
        // Success
        closeLoginModal();
        alert('Login successful!');
        location.reload();
        
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed: ' + error.message);
        
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Handle email signup (for modal)
async function handleEmailSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    if (!name || !email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
    }
    
    // Show loading state
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Creating Account...';
    submitBtn.disabled = true;
    
    try {
        const result = await window.signUp({
            fullName: name,
            email: email,
            password: password
        });
        
        if (result && result.success) {
            closeSignupModal();
            alert(result.message);
        } else {
            throw new Error(result?.message || 'Signup failed');
        }
        
    } catch (error) {
        console.error('Signup error:', error);
        alert('Signup failed: ' + error.message);
        
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Handle GitHub login
async function loginWithGitHub() {
    setAuthLoading(true);
    try {
        const { error } = await window.supabase.auth.signInWithOAuth({
            provider: 'github',
            options: { 
                redirectTo: getRedirectUrl(),
                scopes: 'user:email'
            }
        });
        if (error) throw error;
    } catch (error) {
        console.error('GitHub login error:', error);
        alert('GitHub login failed. Please try again.');
        setAuthLoading(false);
    }
}

// Handle user logout
async function handleLogout() {
    setAuthLoading(true);
    try {
        const { error } = await window.supabase.auth.signOut();
        if (error) throw error;
        
        console.log('Logout successful');
        window.location.href = '/samplepagetwo/';
    } catch (error) {
        console.error('Logout error:', error);
        alert('Logout failed. Please try again.');
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
        
        const logoutBtn = document.getElementById('logout-btn');
        logoutBtn?.replaceWith(logoutBtn.cloneNode(true));
        document.getElementById('logout-btn')?.addEventListener('click', async (e) => {
            e.preventDefault();
            await handleLogout();
        });
        
    } else {
        userNav.innerHTML = `
            <a href="#" id="login-btn" class="nav-link login-btn">🔐 Login / Sign Up</a>
            <a href="/samplepagetwo/products.html" class="nav-link">🛍️ Products</a>
            <a href="/samplepagetwo/cart.html" class="nav-link">🛒 Cart</a>
        `;
        
        const loginBtn = document.getElementById('login-btn');
        loginBtn?.replaceWith(loginBtn.cloneNode(true));
        document.getElementById('login-btn')?.addEventListener('click', async (e) => {
            e.preventDefault();
            showLoginModal();
        });
    }
}

// Initialize authentication system
async function initializeAuth() {
    if (authInitialized) return;
    
    try {
        setAuthLoading(true);
        
        const { data: { session }, error } = await window.supabase.auth.getSession();
        
        if (error) {
            console.error('Error getting session:', error);
            updateAuthUI(null);
            return;
        }
        
        currentSession = session;
        updateAuthUI(session);
        authInitialized = true;
        
        window.supabase.auth.onAuthStateChange((event, session) => {
            console.log('Auth state changed:', event);
            
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
        const { data: { user }, error } = await window.supabase.auth.getUser();
        if (error) throw error;
        
        if (user) {
            const { data: profile, error: profileError } = await window.supabase
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
    const { data: { session } } = await window.supabase.auth.getSession();
    return !!session;
}

// Initialize auth when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - initializing auth...');
    
    // Ensure Supabase is loaded
    if (window.supabase) {
        setTimeout(() => {
            initializeAuth();
        }, 100);
    } else {
        console.error('Supabase client not available - retrying...');
        setTimeout(() => {
            if (window.supabase) {
                initializeAuth();
            }
        }, 1000);
    }
});

// Export functions for use in other scripts
window.authUtils = {
    getCurrentUser: getCurrentUserWithProfile,
    isAuthenticated,
    initializeAuth,
    handleLogout,
    showLoginModal,
    showSignupModal,
    closeLoginModal,
    closeSignupModal,
    loginWithGitHub,
    signUp: window.signUp,
    handleEmailLogin,
    handleEmailSignup
};

// Add CSS styles
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

input:focus {
    outline: none;
    border-color: #007bff !important;
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
</style>
`;

document.head.insertAdjacentHTML('beforeend', authStyles);

// Final initialization check
console.log('✅ auth.js COMPLETELY LOADED');
console.log('✅ signUp is DEFINED:', typeof window.signUp === 'function');
console.log('✅ Supabase is DEFINED:', typeof window.supabase !== 'undefined');
