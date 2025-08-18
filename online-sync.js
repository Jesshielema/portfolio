// Alternative Sync Method for Online Hosting
// This provides additional fallback methods when localStorage events don't work

class OnlineSync {
  constructor() {
    this.syncInterval = null;
    this.lastCheck = 0;
    this.isOnline = this.detectOnlineEnvironment();
    
    console.log('OnlineSync initialized, detected online environment:', this.isOnline);
    
    if (this.isOnline) {
      this.startPeriodicSync();
    }
  }
  
  detectOnlineEnvironment() {
    // Check if we're running on a web server vs file://
    return window.location.protocol === 'http:' || window.location.protocol === 'https:';
  }
  
  startPeriodicSync() {
    // Check for updates every 2 seconds when online
    this.syncInterval = setInterval(() => {
      this.checkForUpdates();
    }, 2000);
    
    console.log('🔄 Periodic sync started for online environment');
  }
  
  stopPeriodicSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }
  
  checkForUpdates() {
    try {
      const storage = window.safeStorage || localStorage;
      const lastUpdate = storage.getItem('lastPortfolioUpdate');
      
      if (lastUpdate && parseInt(lastUpdate) > this.lastCheck) {
        console.log('🔄 Online sync detected update, refreshing...');
        this.lastCheck = parseInt(lastUpdate);
        
        // Trigger portfolio reload
        if (typeof loadPosts === 'function' && typeof renderFeed === 'function') {
          loadPosts();
          renderFeed();
          
          if (typeof updateHeroSection === 'function') {
            updateHeroSection();
          }
          
          console.log('✅ Portfolio refreshed via online sync');
        }
      }
    } catch (e) {
      console.error('❌ Online sync check failed:', e);
    }
  }
  
  // Manual trigger for immediate sync
  triggerUpdate() {
    console.log('🔄 Manual sync triggered');
    this.checkForUpdates();
  }
  
  // Update the last check timestamp
  updateTimestamp() {
    this.lastCheck = Date.now();
  }
}

// Initialize online sync
const onlineSync = new OnlineSync();

// Make available globally
window.onlineSync = onlineSync;

// Enhanced visibility change handler for online environments
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && onlineSync.isOnline) {
    // Page became visible, check for updates
    setTimeout(() => {
      onlineSync.triggerUpdate();
    }, 500);
  }
});

// Enhanced focus handler
window.addEventListener('focus', () => {
  if (onlineSync.isOnline) {
    setTimeout(() => {
      onlineSync.triggerUpdate();
    }, 300);
  }
});

console.log('💡 Online sync utilities loaded. Use window.onlineSync.triggerUpdate() for manual sync');
