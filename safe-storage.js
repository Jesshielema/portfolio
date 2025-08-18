// Safe Storage Utility for Online Compatibility
// This handles localStorage issues on different hosting platforms

class SafeStorage {
  constructor() {
    this.available = this.checkAvailability();
    this.fallbackData = {};
    console.log('SafeStorage initialized, localStorage available:', this.available);
  }
  
  checkAvailability() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      console.warn('localStorage not available, using fallback:', e.message);
      return false;
    }
  }
  
  setItem(key, value) {
    try {
      if (this.available) {
        localStorage.setItem(key, value);
      } else {
        this.fallbackData[key] = value;
      }
      console.log('SafeStorage.setItem:', key, 'success');
    } catch (e) {
      console.error('SafeStorage.setItem failed:', key, e);
      this.fallbackData[key] = value; // Fallback to memory
    }
  }
  
  getItem(key) {
    try {
      if (this.available) {
        return localStorage.getItem(key);
      } else {
        return this.fallbackData[key] || null;
      }
    } catch (e) {
      console.error('SafeStorage.getItem failed:', key, e);
      return this.fallbackData[key] || null;
    }
  }
  
  removeItem(key) {
    try {
      if (this.available) {
        localStorage.removeItem(key);
      }
      delete this.fallbackData[key];
      console.log('SafeStorage.removeItem:', key, 'success');
    } catch (e) {
      console.error('SafeStorage.removeItem failed:', key, e);
      delete this.fallbackData[key];
    }
  }
  
  // Get all stored data for debugging
  getAllData() {
    const data = {};
    try {
      if (this.available) {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('portfolio')) {
            data[key] = localStorage.getItem(key);
          }
        }
      } else {
        Object.keys(this.fallbackData).forEach(key => {
          if (key.startsWith('portfolio')) {
            data[key] = this.fallbackData[key];
          }
        });
      }
    } catch (e) {
      console.error('SafeStorage.getAllData failed:', e);
    }
    return data;
  }
  
  // Clear all portfolio data
  clearPortfolioData() {
    const keys = [
      'portfolioPosts',
      'deletedDefaultPosts', 
      'overriddenDefaultPosts',
      'hiddenHardcodedPosts',
      'overriddenHardcodedPosts',
      'newPostAdded',
      'portfolioUpdated',
      'lastPortfolioUpdate'
    ];
    
    keys.forEach(key => this.removeItem(key));
    console.log('SafeStorage: Cleared all portfolio data');
  }
}

// Initialize safe storage
const safeStorage = new SafeStorage();

// Make available globally for debugging
window.safeStorage = safeStorage;

// Replace localStorage calls in existing code
window.safeLocalStorage = {
  setItem: (key, value) => safeStorage.setItem(key, value),
  getItem: (key) => safeStorage.getItem(key),
  removeItem: (key) => safeStorage.removeItem(key)
};
