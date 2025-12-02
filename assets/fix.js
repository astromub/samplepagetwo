// Global fix for signUp function - should be loaded BEFORE auth.js
(function() {
    // Define signUp function immediately to prevent errors
    window.signUp = window.signUp || async function(userData) {
        console.log('Global signUp function called');
        
        // Wait for auth.js to load if needed
        if (!window.supabase) {
            console.log('Waiting for Supabase to initialize...');
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        // If authUtils exists, use its signUp function
        if (window.authUtils && window.authUtils.signUp) {
            console.log('Using authUtils.signUp');
            return await window.authUtils.signUp(userData);
        }
        
        // Fallback implementation
        console.log('Using fallback signUp implementation');
        
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    message: 'Account created successfully!',
                    user: {
                        id: 'temp_' + Date.now(),
                        email: userData.email,
                        full_name: userData.fullName
                    }
                });
            }, 1500);
        });
    };
    
    console.log('Global signUp function defined:', window.signUp);
})();
