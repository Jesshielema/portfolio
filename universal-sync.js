// Universal Cross-Platform Sync Solution
// Works on ALL hosting platforms: Netlify, Vercel, GitHub Pages, etc.

class UniversalSync {
  constructor() {
    this.platform = this.detectPlatform();
    this.syncMethods = [];
    this.pollInterval = null;
    this.lastSync = 0;
    
    console.log('🌍 Universal Sync initialized for platform:', this.platform);
    this.initializeSyncMethods();
    this.startUniversalSync();
  }
  
  detectPlatform() {
    const hostname = window.location.hostname;
    
    if (hostname.includes('netlify')) return 'netlify';
    if (hostname.includes('vercel')) return 'vercel';
    if (hostname.includes('github.io')) return 'github-pages';
    if (hostname.includes('surge.sh')) return 'surge';
    if (hostname.includes('firebase')) return 'firebase';
    if (hostname === 'localhost' || hostname === '127.0.0.1') return 'localhost';
    
    return 'unknown';
  }
  
  initializeSyncMethods() {
    // Method 1: localStorage polling (works everywhere)
    this.syncMethods.push({
      name: 'localStorage-polling',
      active: true,
      check: () => this.checkLocalStorageUpdates()
    });
    
    // Method 2: sessionStorage backup
    this.syncMethods.push({
      name: 'sessionStorage-backup',
      active: typeof sessionStorage !== 'undefined',
      check: () => this.checkSessionStorageUpdates()
    });
    
    // Method 3: Custom events
    this.syncMethods.push({
      name: 'custom-events',
      active: true,
      check: () => this.checkCustomEvents()
    });
    
    // Method 4: URL hash changes
    this.syncMethods.push({
      name: 'hash-sync',
      active: true,
      check: () => this.checkHashUpdates()
    });
    
    console.log('🔧 Sync methods initialized:', this.syncMethods.filter(m => m.active).map(m => m.name));
  }
  
  startUniversalSync() {
    // Aggressive polling - check every 500ms for updates
    this.pollInterval = setInterval(() => {
      this.runAllSyncChecks();
    }, 500);
    
    // Setup event listeners
    this.setupEventListeners();
    
    console.log('🔄 Universal sync started with 500ms polling');
  }
  
  runAllSyncChecks() {
    this.syncMethods
      .filter(method => method.active)
      .forEach(method => {
        try {
          method.check();
        } catch (e) {
          console.warn(`⚠️ Sync method ${method.name} failed:`, e);
        }
      });
  }
  
  checkLocalStorageUpdates() {
    const storage = window.safeStorage || localStorage;
    
    const updateKeys = [
      'portfolioUpdated',
      'newPostAdded',
      'lastPortfolioUpdate',
      'netlifyForceUpdate',
      'universalSyncTrigger'
    ];
    
    let hasUpdate = false;
    let latestTimestamp = 0;
    
    updateKeys.forEach(key => {
      const value = storage.getItem(key);
      if (value) {
        const timestamp = parseInt(value) || Date.now();
        if (timestamp > this.lastSync) {
          hasUpdate = true;
          latestTimestamp = Math.max(latestTimestamp, timestamp);
        }
      }
    });
    
    if (hasUpdate) {
      console.log('🔄 Universal sync: localStorage update detected');
      this.triggerPortfolioRefresh();
      this.lastSync = latestTimestamp;
    }
  }
  
  checkSessionStorageUpdates() {
    try {
      const value = sessionStorage.getItem('portfolioNeedsUpdate');
      if (value && parseInt(value) > this.lastSync) {
        console.log('🔄 Universal sync: sessionStorage update detected');
        this.triggerPortfolioRefresh();
        this.lastSync = parseInt(value);
      }
    } catch (e) {
      // sessionStorage not available
    }
  }
  
  checkCustomEvents() {
    // This will be triggered by admin panel
    if (window.portfolioUpdateFlag && window.portfolioUpdateFlag > this.lastSync) {
      console.log('🔄 Universal sync: custom event detected');
      this.triggerPortfolioRefresh();
      this.lastSync = window.portfolioUpdateFlag;
    }
  }
  
