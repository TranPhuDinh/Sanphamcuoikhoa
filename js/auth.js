// User authentication functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const username = localStorage.getItem('username');
    
    // UI Elements
    const loginBtn = document.getElementById('loginBtn');
    const userDisplayArea = document.getElementById('userDisplayArea');
    const usernameDisplay = document.getElementById('usernameDisplay');
    const logoutBtn = document.getElementById('logoutBtn');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    // Update UI based on login status
    if (isLoggedIn && loginBtn && userDisplayArea) {
        loginBtn.classList.add('d-none');
        userDisplayArea.classList.remove('d-none');
        if (usernameDisplay) {
            usernameDisplay.textContent = username || 'User';
        }
    }
    
    // Handle logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.setItem('isLoggedIn', 'false');
            localStorage.removeItem('username');
            
            // Redirect to homepage after logout
            window.location.href = '../index.html';
        });
    }
    
    // Redirect to login if trying to checkout while not logged in
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function(e) {
            if (!isLoggedIn) {
                e.preventDefault();
                alert('Vui lòng đăng nhập trước khi thanh toán');
                window.location.href = './login.html';
                return false;
            }
        });
    }
});

// Function to simulate login (to be called from login page)
function login(username, password) {
    // Simple validation
    if (!username || !password) {
        alert('Vui lòng điền đầy đủ thông tin');
        return false;
    }
    
    // In a real app, this would validate against a backend
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('username', username);
    
    // Redirect to previous page or home
    const returnUrl = new URLSearchParams(window.location.search).get('returnUrl') || '../index.html';
    window.location.href = returnUrl;
    return true;
}