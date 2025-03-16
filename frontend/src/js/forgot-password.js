import { authService } from './api.js';
import { showError, showSuccess, hideMessage } from './auth.js';

const forgotPasswordForm = document.getElementById('forgot-password-form');
const resetButton = document.getElementById('reset-button');

if (forgotPasswordForm) {
  forgotPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    
    hideMessage('error-message');
    hideMessage('success-message');
    
    resetButton.disabled = true;
    resetButton.textContent = 'Sending...';
    
    try {
      await authService.requestPasswordReset(email);
      
      showSuccess('If your email is registered, you will receive a password reset link shortly.');
      
      forgotPasswordForm.reset();
    } catch (error) {
      const errorText = error.response?.data?.error || 'Request failed';
      showError(errorText);
    } finally {
      resetButton.disabled = false;
      resetButton.textContent = 'Send Reset Link';
    }
  });
}
