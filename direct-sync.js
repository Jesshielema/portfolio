// Simple Direct Sync - No complex polling, just direct reload
// This is a fallback when all other sync methods fail

class DirectSync {
  constructor() {
    this.isActive = false;
    this.initialize();
  }
  
  initialize() {
    console.log('🎯 Direct Sync initializing...');
    
    // Only activate on main portfolio page
    if (this.isPortfolioPage()) {
      this.startDirectSync();
      this.isActive = true;
      console.log('✅ Direct Sync active on portfolio page');
    } else {
      console.log('ℹ️ Direct Sync standby (not on portfolio page)');
    }
  }
  
  isPortfolioPage() {
    // Check if we're on the main portfolio page (not admin)
    return !window.location.href.includes('admin') && 
           !window.location.href.includes('test-online');
  }
  
  startDirectSync() {
    // Method 1: Simple interval check
    setInterval(() => {
      this.checkForNewPosts();
    }, 1000);
    
    // Method 2: Focus event
    window.addEventListener('focus', () => {
      console.log('🎯 Window focused - checking for updates');
      setTimeout(() => this.forceReload(), 500);
    });
    
    // Method 3: Visibility change
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        console.log('🎯 Page visible - checking for updates');
        setTimeout(() => this.forceReload(), 500);
      }
    });
    
    console.log('🔄 Direct sync monitoring started');
  }
  
  checkForNewPosts() {
    try {
      const savedPosts = this.getSavedPosts();
      const currentCount = this.getCurrentPostCount();
      
      if (savedPosts.length > 0 && savedPosts.length !== currentCount) {
        console.log('🆕 New posts detected:', savedPosts.length, 'vs current:', currentCount);
        this.forceReload();
      }
    } catch (e) {
      // Silent fail
    }
  }
  
  getSavedPosts() {
    try {
      return JSON.parse(localStorage.getItem('portfolioPosts') || '[]');
    } catch (e) {
      return [];
    }
  }
  
  getCurrentPostCount() {
    const container = document.getElementById('postsContainer');
    return container ? container.children.length : 0;
  }
  
  forceReload() {
    console.log('🔄 Direct sync: Force reloading posts...');
    
    try {
      // Method 1: Try existing functions
      if (typeof loadPosts === 'function' && typeof renderFeed === 'function') {
        loadPosts();
        renderFeed();
        console.log('✅ Used existing loadPosts/renderFeed');
        return;
      }
      
      // Method 2: Direct DOM manipulation
      this.directDOMUpdate();
      
    } catch (e) {
      console.error('❌ Direct sync reload failed:', e);
      // Method 3: Nuclear option - full page reload
      console.log('🔄 Falling back to page reload...');
      window.location.reload();
    }
  }
  
  directDOMUpdate() {
    console.log('🔧 Direct DOM update...');
    
    const container = document.getElementById('postsContainer');
    if (!container) {
      console.log('❌ Posts container not found');
      return;
    }
    
    const savedPosts = this.getSavedPosts();
    if (savedPosts.length === 0) {
      console.log('ℹ️ No saved posts to display');
      return;
    }
    
    // Clear container
    container.innerHTML = '';
    
    // Add new posts
    savedPosts.forEach(post => {
      const postElement = this.createPostElement(post);
      container.appendChild(postElement);
    });
    
    console.log('✅ Direct DOM update complete:', savedPosts.length, 'posts added');
  }
  
  createPostElement(post) {
    const postEl = document.createElement('div');
    postEl.className = 'work-item';
    
    const images = post.images || [post.image || post.mainImage];
    const mainImage = images[0];
    
    postEl.innerHTML = `
      <div class="work-image">
        <img src="${mainImage}" alt="${post.title}" loading="lazy">
        ${post.featured ? '<span class="featured-badge">★ FEATURED</span>' : ''}
      </div>
      <div class="work-content">
        <div class="work-category">${post.category || post.type}</div>
        <h3>${post.title}</h3>
        <div class="work-date">${this.formatDate(post.date)}</div>
        <p>${post.description}</p>
      </div>
    `;
    
    // Add click handler for modal
    postEl.addEventListener('click', () => {
      if (typeof openModal === 'function') {
        openModal(mainImage, post.title, post.type, post.date, post.description, images);
      }
    });
    
    return postEl;
  }
  
  formatDate(dateStr) {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('nl-NL', { 
        day: 'numeric',
        month: 'long',
        year: 'numeric' 
      }).toUpperCase();
    } catch (e) {
      return dateStr.toUpperCase();
    }
  }
  
  // Manual trigger for testing
  manualUpdate() {
    console.log('🎯 Manual direct sync triggered');
    this.forceReload();
  }
  
  // Get status
  getStatus() {
    return {
      active: this.isActive,
      savedPosts: this.getSavedPosts().length,
      currentPosts: this.getCurrentPostCount(),
      lastCheck: new Date().toISOString()
    };
  }
}

// Initialize direct sync
const directSync = new DirectSync();

// Make available globally for debugging
window.directSync = directSync;

// Expose simple debug function
window.testDirectSync = () => {
  console.log('🧪 Testing direct sync...');
  console.log('Status:', directSync.getStatus());
  directSync.manualUpdate();
};

console.log('🎯 Direct Sync loaded. Test with: window.testDirectSync()');