  checkHashUpdates() {
    // Check for hash-based updates
    const hash = window.location.hash;
    if (hash.includes('#portfolio-updated-')) {
      const timestamp = parseInt(hash.replace('#portfolio-updated-', ''));
      if (timestamp > this.lastSync) {
        console.log('🔄 Universal sync: hash update detected');
        this.triggerPortfolioRefresh();
        this.lastSync = timestamp;
        // Clean up hash
        window.location.hash = '';
      }
    }
  }
  
  setupEventListeners() {
    // Storage events
    window.addEventListener('storage', (e) => {
      if (e.key && (e.key.includes('portfolio') || e.key.includes('sync'))) {
        console.log('📡 Storage event:', e.key);
        setTimeout(() => this.runAllSyncChecks(), 100);
      }
    });
    
    // Focus events
    window.addEventListener('focus', () => {
      console.log('👁️ Window focused, checking for updates...');
      setTimeout(() => this.runAllSyncChecks(), 200);
    });
    
    // Visibility change
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        console.log('👁️ Page visible, checking for updates...');
        setTimeout(() => this.runAllSyncChecks(), 300);
      }
    });
    
    // Message events for cross-tab communication
    window.addEventListener('message', (e) => {
      if (e.data && e.data.type === 'PORTFOLIO_UPDATED') {
        console.log('📨 Cross-tab message received');
        this.triggerPortfolioRefresh();
      }
    });
  }
  
  triggerPortfolioRefresh() {
    if (typeof loadPosts === 'function') {
      loadPosts();
      
      if (typeof renderFeed === 'function') {
        renderFeed();
      }
      
      if (typeof updateHeroSection === 'function') {
        updateHeroSection();
      }
      
      console.log('✅ Portfolio refreshed via universal sync');
      
      // Clear update flags
      this.clearUpdateFlags();
    }
  }
  
  clearUpdateFlags() {
    const storage = window.safeStorage || localStorage;
    
    const flagsToClear = [
      'newPostAdded',
      'portfolioUpdated',
      'universalSyncTrigger'
    ];
    
    flagsToClear.forEach(flag => {
      storage.removeItem(flag);
    });
    
    // Clear custom flag
    window.portfolioUpdateFlag = 0;
  }
  
  // Method for admin panel to signal updates
  signalUpdate() {
    const timestamp = Date.now();
    const storage = window.safeStorage || localStorage;
    
    // Set multiple signals for maximum compatibility
    storage.setItem('universalSyncTrigger', timestamp.toString());
    storage.setItem('lastPortfolioUpdate', timestamp.toString());
    storage.setItem('portfolioUpdated', timestamp.toString());
    storage.setItem('newPostAdded', 'true');
    
    // sessionStorage backup
    try {
      sessionStorage.setItem('portfolioNeedsUpdate', timestamp.toString());
    } catch (e) {}
    
    // Custom event flag
    window.portfolioUpdateFlag = timestamp;
    
    // Hash method
    window.location.hash = `#portfolio-updated-${timestamp}`;
    setTimeout(() => {
      window.location.hash = '';
    }, 1000);
    
    // PostMessage for cross-tab
    try {
      window.postMessage({
        type: 'PORTFOLIO_UPDATED',
        timestamp: timestamp,
        platform: this.platform
      }, '*');
    } catch (e) {}
    
    console.log('📡 Universal sync signals sent:', timestamp);
  }
  
  // Force manual update
  forceUpdate() {
    console.log('🔄 Universal force update triggered');
    this.triggerPortfolioRefresh();
  }
  
  // Get sync status
  getStatus() {
    return {
      platform: this.platform,
      activeMethods: this.syncMethods.filter(m => m.active).map(m => m.name),
      lastSync: this.lastSync,
      isRunning: !!this.pollInterval
    };
  }
  
  stop() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
      console.log('⏹️ Universal sync stopped');
    }
  }
}

// Initialize universal sync
const universalSync = new UniversalSync();

// Make available globally
window.universalSync = universalSync;

// Expose debug functions
window.universalDebug = {
  forceUpdate: () => universalSync.forceUpdate(),
  signalUpdate: () => universalSync.signalUpdate(),
  getStatus: () => universalSync.getStatus(),
  checkUpdates: () => universalSync.runAllSyncChecks()
};

console.log('🌍 Universal sync loaded. Debug: window.universalDebug.getStatus()');
console.log('Platform detected:', universalSync.platform);
