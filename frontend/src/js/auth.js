import { authService } from './api.js';
import { redirect } from './redirect.js';

// checks if user is logged in
export const checkAuth = async () => {
  try {
    const response = await authService.getUserInfo();
    return response.data;
  } catch (error) {
    // redirect to login
    if (error.response && error.response.status === 401) {
      console.log(error.response);
      console.log(error.response.error);
      redirect('/login.html');
    }
    return null;
  }
};

export const checkAdmin = async () => {
  try {
    const userData = await checkAuth();
    
    if (!userData || !userData.user.isAdmin) {
      redirect('/index.html');
      return false;
    }
    
    return userData;
  } catch (error) {
    redirect('/login.html');
    return false;
  }
};

export const handleLogout = async () => {
  try {
    await authService.logout();
    redirect('/login.html');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

export const saveUserData = (userData) => {
  sessionStorage.setItem('user', JSON.stringify(userData.user));
  sessionStorage.setItem('reqCount', userData.reqCount?.toString() || '0');
};

export const getUserData = () => {
  const user = JSON.parse(sessionStorage.getItem('user') || 'null');
  const reqCount = parseInt(sessionStorage.getItem('reqCount') || '0', 10);
  
  return { user, reqCount };
};

export const updateRequestCount = (count) => {
  sessionStorage.setItem('reqCount', count.toString());
  return count;
};

export const clearUserData = () => {
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('reqCount');
};

export const validatePassword = (password, confirmPassword) => {
  if (password.length < 3) {
    return 'Password must be at least 3 characters long';
  }
  
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  
  return null;
};

export const showError = (message, elementId = 'error-message') => {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    
    // Scroll to error message
    errorElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
};

export const showSuccess = (message, elementId = 'success-message') => {
  const successElement = document.getElementById(elementId);
  if (successElement) {
    successElement.textContent = message;
    successElement.style.display = 'block';
    
    successElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
};

export const hideMessage = (elementId) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.style.display = 'none';
  }
};
