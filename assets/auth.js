const SUPABASE_URL = 'https://ntxnbrvbzykiciueqnha.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50eG5icnZienlraWNpdWVxbmhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwODg4ODksImV4cCI6MjA3OTY2NDg4OX0.kn0fQLobIvR--hBiXSB71SFQgID_vaCQWEYYjyO5XiE';

// Initialize Supabase client and make it globally available
console.log('Initializing Supabase client...');
window.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Utility function to show loading state
function setAuthLoading(isLoading) {
    const userNav = document.getElementById('user-nav');
    if (userNav) {
        if (isLoading) {
            userNav.innerHTML = '<span>Loading...</span>';
        }
    }
}

// Utility function to get redirect URL
function getRedirectUrl() {
    const baseUrl = window.location.origin;
    const redirectUrl = `${baseUrl}/samplepagetwo/login-callback.html`;
    console.log('Using redirect URL:', redirectUrl);
    return redirectUrl;
}

// Handle user logout
async function handleLogout() {
    setAuthLoading(true);
    const { error } = await window.supabase.auth.signOut();
    
    if (error) {
        console.error('Logout error:', error);
        alert('Logout failed. Please try again.');
        setAuthLoading(false);
    } else {
        console.log('Logout successful');
        window.location.href = '/samplepagetwo/';
    }
}

// Handle user login
async function handleLogin() {
    setAuthLoading(true);
    const { error } = await window.supabase.auth.signInWithOAuth({
        provider: 'github',
        options: { 
            redirectTo: getRedirectUrl()
        }
    });
    
    if (error) {
        console.error('Login error:', error);
        setAuthLoading(false);
        alert('Login failed. Please try again.');
    } else {
        console.log('OAuth flow initiated');
    }
}

// Update UI based on authentication state
function updateAuthUI(session) {
    const userNav = document.getElementById('user-nav');
    if (!userNav) return;

    if (session?.user) {
        const userName = session.user.user_metadata?.full_name || 
                        session.user.user_metadata?.user_name || 
                        session.user.email || 
                        'User';
        
        userNav.innerHTML = `
            <span class="welcome-text">Welcome, ${userName}</span>
            <a href="/samplepagetwo/profile.html" class="nav-link">Profile</a>
            <a href="#" id="logout-btn" class="nav-link logout-btn">Logout</a>
        `;
        
        document.getElementById('logout-btn')?.addEventListener('click', async (e) => {
            e.preventDefault();
            await handleLogout();
        });
        
        console.log('User logged in:', session.user.email);
    } else {
        userNav.innerHTML = `
            <a href="#" id="login-btn" class="nav-link login-btn">Login with GitHub</a>
        `;
        
        document.getElementById('login-btn')?.addEventListener('click', async (e) => {
            e.preventDefault();
            await handleLogin();
        });
    }
}

// Check authentication state and initialize auth system
async function initializeAuth() {
    try {
        console.log('Initializing authentication...');
        setAuthLoading(true);
        
        const { data: { session }, error } = await window.supabase.auth.getSession();
        
        if (error) {
            console.error('Error getting session:', error);
            updateAuthUI(null);
            return;
        }
        
        console.log('Session loaded:', session ? 'User authenticated' : 'No session');
        updateAuthUI(session);
        
        // Set up auth state change listener
        const { data: { subscription } } = window.supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log('Auth state changed:', event);
                
                switch (event) {
                    case 'SIGNED_IN':
                        console.log('User signed in!');
                        updateAuthUI(session);
                        break;
                    case 'SIGNED_OUT':
                        console.log('User signed out!');
                        updateAuthUI(null);
                        break;
                    case 'TOKEN_REFRESHED':
                        console.log('Token refreshed');
                        break;
                    case 'USER_UPDATED':
                        console.log('User updated');
                        updateAuthUI(session);
                        break;
                    case 'INITIAL_SESSION':
                        console.log('Initial session loaded');
                        updateAuthUI(session);
                        break;
                }
            }
        );
        
        window.authSubscription = subscription;
        
    } catch (error) {
        console.error('Auth initialization error:', error);
        updateAuthUI(null);
    } finally {
        setAuthLoading(false);
    }
}

// Get current user info
async function getCurrentUser() {
    const { data: { user }, error } = await window.supabase.auth.getUser();
    if (error) {
        console.error('Error getting user:', error);
        return null;
    }
    return user;
}

// Check if user is authenticated
function isAuthenticated() {
    return window.supabase.auth.getSession().then(({ data: { session } }) => {
        return !!session;
    });
}

// Initialize auth when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing auth...');
    setTimeout(() => {
        initializeAuth();
    }, 100);
});

// Export functions for use in other scripts
window.authUtils = {
    getCurrentUser,
    isAuthenticated,
    initializeAuth,
    handleLogout,
    handleLogin
};

console.log('Auth.js loaded successfully');
