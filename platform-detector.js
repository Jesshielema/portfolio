// Enhanced Platform Detection with better messaging
// This explains WHY certain sync methods are/aren't available

function createPlatformExplainer() {
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  
  const explanations = {
    'localhost': {
      platform: 'Local Development',
      color: '#ffc107',
      icon: '🏠',
      message: 'Je test lokaal via Live Server. Universal sync is actief.',
      syncMethods: ['Universal Sync (500ms polling)', 'localStorage', 'sessionStorage'],
      recommendation: 'Upload naar Netlify om Netlify-specific sync te testen.'
    },
    '127.0.0.1': {
      platform: 'Local Development', 
      color: '#ffc107',
      icon: '🏠',
      message: 'Je test lokaal via Live Server. Universal sync is actief.',
      syncMethods: ['Universal Sync (500ms polling)', 'localStorage', 'sessionStorage'],
      recommendation: 'Upload naar Netlify om Netlify-specific sync te testen.'
    },
    'netlify.app': {
      platform: 'Netlify Hosting',
      color: '#00d4aa',
      icon: '🌐',
      message: 'Je bent op Netlify! Alle sync methodes zijn actief.',
      syncMethods: ['Netlify Sync (1s polling)', 'Universal Sync (500ms)', 'localStorage', 'Cross-tab events'],
      recommendation: 'Perfecte omgeving - alle sync methodes werken hier.'
    },
    'vercel.app': {
      platform: 'Vercel Hosting',
      color: '#000',
      icon: '▲',
      message: 'Je bent op Vercel. Universal sync is geoptimaliseerd voor Vercel.',
      syncMethods: ['Universal Sync (500ms polling)', 'localStorage', 'sessionStorage'],
      recommendation: 'Universal sync werkt perfect op Vercel.'
    },
    'github.io': {
      platform: 'GitHub Pages',
      color: '#24292e',
      icon: '🐱',
      message: 'Je bent op GitHub Pages. Universal sync is actief.',
      syncMethods: ['Universal Sync (500ms polling)', 'localStorage', 'Hash-based sync'],
      recommendation: 'Universal sync werkt goed op GitHub Pages.'
    }
  };
  
  // Detect platform
  let platformInfo = explanations['localhost']; // default
  
  Object.keys(explanations).forEach(key => {
    if (hostname.includes(key)) {
      platformInfo = explanations[key];
    }
  });
  
  return {
    current: {
      url: window.location.href,
      hostname: hostname,
      protocol: protocol,
      ...platformInfo
    },
    alternatives: {
      netlify: 'https://portfoliojessehielema.netlify.app/',
      local: 'http://127.0.0.1:5500/' 
    }
  };
}

// Create visual platform status
function displayPlatformStatus() {
  const info = createPlatformExplainer();
  
  console.log('🌍 Platform Detection Result:');
  console.log('Current:', info.current);
  console.log('Available sync methods:', info.current.syncMethods);
  
  // Create visual indicator if we're on a test page
  if (document.getElementById('environmentStatus')) {
    const statusHtml = `
      <div style="background: ${info.current.color}20; padding: 15px; border-radius: 8px; border-left: 4px solid ${info.current.color};">
        <h3>${info.current.icon} ${info.current.platform}</h3>
        <p><strong>Huidige URL:</strong> ${info.current.url}</p>
        <p><strong>Status:</strong> ${info.current.message}</p>
        <p><strong>Actieve sync methodes:</strong></p>
        <ul>
          ${info.current.syncMethods.map(method => `<li>✅ ${method}</li>`).join('')}
        </ul>
        <p><strong>💡 ${info.current.recommendation}</strong></p>
        ${info.current.platform !== 'Netlify Hosting' ? `
          <p style="margin-top: 10px;"><strong>🔗 Test op Netlify:</strong> 
          <a href="${info.alternatives.netlify}test-online.html" target="_blank" style="color: ${info.current.color};">
            ${info.alternatives.netlify}test-online.html
          </a></p>
        ` : ''}
      </div>
    `;
    
    document.getElementById('environmentStatus').innerHTML = statusHtml;
  }
  
  return info;
}

// Auto-run when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', displayPlatformStatus);
} else {
  displayPlatformStatus();
}

// Make available globally
window.platformInfo = createPlatformExplainer();

console.log('💡 Platform info available at: window.platformInfo');
