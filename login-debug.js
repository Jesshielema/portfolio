// Admin Login Debug & Reset Tool
// Voor wanneer login problemen optreden

function debugLogin() {
  console.log('🔑 Login Debug Started');
  
  // Check password
  const currentPassword = 'JesseDesign2024!';
  console.log('📝 Expected password:', currentPassword);
  
  // Check storage
  const loginStatus = localStorage.getItem('adminLoggedIn');
  const loginStatusSafe = window.onlineStorage ? window.onlineStorage.getItem('adminLoggedIn') : null;
  
  console.log('🔐 Login status (localStorage):', loginStatus);
  console.log('🔐 Login status (onlineStorage):', loginStatusSafe);
  
  // Check form elements
  const loginForm = document.getElementById('loginForm');
  const passwordInput = document.getElementById('passwordInput');
  const errorMessage = document.getElementById('errorMessage');
  
  console.log('📋 Login form exists:', !!loginForm);
  console.log('📋 Password input exists:', !!passwordInput);
  console.log('📋 Error message exists:', !!errorMessage);
  
  return {
    expectedPassword: currentPassword,
    loginStatus: loginStatus,
    loginStatusSafe: loginStatusSafe,
    formExists: !!loginForm,
    inputExists: !!passwordInput
  };
}

function resetLogin() {
  console.log('🔄 Resetting login...');
  
  try {
    // Clear all login data
    localStorage.removeItem('adminLoggedIn');
    if (window.onlineStorage) {
      window.onlineStorage.removeItem('adminLoggedIn');
    }
    
    // Reset form
    const passwordInput = document.getElementById('passwordInput');
    const errorMessage = document.getElementById('errorMessage');
    
    if (passwordInput) {
      passwordInput.value = '';
    }
    
    if (errorMessage) {
      errorMessage.style.display = 'none';
    }
    
    // Show login, hide admin
    const loginContainer = document.getElementById('loginContainer');
    const adminContainer = document.getElementById('adminContainer');
    
    if (loginContainer) {
      loginContainer.style.display = 'block';
    }
    
    if (adminContainer) {
      adminContainer.style.display = 'none';
    }
    
    console.log('✅ Login reset complete');
    alert('🔄 Login reset! Probeer opnieuw in te loggen met: JesseDesign2024!');
    
  } catch (e) {
    console.error('❌ Reset failed:', e);
    alert('❌ Reset failed: ' + e.message);
  }
}

function forceLogin() {
  console.log('🚪 Force login...');
  
  try {
    // Force set login status
    localStorage.setItem('adminLoggedIn', 'true');
    if (window.onlineStorage) {
      window.onlineStorage.setItem('adminLoggedIn', 'true');
    }
    
    // Call showAdmin if it exists
    if (typeof showAdmin === 'function') {
      showAdmin();
      console.log('✅ Force login successful');
      alert('✅ Login bypassed! Je bent nu ingelogd.');
    } else {
      console.log('❌ showAdmin function not found');
      alert('❌ showAdmin functie niet gevonden. Herlaad de pagina.');
    }
    
  } catch (e) {
    console.error('❌ Force login failed:', e);
    alert('❌ Force login failed: ' + e.message);
  }
}

// Add login helper buttons to page
function addLoginHelpers() {
  const loginContainer = document.getElementById('loginContainer');
  if (!loginContainer) return;
  
  const helpersDiv = document.createElement('div');
  helpersDiv.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: rgba(0,0,0,0.8);
    color: white;
    padding: 15px;
    border-radius: 8px;
    font-family: monospace;
    font-size: 12px;
    z-index: 10000;
  `;
  
  helpersDiv.innerHTML = `
    <div style="margin-bottom: 10px;"><strong>🔑 Login Debug</strong></div>
    <button onclick="debugLogin()" style="margin: 2px; padding: 5px; font-size: 10px;">Debug</button>
    <button onclick="resetLogin()" style="margin: 2px; padding: 5px; font-size: 10px;">Reset</button>
    <button onclick="forceLogin()" style="margin: 2px; padding: 5px; font-size: 10px;">Force Login</button>
    <div style="margin-top: 8px; font-size: 10px; color: #ccc;">
      Wachtwoord: <strong>JesseDesign2024!</strong>
    </div>
  `;
  
  document.body.appendChild(helpersDiv);
}

// Make functions global
window.debugLogin = debugLogin;
window.resetLogin = resetLogin;
window.forceLogin = forceLogin;

// Auto-add helpers when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addLoginHelpers);
} else {
  addLoginHelpers();
}

console.log('🔑 Login debug tools loaded. Use: debugLogin(), resetLogin(), forceLogin()');
