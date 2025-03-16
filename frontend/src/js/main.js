import { checkAuth, handleLogout, saveUserData, updateRequestCount, showError } from './auth.js';
import { chatService } from './api.js';
import hljs from 'highlight.js';

const usernameElement = document.getElementById('username');
const requestCountElement = document.getElementById('request-count');
const adminButton = document.getElementById('admin-button');
const logoutButton = document.getElementById('logout-button');
const generateForm = document.getElementById('generate-form');
const generateButton = document.getElementById('generate-button');
const codeOutput = document.getElementById('code-output');
const codeDisplay = document.getElementById('code-display');
const copyButton = document.getElementById('copy-button');
const errorMessage = document.getElementById('error-message');
const warningMessage = document.getElementById('warning-message');
const dismissWarning = document.getElementById('dismiss-warning');

// track if user has hit request limit
let warningShown = false;

const init = async () => {
  try {
    const userData = await checkAuth();
    
    if (userData) {
      saveUserData(userData);
      displayUserInfo(userData);
      checkWarningThreshold(userData.requestCount);
    }
  } catch (error) {
    console.error('Initialization error:', error);
  }
};

const displayUserInfo = (userData) => {
  usernameElement.textContent = userData.user.username;
  requestCountElement.textContent = userData.requestCount;
  
  // admins only
  if (userData.user.isAdmin) {
    adminButton.style.display = 'inline-block';
  }
};

const checkWarningThreshold = (count) => {
  if (count >= 20 && !warningShown) {
    warningMessage.style.display = 'flex';
    warningShown = true;
  }
};

//---- event listeners ----

if (logoutButton) {
  logoutButton.addEventListener('click', handleLogout);
}

if (adminButton) {
  adminButton.addEventListener('click', () => {
    window.location.href = '/admin.html';
  });
}

if (dismissWarning) {
  dismissWarning.addEventListener('click', () => {
    warningMessage.style.display = 'none';
  });
}

if (generateForm) {
  generateForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const program = document.getElementById('program').value.trim();
    const language = document.getElementById('language').value.trim();
    
    // show loading and diable button
    generateButton.disabled = true;
    generateButton.textContent = 'Generating...';
    errorMessage.style.display = 'none';
    
    try {
      const response = await chatService.generateCode(program, language);
      
      codeDisplay.textContent = response.data.code;
      
      // this package highlights the syntax
      hljs.highlightElement(codeDisplay);
      
      codeOutput.style.display = 'block';
      
      const newCount = updateRequestCount(response.data.requestCount);
      requestCountElement.textContent = newCount;
      
      checkWarningThreshold(newCount);
    } catch (error) {
      const errorText = error.response?.data?.error || 'Failed to generate code';
      showError(errorText);
    } finally {
      generateButton.disabled = false;
      generateButton.textContent = 'Generate Obfuscated Code';
    }
  });
}

// copy code to clipboard
if (copyButton) {
  copyButton.addEventListener('click', () => {
    navigator.clipboard.writeText(codeDisplay.textContent)
      .then(() => {
        const originalText = copyButton.textContent;
        copyButton.textContent = 'Copied!';
        setTimeout(() => {
          copyButton.textContent = originalText;
        }, 2000);
      })
      .catch((error) => {
        console.error('Failed to copy text:', error);
      });
  });
}

document.addEventListener('DOMContentLoaded', init);
