// Password visibility toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const loginForm = document.getElementById('loginForm');

    // Toggle password visibility
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            // Toggle the type attribute
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Toggle the active class on button
            this.classList.toggle('active');
            
            // Update aria-label for accessibility
            const label = type === 'password' ? 'Show password' : 'Hide password';
            this.setAttribute('aria-label', label);
        });
    }

    // Form submission handler (demo purposes)
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const remember = document.getElementById('remember').checked;
            
            // Basic validation
            if (!username || !password) {
                showNotification('Please fill in all fields', 'error');
                return;
            }

            // Simulate login process
            showNotification('Signing in...', 'info');
            
            // Simulate API call
            setTimeout(() => {
                showNotification('Login successful! Welcome back.', 'success');
                console.log('Login attempt:', { username, remember });
                
                // Here you would typically make an API call to your backend
                // Example:
                // fetch('/api/login', {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify({ username, password, remember })
                // })
                // .then(response => response.json())
                // .then(data => {
                //     if (data.success) {
                //         window.location.href = '/dashboard';
                //     } else {
                //         showNotification(data.message, 'error');
                //     }
                // });
            }, 1500);
        });
    }

    // Social login button handlers
    const socialButtons = document.querySelectorAll('.social-btn');
    socialButtons.forEach(button => {
        button.addEventListener('click', function() {
            const provider = this.getAttribute('aria-label').split(' ').pop();
            showNotification(`Redirecting to ${provider} login...`, 'info');
            console.log(`Social login with: ${provider}`);
            
            // Here you would typically redirect to OAuth provider
            // Example:
            // window.location.href = `/auth/${provider.toLowerCase()}`;
        });
    });

    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notification if any
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: '0.75rem',
            backgroundColor: type === 'success' ? '#10b981' : 
                           type === 'error' ? '#ef4444' : 
                           type === 'warning' ? '#f59e0b' : '#3b82f6',
            color: 'white',
            fontWeight: '600',
            fontSize: '0.875rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            zIndex: '9999',
            animation: 'slideIn 0.3s ease-out',
            maxWidth: '320px',
            wordWrap: 'break-word'
        });

        // Add animation keyframes if not already added
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes slideOut {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Input validation and feedback
    const inputs = document.querySelectorAll('.form-input');
    inputs.forEach(input => {
        // Add focus effect
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
            
            // Basic validation on blur
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.style.borderColor = 'var(--error)';
            } else {
                this.style.borderColor = '';
            }
        });

        // Clear error state on input
        input.addEventListener('input', function() {
            this.style.borderColor = '';
        });
    });

    // Keyboard accessibility for password toggle
    if (togglePassword) {
        togglePassword.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    }

    // Detect system theme changes
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkModeMediaQuery.addEventListener('change', (e) => {
        console.log(`Theme changed to: ${e.matches ? 'dark' : 'light'} mode`);
        // You can add additional logic here if needed
    });

    // Log initial theme
    console.log(`Initial theme: ${darkModeMediaQuery.matches ? 'dark' : 'light'} mode`);

    // Prevent form submission on Enter in input fields (optional)
    // Uncomment if you want to prevent accidental submissions
    /*
    inputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && this.type !== 'submit') {
                e.preventDefault();
                // Move to next input or submit if last
                const form = this.closest('form');
                const inputs = Array.from(form.querySelectorAll('input:not([type="checkbox"])'));
                const index = inputs.indexOf(this);
                if (index < inputs.length - 1) {
                    inputs[index + 1].focus();
                } else {
                    form.requestSubmit();
                }
            }
        });
    });
    */
});

// Add smooth scroll behavior for better UX
document.documentElement.style.scrollBehavior = 'smooth';

// Console welcome message
console.log('%c🔐 Modern Login Page', 'font-size: 20px; font-weight: bold; color: #3b82f6;');
console.log('%cFeatures:', 'font-size: 14px; font-weight: bold; color: #10b981;');
console.log('✓ Responsive design (mobile, tablet, desktop)');
console.log('✓ Light/Dark mode support');
console.log('✓ Password visibility toggle');
console.log('✓ Form validation');
console.log('✓ Accessibility features');
console.log('✓ Social login buttons');
console.log('✓ Smooth animations');
