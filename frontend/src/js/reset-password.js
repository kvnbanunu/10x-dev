import { authService } from './api.js';
import { validatePassword, showError, showSuccess, hideMessage } from './auth.js';

const resetPasswordForm = document.getElementById('reset-password-form');
const resetButton = document.getElementById('reset-button');
const tokenInput = document.getElementById('token');

const searchParams = new URLSearchParams(window.location.search);
const token = searchParams.get('token');

if (tokenInput && token) {
  tokenInput.value = token;
} else if (!token) {
  window.location.href = '/forgot-password.html';
}

if (resetPasswordForm) {
  resetPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const token = tokenInput.value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    
    hideMessage('error-message');
    hideMessage('success-message');
    
    const passwordError = validatePassword(password, passwordConfirm);
    if (passwordError) {
      showError(passwordError);
      return;
    }
    
    resetButton.disabled = true;
    resetButton.textContent = 'Resetting...';
    
    try {
      await authService.resetPassword(token, password);
      
      showSuccess('Password reset successful. You can now login with your new password.');
      
      resetPasswordForm.reset();
      
      setTimeout(() => {
        window.location.href = '/login.html';
      }, 3000);
    } catch (error) {
      const errorText = error.response?.data?.error || 'Password reset failed';
      showError(errorText);
      
      resetButton.disabled = false;
      resetButton.textContent = 'Reset Password';
    }
  });
}
