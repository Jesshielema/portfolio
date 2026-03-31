/**
 * PORTFOLIO SYNC MODULE
 * Handles cross-platform data synchronization
 * Combines: universal-sync, netlify-sync, online-sync, direct-sync, platform-detector
 */

// === PLATFORM DETECTION ===
function detectPlatform() {
  const hostname = window.location.hostname;
  
  if (hostname.includes('netlify')) return 'netlify';
  if (hostname.includes('vercel')) return 'vercel';
  if (hostname.includes('github.io')) return 'github-pages';
  if (hostname.includes('surge.sh')) return 'surge';
  if (hostname.includes('firebase')) return 'firebase';
  if (hostname === 'localhost' || hostname === '127.0.0.1') return 'localhost';
  
  return 'unknown';
}

function detectOnlineEnvironment() {
  return window.location.protocol === 'http:' || window.location.protocol === 'https:';
}

// === PLATFORM EXPLAINER ===
const platformExplainer = {
  'localhost': {
    platform: 'Local Development',
    color: '#ffc107',
    icon: '🏠',
    message: 'Testing locally. Universal sync active.',
    syncMethods: ['Universal Sync (500ms polling)', 'localStorage', 'sessionStorage'],
  },
  'netlify.app': {
    platform: 'Netlify Hosting',
    color: '#00d4aa',
    icon: '🌐',
    message: 'Deployed on Netlify. All sync methods active.',
    syncMethods: ['Netlify Sync (1s polling)', 'Universal Sync (500ms)', 'localStorage', 'Cross-tab events'],
  },
  'vercel.app': {
    platform: 'Vercel Hosting',
    color: '#000',
    icon: '▲',
    message: 'Deployed on Vercel. Universal sync optimized.',
    syncMethods: ['Universal Sync (500ms polling)', 'localStorage', 'sessionStorage'],
  },
  'github.io': {
    platform: 'GitHub Pages',
    color: '#24292e',
    icon: '🐱',
    message: 'Deployed on GitHub Pages. Universal sync active.',
    syncMethods: ['Universal Sync (500ms polling)', 'localStorage', 'Hash-based sync'],
  }
};

// === UNIVERSAL SYNC CLASS ===
class UniversalSync {
  constructor() {
    this.platform = detectPlatform();
    this.syncMethods = [];
    this.pollInterval = null;
    this.lastSync = 0;
    
    console.log('🌍 Universal Sync initialized for platform:', this.platform);
    this.initializeSyncMethods();
    this.startUniversalSync();
  }
  
  initializeSyncMethods() {
    this.syncMethods.push({
      name: 'localStorage-polling',
      active: true,
      check: () => this.checkLocalStorageUpdates()
    });
    
    this.syncMethods.push({
      name: 'sessionStorage-backup',
      active: typeof sessionStorage !== 'undefined',
      check: () => this.checkSessionStorageUpdates()
    });
    
    this.syncMethods.push({
      name: 'custom-events',
      active: true,
      check: () => this.checkCustomEvents()
    });
    
    this.syncMethods.push({
      name: 'hash-sync',
      active: true,
      check: () => this.checkHashUpdates()
    });
    
    console.log('🔧 Sync methods initialized:', this.syncMethods.filter(m => m.active).map(m => m.name));
  }
  
  startUniversalSync() {
    this.pollInterval = setInterval(() => {
      this.runAllSyncChecks();
    }, 500);
    
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
    if (window.portfolioUpdateFlag && window.portfolioUpdateFlag > this.lastSync) {
      console.log('🔄 Universal sync: custom event detected');
      this.triggerPortfolioRefresh();
      this.lastSync = window.portfolioUpdateFlag;
    }
  }
  
  checkHashUpdates() {
    const hash = window.location.hash;
    if (hash.includes('#portfolio-updated-')) {
      const timestamp = parseInt(hash.replace('#portfolio-updated-', ''));
      if (timestamp > this.lastSync) {
        console.log('🔄 Universal sync: hash update detected');
        this.triggerPortfolioRefresh();
        this.lastSync = timestamp;
        window.location.hash = '';
      }
    }
  }
  
