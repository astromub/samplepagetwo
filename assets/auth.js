const SUPABASE_URL = 'https://ntxnbrvbzykiciueqnha.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50eG5icnZienlraWNpdWVxbmhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwODg4ODksImV4cCI6MjA3OTY2NDg4OX0.kn0fQLobIvR--hBiXSB71SFQgID_vaCQWEYYjyO5XiE';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Check login state on every page
document.addEventListener('DOMContentLoaded', async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const userNav = document.getElementById('user-nav');
    
    if (session?.user) {
        if (userNav) {
            userNav.innerHTML = `
                <span>Welcome, ${session.user.user_metadata.full_name || 'User'}</span>
                <a href="/samplepagetwo/profile.html">Profile</a>
                <a href="#" id="logout-btn">Logout</a>
            `;
            document.getElementById('logout-btn')?.addEventListener('click', async (e) => {
                e.preventDefault();
                await supabase.auth.signOut();
                location.reload();
            });
        }
    } else {
        if (userNav) {
            userNav.innerHTML = `<a href="#" id="login-btn">Login with GitHub</a>`;
            document.getElementById('login-btn')?.addEventListener('click', (e) => {
                e.preventDefault();
                supabase.auth.signInWithOAuth({
                      provider: 'github',
                      options: { redirectTo: 'https://astromub.github.io/samplepagetwo/login-callback.html'
  }
})
            });
        }
    }
});
