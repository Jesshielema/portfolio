// Netlify-Specific Sync Solution
// This handles the cross-tab sync issues on Netlify hosting

class NetlifySync {
  constructor() {
    this.storageKey = 'netlify_portfolio_sync';
    this.lastSync = 0;
    this.pollInterval = null;
    
    console.log('🌐 Netlify Sync initialized');
    this.startNetlifyPolling();
    this.setupNetlifyEventHandlers();
  }
  
  // Netlify-specific polling mechanism
  startNetlifyPolling() {
    // Poll every 1 second for updates on Netlify
    this.pollInterval = setInterval(() => {
      this.checkNetlifyUpdates();
    }, 1000);
    
    console.log('🔄 Netlify polling started');
  }
  
  checkNetlifyUpdates() {
    try {
      const storage = window.safeStorage || localStorage;
      
      // Check for multiple update signals
      const signals = [
        'portfolioUpdated',
        'newPostAdded', 
        'lastPortfolioUpdate',
        'netlifyForceUpdate'
      ];
      
      let hasUpdate = false;
      let latestTimestamp = 0;
      
      signals.forEach(signal => {
        const value = storage.getItem(signal);
        if (value) {
          const timestamp = parseInt(value) || Date.now();
          if (timestamp > this.lastSync) {
            hasUpdate = true;
            latestTimestamp = Math.max(latestTimestamp, timestamp);
          }
        }
      });
      
      if (hasUpdate) {
        console.log('🔄 Netlify update detected, refreshing portfolio...');
        this.triggerNetlifyRefresh();
        this.lastSync = latestTimestamp;
      }
      
    } catch (e) {
      console.error('❌ Netlify sync check failed:', e);
    }
  }
  
  triggerNetlifyRefresh() {
    // Force refresh the portfolio
    if (typeof loadPosts === 'function') {
      loadPosts();
      
      if (typeof renderFeed === 'function') {
        renderFeed();
      }
      
      if (typeof updateHeroSection === 'function') {
        updateHeroSection();
      }
      
      console.log('✅ Netlify portfolio refreshed');
      
      // Clear update flags after successful refresh
      this.clearUpdateFlags();
    }
  }
  
  clearUpdateFlags() {
    const storage = window.safeStorage || localStorage;
    const flagsToClear = [
      'newPostAdded',
      'portfolioUpdated', 
      'netlifyForceUpdate'
    ];
    
    flagsToClear.forEach(flag => {
      storage.removeItem(flag);
    });
  }
  
  // Enhanced event handlers for Netlify
  setupNetlifyEventHandlers() {
    // Page visibility change
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        console.log('👁️ Page visible, checking for Netlify updates...');
        setTimeout(() => {
          this.checkNetlifyUpdates();
        }, 500);
      }
    });
    
    // Window focus
    window.addEventListener('focus', () => {
      console.log('🎯 Window focused, checking for Netlify updates...');
      setTimeout(() => {
        this.checkNetlifyUpdates();
      }, 300);
    });
    
    // Page load
    window.addEventListener('load', () => {
      console.log('📄 Page loaded, initial Netlify check...');
      setTimeout(() => {
        this.checkNetlifyUpdates();
      }, 1000);
    });
    
    // Storage events (might work on some browsers)
    window.addEventListener('storage', (e) => {
      if (e.key && (e.key.includes('portfolio') || e.key.includes('netlify'))) {
        console.log('📡 Storage event detected:', e.key);
        setTimeout(() => {
          this.checkNetlifyUpdates();
        }, 100);
      }
    });
  }
  
  // Force update method for manual testing
  forceUpdate() {
    console.log('🔄 Force update triggered');
    this.triggerNetlifyRefresh();
  }
  
  // Method for admin panel to signal updates
  signalUpdate() {
    const timestamp = Date.now().toString();
    const storage = window.safeStorage || localStorage;
    
    storage.setItem('netlifyForceUpdate', timestamp);
    storage.setItem('lastPortfolioUpdate', timestamp);
    storage.setItem('portfolioUpdated', timestamp);
    
    console.log('📡 Netlify update signal sent:', timestamp);
  }
  
  stopPolling() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
      console.log('⏹️ Netlify polling stopped');
    }
  }
}

// Initialize Netlify sync only if on Netlify domain
const isNetlify = window.location.hostname.includes('netlify.app') || 
                  window.location.hostname.includes('netlify.com');

let netlifySync = null;

if (isNetlify) {
  netlifySync = new NetlifySync();
  console.log('🌐 Netlify sync active for domain:', window.location.hostname);
} else {
  console.log('ℹ️ Not on Netlify, using standard sync');
}

// Make available globally
window.netlifySync = netlifySync;

// Expose debug functions
window.netlifyDebug = {
  forceUpdate: () => netlifySync && netlifySync.forceUpdate(),
  signalUpdate: () => netlifySync && netlifySync.signalUpdate(),
  checkUpdates: () => netlifySync && netlifySync.checkNetlifyUpdates()
};

console.log('💡 Netlify debug available: window.netlifyDebug.forceUpdate()');
