// Visual Debug Helper - Shows messages on screen instead of console
// Voor wanneer F12 niet beschikbaar is

class VisualDebug {
  constructor() {
    this.createDebugContainer();
    this.messages = [];
  }
  
  createDebugContainer() {
    // Create debug overlay
    const debugContainer = document.createElement('div');
    debugContainer.id = 'visualDebug';
    debugContainer.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      width: 350px;
      max-height: 400px;
      background: rgba(0, 0, 0, 0.9);
      color: #fff;
      font-family: monospace;
      font-size: 12px;
      padding: 15px;
      border-radius: 8px;
      z-index: 10000;
      overflow-y: auto;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      display: none;
    `;
    
    // Create header
    const header = document.createElement('div');
    header.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      padding-bottom: 8px;
      border-bottom: 1px solid #333;
    `;
    header.innerHTML = `
      <strong>🔧 Debug Log</strong>
      <button id="clearDebug" style="background: #ff4444; color: white; border: none; padding: 2px 8px; border-radius: 4px; cursor: pointer;">Clear</button>
    `;
    
    // Create messages container
    const messagesContainer = document.createElement('div');
    messagesContainer.id = 'debugMessages';
    
    debugContainer.appendChild(header);
    debugContainer.appendChild(messagesContainer);
    document.body.appendChild(debugContainer);
    
    // Clear button handler
    document.getElementById('clearDebug').addEventListener('click', () => {
      this.clear();
    });
    
    // Show debug panel
    this.show();
  }
  
  log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const colors = {
      info: '#4CAF50',
      warn: '#ff9800', 
      error: '#f44336',
      success: '#00bcd4'
    };
    
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
      margin: 5px 0;
      padding: 5px;
      border-left: 3px solid ${colors[type] || colors.info};
      background: rgba(255, 255, 255, 0.1);
      border-radius: 3px;
    `;
    messageDiv.innerHTML = `<small>${timestamp}</small><br>${message}`;
    
    const container = document.getElementById('debugMessages');
    container.appendChild(messageDiv);
    
    // Auto scroll to bottom
    container.scrollTop = container.scrollHeight;
    
    // Keep only last 20 messages
    this.messages.push({timestamp, message, type});
    if (this.messages.length > 20) {
      this.messages.shift();
      container.removeChild(container.firstChild);
    }
  }
  
  error(message) {
    this.log(message, 'error');
  }
  
  warn(message) {
    this.log(message, 'warn');
  }
  
  success(message) {
    this.log(message, 'success');
  }
  
  clear() {
    document.getElementById('debugMessages').innerHTML = '';
    this.messages = [];
  }
  
  show() {
    document.getElementById('visualDebug').style.display = 'block';
  }
  
  hide() {
    document.getElementById('visualDebug').style.display = 'none';
  }
  
  toggle() {
    const debug = document.getElementById('visualDebug');
    debug.style.display = debug.style.display === 'none' ? 'block' : 'none';
  }
}

// Initialize visual debug
const vDebug = new VisualDebug();

// Override console methods to also show in visual debug
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

console.log = function(...args) {
  originalConsoleLog.apply(console, args);
  vDebug.log(args.join(' '), 'info');
};

console.error = function(...args) {
  originalConsoleError.apply(console, args);
  vDebug.error(args.join(' '));
};

console.warn = function(...args) {
  originalConsoleWarn.apply(console, args);
  vDebug.warn(args.join(' '));
};

// Make available globally
window.vDebug = vDebug;

// Add toggle button to page
function addDebugToggle() {
  const toggleBtn = document.createElement('button');
  toggleBtn.innerHTML = '🔧';
  toggleBtn.title = 'Toggle Debug Panel';
  toggleBtn.style.cssText = `
    position: fixed;
    top: 10px;
    left: 10px;
    width: 40px;
    height: 40px;
    background: #333;
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    z-index: 10001;
    font-size: 16px;
  `;
  
  toggleBtn.addEventListener('click', () => {
    vDebug.toggle();
  });
  
  document.body.appendChild(toggleBtn);
}

// Add toggle button when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addDebugToggle);
} else {
  addDebugToggle();
}

vDebug.log('Visual Debug initialized - F12 not needed!', 'success');
