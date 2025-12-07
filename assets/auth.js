// ================== AUTH.JS - ULTRA SIMPLE VERSION ==================
console.log('🚀 auth.js STARTING - Simple Version');

// Configuration
const SUPABASE_URL = 'https://ntxnbrvbzykiciueqnha.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50eG5icnZienlraWNpdWVxbmhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwODg4ODksImV4cCI6MjA3OTY2NDg4OX0.kn0fQLobIvR--hBiXSB71SFQgID_vaCQWEYYjyO5XiE';

// ================== SIMPLE SIGNUP FUNCTION ==================
window.signUp = async function(userData) {
    console.log('🔐 signUp called:', userData);
    
    try {
        // Check if Supabase is loaded
        if (typeof supabase === 'undefined' || !window.supabase) {
            console.error('❌ Supabase not loaded');
            throw new Error('Authentication service not available. Please refresh page.');
        }
        
        console.log('📤 Creating user...');
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
        
        if (error) throw error;
        
        console.log('✅ User created:', data.user);
        
        // Try to create profile (optional)
        if (data.user) {
            try {
                await window.supabase.from('profiles').insert({
                    id: data.user.id,
                    username: userData.fullName.toLowerCase().replace(/\s+/g, '_'),
                    full_name: userData.fullName,
                    company: 'Astronub Limited'
                });
            } catch (profileError) {
                console.warn('Profile optional:', profileError);
            }
        }
        
        return {
            success: true,
            message: 'Account created successfully!',
            user: data.user
        };
        
    } catch (error) {
        console.error('❌ Signup error:', error);
        return {
            success: false,
            message: error.message || 'Signup failed'
        };
    }
};

// ================== INITIALIZE SUPABASE ==================
function initSupabase() {
    console.log('🔄 Initializing Supabase...');
    
    // Check if Supabase library exists
    if (typeof supabase === 'undefined') {
        console.error('❌ Supabase library not loaded');
        return false;
    }
    
    // Initialize if not already done
    if (!window.supabase) {
        try {
            window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('✅ Supabase initialized');
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize Supabase:', error);
            return false;
        }
    }
    
    console.log('✅ Supabase already initialized');
    return true;
}

// ================== AUTH FUNCTIONS ==================
async function handleLogin(email, password) {
    try {
        if (!window.supabase) {
            throw new Error('Auth service not ready');
        }
        
        const { data, error } = await window.supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        if (error) throw error;
        return { success: true, user: data.user };
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: error.message };
    }
}

async function handleLogout() {
    try {
        if (!window.supabase) {
            throw new Error('Auth service not ready');
        }
        
        await window.supabase.auth.signOut();
        window.location.href = '/samplepagetwo/';
    } catch (error) {
        console.error('Logout error:', error);
        alert('Logout failed');
    }
}

async function loginWithGitHub() {
    try {
        if (!window.supabase) {
            throw new Error('Auth service not ready');
        }
        
        const { error } = await window.supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: window.location.origin + '/samplepagetwo/login-callback.html'
            }
        });
        
        if (error) throw error;
    } catch (error) {
        console.error('GitHub login error:', error);
        alert('GitHub login failed');
    }
}

// ================== AUTH STATE MANAGEMENT ==================
async function checkAuth() {
    try {
        if (!window.supabase) {
            console.log('⏳ Waiting for Supabase...');
            return null;
        }
        
        const { data: { session }, error } = await window.supabase.auth.getSession();
        
        if (error) {
            console.error('Session error:', error);
            return null;
        }
        
        return session;
    } catch (error) {
        console.error('Auth check error:', error);
        return null;
    }
}

function updateUI(session) {
    const userNav = document.getElementById('user-nav');
    if (!userNav) return;
    
    if (session?.user) {
        const userName = session.user.user_metadata?.full_name || 
                        session.user.email?.split('@')[0] || 
                        'User';
        
        userNav.innerHTML = `
            <span>👋 Welcome, ${userName}</span>
            <a href="/samplepagetwo/profile.html">📱 Profile</a>
            <a href="/samplepagetwo/products.html">🛍️ Products</a>
            <a href="/samplepagetwo/cart.html">🛒 Cart</a>
            <a href="#" id="logout-btn">🚪 Logout</a>
        `;
        
        document.getElementById('logout-btn').addEventListener('click', handleLogout);
    } else {
        userNav.innerHTML = `
            <a href="#" id="login-btn">🔐 Login</a>
            <a href="#" id="signup-btn">📝 Sign Up</a>
            <a href="/samplepagetwo/products.html">🛍️ Products</a>
            <a href="/samplepagetwo/cart.html">🛒 Cart</a>
        `;
        
        document.getElementById('login-btn').addEventListener('click', showLoginModal);
        document.getElementById('signup-btn').addEventListener('click', showSignupModal);
    }
}

