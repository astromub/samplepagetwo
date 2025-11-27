const SUPABASE_URL = 'https://ntxnbrvbzykiciueqnha.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50eG5icnZienlraWNpdWVxbmhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwODg4ODksImV4cCI6MjA3OTY2NDg4OX0.kn0fQLobIvR--hBiXSB71SFQgID_vaCQWEYYjyO5XiE';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
    // Use current origin to work both locally and on GitHub Pages
    const baseUrl = window.location.origin;
    return `${baseUrl}/samplepagetwo/login-callback.html`;
}

// Handle user logout
async function handleLogout() {
    setAuthLoading(true);
    const { error } = await supabase.auth.signOut();
    
    if (error) {
        console.error('Logout error:', error);
        alert('Logout failed. Please try again.');
    } else {
        // Redirect to home page after successful logout
        window.location.href = '/samplepagetwo/';
    }
}

// Handle user login
async function handleLogin() {
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: { 
            redirectTo: getRedirectUrl()
        }
    });
    
    if (error) {
        console.error('Login error:', error);
        setAuthLoading(false);
        alert('Login failed. Please try again.');
    }
}

// Update UI based on authentication state
function updateAuthUI(session) {
    const userNav = document.getElementById('user-nav');
    if (!userNav) return;

    if (session?.user) {
        // User is logged in
        const userName = session.user.user_metadata?.full_name || 
                        session.user.user_metadata?.user_name || 
                        session.user.email || 
                        'User';
        
        userNav.innerHTML = `
            <span class="welcome-text">Welcome, ${userName}</span>
            <a href="/samplepagetwo/profile.html" class="nav-link">Profile</a>
            <a href="#" id="logout-btn" class="nav-link logout-btn">Logout</a>
        `;
        
        // Add event listener for logout button
        document.getElementById('logout-btn')?.addEventListener('click', async (e) => {
            e.preventDefault();
            await handleLogout();
        });
        
        console.log('User logged in:', session.user);
    } else {
        // User is not logged in
        userNav.innerHTML = `
            <a href="#" id="login-btn" class="nav-link login-btn">Login with GitHub</a>
        `;
        
        // Add event listener for login button
        document.getElementById('login-btn')?.addEventListener('click', async (e) => {
            e.preventDefault();
            await handleLogin();
        });
    }
}

// Check authentication state and initialize auth system
async function initializeAuth() {
    try {
        setAuthLoading(true);
        
        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
            console.error('Error getting session:', error);
            updateAuthUI(null);
            return;
        }
        
        // Update UI with current session state
        updateAuthUI(session);
        
        // Set up auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
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
                }
            }
        );
        
        // Store subscription for cleanup (if needed)
        window.authSubscription = subscription;
        
    } catch (error) {
        console.error('Auth initialization error:', error);
        updateAuthUI(null);
    } finally {
        setAuthLoading(false);
    }
}

// Get current user info (useful for other parts of your app)
async function getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
        console.error('Error getting user:', error);
        return null;
    }
    return user;
}

// Check if user is authenticated (useful for protected pages)
function isAuthenticated() {
    return supabase.auth.getSession().then(({ data: { session } }) => {
        return !!session;
    });
}

// Initialize auth when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit to ensure all elements are rendered
    setTimeout(() => {
        initializeAuth();
    }, 100);
});

// Export functions for use in other scripts (if needed)
window.authUtils = {
    getCurrentUser,
    isAuthenticated,
    initializeAuth,
    handleLogout,
    handleLogin
};

// Optional: Add some basic CSS for auth elements
const authStyles = `
<style>
.welcome-text {
    color: #333;
    font-weight: 500;
    margin-right: 15px;
}

.nav-link {
    color: #007bff;
    text-decoration: none;
    margin: 0 10px;
    padding: 5px 10px;
    border-radius: 4px;
    transition: background-color 0.2s;
}

.nav-link:hover {
    background-color: #f8f9fa;
}

.logout-btn {
    color: #dc3545;
}

.login-btn {
    color: #28a745;
    font-weight: 500;
}

#user-nav {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
}
</style>
`;

// Inject styles into document head
document.head.insertAdjacentHTML('beforeend', authStyles);
