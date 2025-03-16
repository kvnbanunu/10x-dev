import { checkAdmin, showError, showSuccess } from './auth.js';
import { adminService } from './api.js';

const usersTable = document.getElementById('users-table');
const requestsTable = document.getElementById('requests-table');
const editModal = document.getElementById('edit-modal');
const editUserForm = document.getElementById('edit-user-form');
const closeModalButton = document.querySelector('.close');

let currentUser = null;

const init = async () => {
  try {
    // Check if user is admin
    const userData = await checkAdmin();
    
    if (userData) {
      currentUser = userData.user;
      loadDatabaseData();
    }
  } catch (error) {
    console.error('Admin initialization error:', error);
  }
};

const loadDatabaseData = async () => {
  try {
    // Get database data
    const response = await adminService.getDatabaseEntries();
    const { users, requests } = response.data;
    
    // Populate users table
    populateUsersTable(users);
    
    // Populate requests table
    populateRequestsTable(requests);
  } catch (error) {
    showError('Failed to load database data');
  }
};

const populateUsersTable = (users) => {
  const tbody = usersTable.querySelector('tbody');
  tbody.innerHTML = '';
  
  if (users.length === 0) {
    const row = document.createElement('tr');
    row.innerHTML = '<td colspan="5">No users found</td>';
    tbody.appendChild(row);
    return;
  }
  
  users.forEach(user => {
    const row = document.createElement('tr');
    
    row.innerHTML = `
      <td class="px-4 py-2">${user.id}</td>
      <td class="px-4 py-2">${user.email}</td>
      <td class="px-4 py-2">${user.username}</td>
      <td class="px-4 py-2">${user.is_admin === 1 ? 'Yes' : 'No'}</td>
      <td class="px-4 py-2 text-right space-x-2">
        <button class="px-2 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 edit-button" data-id="${user.id}" 
          ${user.id === currentUser.id ? 'disabled' : ''}>Edit</button>
        <button class="px-2 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 delete-button" data-id="${user.id}"
          ${user.id === currentUser.id ? 'disabled' : ''}>Delete</button>
      </td>
    `;

    tbody.appendChild(row);
  });
  
  // Add event listeners to edit buttons
  const editButtons = document.querySelectorAll('.edit-button');
  editButtons.forEach(button => {
    button.addEventListener('click', () => {
      const userId = parseInt(button.getAttribute('data-id'), 10);
      const user = users.find(u => u.id === userId);
      if (user) {
        openEditModal(user);
      }
    });
  });
  
  // Add event listeners to delete buttons
  const deleteButtons = document.querySelectorAll('.delete-button');
  deleteButtons.forEach(button => {
    button.addEventListener('click', async () => {
      const userId = parseInt(button.getAttribute('data-id'), 10);
      if (confirm('Are you sure you want to delete this user?')) {
        await deleteUser(userId);
      }
    });
  });
};

// Populate requests table
const populateRequestsTable = (requests) => {
  const tbody = requestsTable.querySelector('tbody');
  tbody.innerHTML = '';
  
  if (requests.length === 0) {
    const row = document.createElement('tr');
    row.innerHTML = '<td colspan="4">No requests found</td>';
    tbody.appendChild(row);
    return;
  }
  
  requests.forEach(request => {
    const row = document.createElement('tr');
    const date = new Date(request.timestamp * 1000).toLocaleString();
    
    row.innerHTML = `
      <td class="px-4 py-2">${request.id}</td>
      <td class="px-4 py-2">${request.user_id}</td>
      <td class="px-4 py-2">${request.prompt}</td>
      <td class="px-4 py-2">${date}</td>
    `;

    tbody.appendChild(row);
  });
};

const openEditModal = (user) => {
  document.getElementById('edit-user-id').value = user.id;
  document.getElementById('edit-email').value = user.email;
  document.getElementById('edit-username').value = user.username;
  document.getElementById('edit-admin').checked = user.is_admin === 1;
  
  editModal.style.display = 'flex';
};

const closeEditModal = () => {
  editModal.style.display = 'none';
};

const deleteUser = async (userId) => {
  try {
    await adminService.deleteUser(userId);
    showSuccess('User deleted successfully');
    loadDatabaseData();
  } catch (error) {
    showError('Failed to delete user');
  }
};

const updateUser = async (userId, userData) => {
  try {
    await adminService.updateUser(userId, userData);
    showSuccess('User updated successfully');
    loadDatabaseData();
    closeEditModal();
  } catch (error) {
    showError('Failed to update user');
  }
};

if (closeModalButton) {
  closeModalButton.addEventListener('click', closeEditModal);
}

// close when click out of the wmodal
window.addEventListener('click', (e) => {
  if (e.target === editModal) {
    closeEditModal();
  }
});

if (editUserForm) {
  editUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const userId = parseInt(document.getElementById('edit-user-id').value, 10);
    const email = document.getElementById('edit-email').value.trim();
    const username = document.getElementById('edit-username').value.trim();
    const isAdmin = document.getElementById('edit-admin').checked ? 1 : 0;
    
    await updateUser(userId, { email, username, isAdmin });
  });
}

document.addEventListener('DOMContentLoaded', init);