// ================== MODAL FUNCTIONS ==================
function showLoginModal() {
    const modalHTML = `
        <div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;">
            <div style="background:white;padding:2rem;border-radius:8px;width:90%;max-width:400px;">
                <h2>Login</h2>
                <form id="modal-login-form">
                    <input type="email" placeholder="Email" required style="width:100%;padding:10px;margin:10px 0;">
                    <input type="password" placeholder="Password" required style="width:100%;padding:10px;margin:10px 0;">
                    <button type="submit" style="width:100%;padding:10px;background:#007bff;color:white;border:none;border-radius:4px;">Login</button>
                </form>
                <button onclick="loginWithGitHub()" style="width:100%;padding:10px;margin-top:10px;background:#333;color:white;border:none;border-radius:4px;">Login with GitHub</button>
                <button onclick="closeModal()" style="width:100%;padding:10px;margin-top:10px;background:#ccc;border:none;border-radius:4px;">Cancel</button>
            </div>
        </div>
    `;
    
    const modal = document.createElement('div');
    modal.innerHTML = modalHTML;
    modal.id = 'auth-modal';
    document.body.appendChild(modal);
    
    document.getElementById('modal-login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        const password = e.target.querySelector('input[type="password"]').value;
        
        const result = await handleLogin(email, password);
        if (result.success) {
            closeModal();
            location.reload();
        } else {
            alert('Login failed: ' + result.error);
        }
    });
}

function showSignupModal() {
    const modalHTML = `
        <div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;">
            <div style="background:white;padding:2rem;border-radius:8px;width:90%;max-width:400px;">
                <h2>Sign Up</h2>
                <form id="modal-signup-form">
                    <input type="text" placeholder="Full Name" required style="width:100%;padding:10px;margin:10px 0;">
                    <input type="email" placeholder="Email" required style="width:100%;padding:10px;margin:10px 0;">
                    <input type="password" placeholder="Password (min 6 chars)" required minlength="6" style="width:100%;padding:10px;margin:10px 0;">
                    <button type="submit" style="width:100%;padding:10px;background:#28a745;color:white;border:none;border-radius:4px;">Create Account</button>
                </form>
                <button onclick="closeModal()" style="width:100%;padding:10px;margin-top:10px;background:#ccc;border:none;border-radius:4px;">Cancel</button>
            </div>
        </div>
    `;
    
    const modal = document.createElement('div');
    modal.innerHTML = modalHTML;
    modal.id = 'auth-modal';
    document.body.appendChild(modal);
    
    document.getElementById('modal-signup-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            fullName: e.target.querySelector('input[type="text"]').value,
            email: e.target.querySelector('input[type="email"]').value,
            password: e.target.querySelector('input[type="password"]').value
        };
        
        try {
            const result = await window.signUp(formData);
            if (result.success) {
                closeModal();
                alert(result.message);
                setTimeout(() => location.reload(), 1000);
            } else {
                alert('Signup failed: ' + result.message);
            }
        } catch (error) {
            alert('Signup error: ' + error.message);
        }
    });
}

function closeModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) modal.remove();
}

// ================== INITIALIZATION ==================
window.showLoginModal = showLoginModal;
window.showSignupModal = showSignupModal;
window.closeModal = closeModal;
window.loginWithGitHub = loginWithGitHub;
window.handleLogout = handleLogout;

// Wait for everything to load
document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM loaded - initializing auth...');
    
    // Try to initialize Supabase
    let initialized = initSupabase();
    
    // If failed, wait and try again
    if (!initialized) {
        console.log('Waiting for Supabase to load...');
        setTimeout(() => {
            initSupabase();
            initializeAuth();
        }, 1000);
    } else {
        initializeAuth();
    }
});

async function initializeAuth() {
    // Wait a bit for Supabase
    if (!window.supabase) {
        console.log('Waiting for Supabase client...');
        setTimeout(initializeAuth, 500);
        return;
    }
    
    console.log('🔄 Checking auth state...');
    const session = await checkAuth();
    updateUI(session);
    
    // Listen for auth changes
    window.supabase.auth.onAuthStateChange((event, session) => {
        console.log('Auth state changed:', event);
        updateUI(session);
    });
}

console.log('✅ auth.js loaded - signUp available:', typeof window.signUp === 'function');
