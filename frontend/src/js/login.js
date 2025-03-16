import { authService } from './api.js';
import { saveUserData, showError, showSuccess, hideMessage } from './auth.js';

const loginForm = document.getElementById('login-form');
const loginButton = document.getElementById('login-button');

const searchParams = new URLSearchParams(window.location.search);
if (searchParams.get('registered') === 'true') {
  showSuccess('Registration successful. You can now log in.');
}

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    hideMessage('error-message');
    hideMessage('success-message');
    
    loginButton.disabled = true;
    loginButton.textContent = 'Logging in...';
    
    try {
      const response = await authService.login(email, password);
      
      saveUserData(response.data);
      
      // redirect to home
      window.location.href = '/index.html';
    } catch (error) {
      const errorText = error.response?.data?.error || 'Login failed';
      showError(errorText);
      
      loginButton.disabled = false;
      loginButton.textContent = 'Login';
    }
  });
}
