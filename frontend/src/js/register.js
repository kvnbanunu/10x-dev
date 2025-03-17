import { authService } from './api.js';
import { validatePassword, showError, hideMessage } from './auth.js';
import { redirect } from './redirect.js';

const registerForm = document.getElementById('register-form');
const registerButton = document.getElementById('register-button');

if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    
    hideMessage('error-message');
    
    const passwordError = validatePassword(password, passwordConfirm);
    if (passwordError) {
      showError(passwordError);
      return;
    }
    
    registerButton.disabled = true;
    registerButton.textContent = 'Registering...';
    
    try {
      await authService.register(email, username, password);
      
      redirect('/login.html?registered=true');
    } catch (error) {
      const errorText = error.response?.data?.error || 'Registration failed';
      showError(errorText);
      
      registerButton.disabled = false;
      registerButton.textContent = 'Register';
    }
  });
}