  setupEventListeners() {
    window.addEventListener('storage', (e) => {
      if (e.key && (e.key.includes('portfolio') || e.key.includes('sync'))) {
        console.log('📡 Storage event:', e.key);
        setTimeout(() => this.runAllSyncChecks(), 100);
      }
    });
    
    window.addEventListener('focus', () => {
      console.log('👁️ Window focused, checking for updates...');
      setTimeout(() => this.runAllSyncChecks(), 200);
    });
    
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        console.log('👁️ Page visible, checking for updates...');
        setTimeout(() => this.runAllSyncChecks(), 300);
      }
    });
    
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
    
    window.portfolioUpdateFlag = 0;
  }
  
  signalUpdate() {
    const timestamp = Date.now();
    const storage = window.safeStorage || localStorage;
    
    storage.setItem('universalSyncTrigger', timestamp.toString());
    storage.setItem('lastPortfolioUpdate', timestamp.toString());
    storage.setItem('portfolioUpdated', timestamp.toString());
    storage.setItem('newPostAdded', 'true');
    
    try {
      sessionStorage.setItem('portfolioNeedsUpdate', timestamp.toString());
    } catch (e) {}
    
    window.portfolioUpdateFlag = timestamp;
    
    window.location.hash = `#portfolio-updated-${timestamp}`;
    setTimeout(() => {
      window.location.hash = '';
    }, 1000);
    
    try {
      window.postMessage({
        type: 'PORTFOLIO_UPDATED',
        timestamp: timestamp,
        platform: this.platform
      }, '*');
    } catch (e) {}
    
    console.log('📡 Universal sync signals sent:', timestamp);
  }
  
  forceUpdate() {
    console.log('🔄 Universal force update triggered');
    this.triggerPortfolioRefresh();
  }
  
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

// === NETLIFY SYNC CLASS ===
class NetlifySync {
  constructor() {
    this.storageKey = 'netlify_portfolio_sync';
    this.lastSync = 0;
    this.pollInterval = null;
    
    console.log('🌐 Netlify Sync initialized');
    this.startNetlifyPolling();
    this.setupNetlifyEventHandlers();
  }
  
  startNetlifyPolling() {
    this.pollInterval = setInterval(() => {
      this.checkNetlifyUpdates();
    }, 1000);
    
    console.log('🔄 Netlify polling started');
  }
  
  checkNetlifyUpdates() {
    try {
      const storage = window.safeStorage || localStorage;
      
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
    if (typeof loadPosts === 'function') {
      loadPosts();
      
      if (typeof renderFeed === 'function') {
        renderFeed();
      }
      
      if (typeof updateHeroSection === 'function') {
        updateHeroSection();
      }
      
      console.log('✅ Netlify portfolio refreshed');
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
  
  setupNetlifyEventHandlers() {
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        console.log('👁️ Page visible, checking for Netlify updates...');
        setTimeout(() => {
          this.checkNetlifyUpdates();
        }, 500);
      }
    });
    
    window.addEventListener('focus', () => {
      console.log('🎯 Window focused, checking for Netlify updates...');
      setTimeout(() => {
        this.checkNetlifyUpdates();
      }, 300);
    });
    
    window.addEventListener('load', () => {
      console.log('📄 Page loaded, initial Netlify check...');
      setTimeout(() => {
        this.checkNetlifyUpdates();
      }, 1000);
    });
    
    window.addEventListener('storage', (e) => {
      if (e.key && (e.key.includes('portfolio') || e.key.includes('netlify'))) {
        console.log('📡 Storage event detected:', e.key);
        setTimeout(() => {
          this.checkNetlifyUpdates();
        }, 100);
      }
    });
  }
  
  forceUpdate() {
    console.log('🔄 Force update triggered');
    this.triggerNetlifyRefresh();
  }
  
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

// === INITIALIZE SYNC ===
const platform = detectPlatform();
console.log('📊 Platform detected:', platform);

// Always initialize Universal Sync
const universalSync = new UniversalSync();
window.universalSync = universalSync;

// Initialize Netlify Sync if on Netlify
const isNetlify = window.location.hostname.includes('netlify.app') || 
                  window.location.hostname.includes('netlify.com');

let netlifySync = null;
if (isNetlify) {
  netlifySync = new NetlifySync();
  console.log('🌐 Netlify sync active for domain:', window.location.hostname);
}

window.netlifySync = netlifySync;

// === DEBUG INTERFACE ===
window.universalDebug = {
  forceUpdate: () => universalSync.forceUpdate(),
  signalUpdate: () => universalSync.signalUpdate(),
  getStatus: () => universalSync.getStatus(),
  checkUpdates: () => universalSync.runAllSyncChecks()
};

window.netlifyDebug = {
  forceUpdate: () => netlifySync && netlifySync.forceUpdate(),
  signalUpdate: () => netlifySync && netlifySync.signalUpdate(),
  checkUpdates: () => netlifySync && netlifySync.checkNetlifyUpdates()
};

console.log('✅ Sync module loaded');
console.log('💡 Debug: window.universalDebug.getStatus() or window.netlifyDebug.forceUpdate()');
