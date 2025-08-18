// Online Debug Script - Add this to check what's happening online
console.log('=== ONLINE DEBUG SCRIPT ===');

// Check localStorage availability
function checkLocalStorage() {
  try {
    const test = 'test';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    console.log('✅ localStorage available');
    return true;
  } catch (e) {
    console.error('❌ localStorage not available:', e);
    return false;
  }
}

// Check sessionStorage availability  
function checkSessionStorage() {
  try {
    const test = 'test';
    sessionStorage.setItem(test, test);
    sessionStorage.removeItem(test);
    console.log('✅ sessionStorage available');
    return true;
  } catch (e) {
    console.error('❌ sessionStorage not available:', e);
    return false;
  }
}

// Check current storage data
function checkStorageData() {
  console.log('=== CURRENT STORAGE DATA ===');
  try {
    const portfolioPosts = localStorage.getItem('portfolioPosts');
    console.log('portfolioPosts:', portfolioPosts ? JSON.parse(portfolioPosts) : 'null');
    
    const deletedPosts = localStorage.getItem('deletedDefaultPosts');
    console.log('deletedDefaultPosts:', deletedPosts ? JSON.parse(deletedPosts) : 'null');
    
    const newPostAdded = localStorage.getItem('newPostAdded');
    console.log('newPostAdded:', newPostAdded);
    
    const portfolioUpdated = localStorage.getItem('portfolioUpdated');
    console.log('portfolioUpdated:', portfolioUpdated);
  } catch (e) {
    console.error('Error reading storage:', e);
  }
}

// Check if admin panel exists and is accessible
function checkAdminPanel() {
  console.log('=== ADMIN PANEL CHECK ===');
  
  // Check if we're on admin page
  if (window.location.href.includes('admin.html')) {
    console.log('✅ On admin page');
    
    // Check if upload form exists
    const uploadForm = document.getElementById('postForm');
    console.log('Upload form exists:', !!uploadForm);
    
    // Check if hardcoded posts section exists
    const hardcodedSection = document.getElementById('hardcodedPostsSection');
    console.log('Hardcoded posts section exists:', !!hardcodedSection);
    
  } else {
    console.log('Not on admin page, current URL:', window.location.href);
  }
}

// Check if main portfolio loads correctly
function checkMainPortfolio() {
  console.log('=== MAIN PORTFOLIO CHECK ===');
  
  // Check if posts container exists
  const postsContainer = document.getElementById('postsContainer');
  console.log('Posts container exists:', !!postsContainer);
  
  if (postsContainer) {
    console.log('Posts container children:', postsContainer.children.length);
  }
  
  // Check if loadPosts function exists
  console.log('loadPosts function exists:', typeof loadPosts !== 'undefined');
  
  // Check if renderFeed function exists  
  console.log('renderFeed function exists:', typeof renderFeed !== 'undefined');
}

// Check for JavaScript errors
function setupErrorLogging() {
  console.log('=== ERROR LOGGING SETUP ===');
  
  window.addEventListener('error', function(e) {
    console.error('🚨 JavaScript Error:', {
      message: e.message,
      filename: e.filename,
      lineno: e.lineno,
      colno: e.colno,
      error: e.error
    });
  });
  
  window.addEventListener('unhandledrejection', function(e) {
    console.error('🚨 Unhandled Promise Rejection:', e.reason);
  });
}

// Run all checks
function runAllChecks() {
  console.log('🔍 Starting Online Debug Checks...');
  
  setupErrorLogging();
  checkLocalStorage();
  checkSessionStorage();
  checkStorageData();
  checkAdminPanel();
  checkMainPortfolio();
  
  console.log('🔍 Debug checks complete');
}

// Auto-run on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runAllChecks);
} else {
  runAllChecks();
}

// Make functions globally available for manual testing
window.debugOnline = {
  checkLocalStorage,
  checkSessionStorage,
  checkStorageData,
  checkAdminPanel,
  checkMainPortfolio,
  runAllChecks
};

console.log('💡 Use window.debugOnline.runAllChecks() to manually run diagnostics');
