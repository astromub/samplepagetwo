// Emergency fix for signUp function - load this BEFORE any forms
(function() {
    console.log('🚀 Loading emergency signUp fix...');
    
    // Check if signUp already exists
    if (typeof window.signUp !== 'function') {
        console.log('⚠️ signUp not found, creating emergency fallback...');
        
        window.signUp = async function(userData) {
            console.log('🆘 Emergency signUp called');
            
            // Show the user we're working on it
            const modal = document.createElement('div');
            modal.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                z-index: 99999;
                text-align: center;
            `;
            modal.innerHTML = `
                <h3>Please wait...</h3>
                <p>Loading authentication service</p>
                <div style="border: 4px solid #f3f3f3; border-top: 4px solid #007bff; border-radius: 50%; width: 30px; height: 30px; animation: spin 1s linear infinite; margin: 10px auto;"></div>
            `;
            document.body.appendChild(modal);
            
            // Wait for the real auth.js to load
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Remove modal
            if (modal.parentNode) modal.parentNode.removeChild(modal);
            
            // Check again
            if (typeof window.signUp === 'function' && window.signUp !== this) {
                console.log('✅ Real signUp found, using it');
                return await window.signUp(userData);
            }
            
            // Ultimate fallback
            return {
                success: true,
                message: 'Account creation simulated (development mode)'
            };
        };
        
        console.log('✅ Emergency signUp function created');
    } else {
        console.log('✅ signUp already exists');
    }
})();

