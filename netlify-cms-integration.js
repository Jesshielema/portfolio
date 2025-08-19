// ===== NETLIFY CMS INTEGRATION =====

class NetlifyCMSIntegration {
  constructor() {
    // Auto-detect repo info from current URL or set manually
    this.repoOwner = this.detectRepoOwner() || 'Jesshielema'; 
    this.repoName = this.detectRepoName() || 'portfolio';   
    this.branch = 'main';          
    this.apiBase = `https://api.github.com/repos/${this.repoOwner}/${this.repoName}`;
    
    console.log('🚀 Netlify CMS Integration initialized');
    console.log('📂 Repo:', `${this.repoOwner}/${this.repoName}`);
    console.log('🌐 API Base:', this.apiBase);
  }

  // Try to detect repo owner from current URL
  detectRepoOwner() {
    const hostname = window.location.hostname;
    if (hostname.includes('netlify.app')) {
      // Extract from Netlify URL pattern
      const subdomain = hostname.split('.')[0];
      return subdomain.includes('-') ? subdomain.split('-')[0] : 'Jesshielema';
    }
    return null;
  }

  // Try to detect repo name from current URL  
  detectRepoName() {
    const hostname = window.location.hostname;
    if (hostname.includes('netlify.app')) {
      const subdomain = hostname.split('.')[0];
      return subdomain.includes('-') ? subdomain.split('-').slice(1).join('-') : 'portfolio';
    }
    if (hostname.includes('github.io')) {
      const path = window.location.pathname.split('/')[1];
      return path || 'portfolio';
    }
    return null;
  }

  // Fetch posts from Netlify CMS (stored as markdown files in GitHub)
  async fetchNetlifyCMSPosts() {
    try {
      console.log('📡 Fetching Netlify CMS posts from GitHub...');
      
      // First, try to get the content/posts folder
      const contentResponse = await fetch(`${this.apiBase}/contents/content/posts?ref=${this.branch}`);
      
      if (!contentResponse.ok) {
        console.log('📁 No content/posts folder found, trying posts/ folder...');
        
        // Try alternative paths where Netlify CMS might store files
        const postsResponse = await fetch(`${this.apiBase}/contents/posts?ref=${this.branch}`);
        
        if (!postsResponse.ok) {
          console.log('📝 No CMS posts found yet - that\'s okay!');
          return [];
        }
        
        return await this.processPostsFolder(postsResponse);
      }
      
      return await this.processPostsFolder(contentResponse);
      
    } catch (error) {
      console.error('❌ Error fetching Netlify CMS posts:', error);
      return [];
    }
  }

  // Process posts folder response
  async processPostsFolder(response) {
    const files = await response.json();
    const markdownFiles = files.filter(file => file.name.endsWith('.md'));
    
    console.log(`📄 Found ${markdownFiles.length} markdown files`);
    
    const posts = [];
    
    for (const file of markdownFiles) {
      try {
        const postData = await this.fetchAndParseMarkdownFile(file.download_url);
        if (postData) {
          posts.push({
            ...postData,
            id: `cms-${file.name.replace('.md', '')}`,
            source: 'netlify-cms',
            filename: file.name
          });
        }
      } catch (error) {
        console.error(`❌ Error processing file ${file.name}:`, error);
      }
    }
    
    console.log(`✅ Successfully parsed ${posts.length} CMS posts`);
    return posts;
  }

  // Fetch and parse individual markdown file
  async fetchAndParseMarkdownFile(downloadUrl) {
    try {
      const response = await fetch(downloadUrl);
      const content = await response.text();
      
      return this.parseMarkdown(content);
    } catch (error) {
      console.error('❌ Error fetching markdown file:', error);
      return null;
    }
  }

  // Parse markdown frontmatter and content
  parseMarkdown(content) {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);
    
    if (!match) {
      console.log('⚠️ No frontmatter found in markdown file');
      return null;
    }
    
    const [, frontmatter, body] = match;
    const metadata = this.parseFrontmatter(frontmatter);
    
    return {
      title: metadata.title || 'Untitled',
      description: metadata.description || body.substring(0, 150) + '...',
      category: metadata.category || metadata.type || 'OVERIG',
      type: metadata.type || 'Post',
      date: metadata.date || new Date().toISOString(),
      featured: metadata.featured || false,
      client: metadata.client || '',
      purpose: metadata.purpose || metadata.projectDoel || '',
      tools: metadata.tools || '',
      status: metadata.status || 'published',
      body: body,
      images: metadata.images || (metadata.image ? [metadata.image] : [])
    };
  }

  // Parse YAML frontmatter
  parseFrontmatter(frontmatter) {
    const metadata = {};
    const lines = frontmatter.split('\n');
    
    for (const line of lines) {
      const colonIndex = line.indexOf(':');
      if (colonIndex > -1) {
        const key = line.substring(0, colonIndex).trim();
        const value = line.substring(colonIndex + 1).trim();
        
        // Remove quotes if present
        const cleanValue = value.replace(/^["']|["']$/g, '');
        
        // Parse booleans
        if (cleanValue === 'true') {
          metadata[key] = true;
        } else if (cleanValue === 'false') {
          metadata[key] = false;
        } else {
          metadata[key] = cleanValue;
        }
      }
    }
    
    return metadata;
  }

  // Convert CMS post to portfolio format
  convertToPortfolioFormat(cmsPost) {
    return {
      id: cmsPost.id,
      title: cmsPost.title,
      description: cmsPost.description,
      category: cmsPost.category.toUpperCase(),
      type: cmsPost.type,
      date: cmsPost.date,
      featured: cmsPost.featured,
      client: cmsPost.client,
      purpose: cmsPost.purpose,
      tools: cmsPost.tools,
      status: cmsPost.status,
      images: cmsPost.images || [],
      source: 'netlify-cms'
    };
  }
}

// ===== INTEGRATED PORTFOLIO LOADER =====

class IntegratedPortfolioLoader {
  constructor() {
    this.netlifyCMS = new NetlifyCMSIntegration();
    this.allPosts = [];
  }

  // Load all posts from all sources
  async loadAllPosts() {
    console.log('🔄 Loading posts from all sources...');
    
    // Show loading state
    this.showLoadingState();
    this.showStatus('Loading posts from all sources...', 'loading');
    
    try {
      // 1. Load hardcoded posts (from script.js)
      const hardcodedPosts = this.loadHardcodedPosts();
      console.log(`📦 Loaded ${hardcodedPosts.length} hardcoded posts`);
      
      // 2. Load admin posts (from localStorage)
      const adminPosts = this.loadAdminPosts();
      console.log(`👨‍💼 Loaded ${adminPosts.length} admin posts`);
      
      // 3. Load Netlify CMS posts
      this.showStatus('Fetching posts from Netlify CMS...', 'loading');
      const cmsPosts = await this.netlifyCMS.fetchNetlifyCMSPosts();
      console.log(`🌐 Loaded ${cmsPosts.length} Netlify CMS posts`);
      
      // 4. Combine all posts
      this.allPosts = [
        ...hardcodedPosts,
        ...adminPosts,
        ...cmsPosts.map(post => this.netlifyCMS.convertToPortfolioFormat(post))
      ];
      
      // 5. Sort by date (newest first)
      this.allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      console.log(`✅ Total posts loaded: ${this.allPosts.length}`);
      
      // 6. Display posts
      this.displayPosts();
      
      return this.allPosts;
      
    } catch (error) {
      console.error('❌ Error loading posts:', error);
      
      // Fallback to local posts only
      const localPosts = [...this.loadHardcodedPosts(), ...this.loadAdminPosts()];
      this.allPosts = localPosts;
      this.showStatus('Loaded local posts only (CMS unavailable)', 'warning');
      this.displayPosts();
      
      return localPosts;
    }
  }

  // Show loading state
  showLoadingState() {
    const loadingIndicator = document.getElementById('cmsLoading');
    if (loadingIndicator) {
      loadingIndicator.style.display = 'flex';
    }
  }

  // Load hardcoded posts (same as existing)
  loadHardcodedPosts() {
    // This should match your existing hardcoded posts from script.js
    const hardcodedPosts = [
      {
        id: 1,
        title: "Character Design Project",
        image: "images/characters.jpg",
        images: ["images/characters.jpg"],
        type: "Design",
        category: "DESIGN",
        date: "2024-01-15",
        featured: true,
        description: "Een uitgebreide character design studie voor een nieuwe animatieserie.",
        client: "Animation Studio XYZ",
        purpose: "Character ontwikkeling voor nieuwe serie",
        tools: "Photoshop, Illustrator, Procreate",
        source: "hardcoded"
      },
      {
        id: 2,
        title: "Brand Identity",
        image: "images/project2.jpg", 
        images: ["images/project2.jpg"],
        type: "Branding",
        category: "BRANDING",
        date: "2024-01-10",
        featured: false,
        description: "Complete merkidentiteit voor een tech startup.",
        client: "TechStart BV",
        purpose: "Volledige rebranding voor marktlancering",
        tools: "Illustrator, InDesign, Figma",
        source: "hardcoded"
      },
      {
        id: 3,
        title: "Mobile App Design",
        image: "images/project3.jpg",
        images: ["images/project3.jpg"],
        type: "UI/UX",
        category: "UI/UX", 
        date: "2024-01-08",
        featured: false,
        description: "Gebruiksvriendelijke mobile app voor fitness tracking.",
        client: "FitLife App",
        purpose: "Intuïtieve fitness tracking experience",
        tools: "Figma, Principle, After Effects",
        source: "hardcoded"
      }
      // Add more hardcoded posts as needed
    ];

    return hardcodedPosts;
  }

  // Load admin posts from localStorage
  loadAdminPosts() {
    try {
      const adminPosts = JSON.parse(localStorage.getItem('portfolioPosts') || '[]');
      return adminPosts.map(post => ({
        ...post,
        source: 'admin'
      }));
    } catch (error) {
      console.error('❌ Error loading admin posts:', error);
      return [];
    }
  }

  // Display all posts in the portfolio
  displayPosts() {
    const postsContainer = document.getElementById('postsContainer');
    if (!postsContainer) {
      console.error('❌ Posts container not found!');
      return;
    }

    // Hide loading indicator
    const loadingIndicator = document.getElementById('cmsLoading');
    if (loadingIndicator) {
      loadingIndicator.style.display = 'none';
    }

    // Check if posts are already rendered by script.js
    if (postsContainer.children.length > 0) {
      console.log('📦 Posts already rendered by script.js, skipping...');
      return;
    }

    // Show status
    this.showStatus(`Loaded ${this.allPosts.length} posts from all sources`, 'success');

    // Use the global posts array if available (from script.js)
    if (window.posts && window.posts.length > 0) {
      console.log('🔄 Using posts from script.js instead of rebuilding...');
      
      // Update global posts array with any new CMS posts that aren't hardcoded
      const cmsOnlyPosts = this.allPosts.filter(post => 
        post.source === 'netlify-cms' && 
        !window.posts.some(existing => existing.id === post.id)
      );
      
      if (cmsOnlyPosts.length > 0) {
        window.posts = [...window.posts, ...cmsOnlyPosts];
        console.log(`➕ Added ${cmsOnlyPosts.length} new CMS posts to global array`);
        
        // Re-render using script.js renderFeed function
        if (window.renderFeed) {
          window.renderFeed();
        }
      }
      return;
    }

    // Fallback: render our own posts if script.js hasn't loaded yet
    this.allPosts.forEach(post => {
      const postElement = this.createPostElement(post);
      postsContainer.appendChild(postElement);
    });

    console.log(`✅ Displayed ${this.allPosts.length} posts in portfolio`);
    
    // Initialize source filters
    this.initializeSourceFilters();
    
    // Trigger any existing filtering/UI updates
    this.triggerUIUpdates();
  }

  // Show status message (disabled for public)
  showStatus(message, type = 'info') {
    // Status messages are hidden from public view
    console.log(`📢 Status (${type}): ${message}`);
    return;
    
    const statusElement = document.getElementById('cmsStatus');
    if (!statusElement) return;

    statusElement.textContent = message;
    statusElement.className = `cms-status ${type}`;
    statusElement.classList.add('show');

    // Auto-hide after 3 seconds
    setTimeout(() => {
      statusElement.classList.remove('show');
    }, 3000);
  }

  // Initialize source filtering
  initializeSourceFilters() {
    const filterButtons = document.querySelectorAll('.source-filter-btn');
    
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active state
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Get filter value
        const filterSource = btn.getAttribute('data-source');
        
        // Apply filter
        this.filterBySource(filterSource);
        
        console.log(`🔍 Filtering by source: ${filterSource}`);
      });
    });
  }

  // Filter posts by source
  filterBySource(source) {
    const allPosts = document.querySelectorAll('.work-item');
    
    allPosts.forEach(post => {
      const postSource = post.getAttribute('data-source');
      
      if (source === 'all' || postSource === source) {
        post.style.display = 'block';
        post.style.opacity = '1';
      } else {
        post.style.display = 'none';
        post.style.opacity = '0';
      }
    });

    // Update counter
    const visiblePosts = document.querySelectorAll('.work-item[style*="display: block"], .work-item:not([style])');
    const count = source === 'all' ? visiblePosts.length : document.querySelectorAll(`[data-source="${source}"]`).length;
    
    this.showStatus(`Showing ${count} posts from ${source === 'all' ? 'all sources' : source}`, 'info');
  }

  // Group posts by category
  groupPostsByCategory() {
    const categories = {};
    this.allPosts.forEach(post => {
      const category = post.category || 'OVERIG';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(post);
    });
    return categories;
  }

  // Create post element
  createPostElement(post) {
    const postDiv = document.createElement('div');
    postDiv.className = `post-card ${post.featured ? 'featured' : ''}`;
    postDiv.setAttribute('data-category', post.category || 'OVERIG');
    postDiv.setAttribute('data-type', post.type || 'Post');
    postDiv.setAttribute('data-source', post.source || 'unknown');

    // Handle multiple images or single image (same as hardcoded posts)
    const images = post.images || [post.image || post.mainImage];
    const mainImage = images[0] || 'images/placeholder.svg';
    
    const imageHTML = images.length > 1 ? `
      <div class="post-image-slider">
        <div class="slider-wrapper">
          ${images.map((img, index) => `
            <div class="slide ${index === 0 ? 'active' : ''}" data-slide="${index}">
              <img src="${img}" alt="${post.title} - Image ${index + 1}" loading="lazy" 
                   onerror="this.src='images/placeholder.svg'">
            </div>
          `).join('')}
        </div>
        
        ${images.length > 1 ? `
          <div class="slider-controls">
            <button class="slider-btn prev" onclick="changePostSlide(this, -1)">❮</button>
            <button class="slider-btn next" onclick="changePostSlide(this, 1)">❯</button>
          </div>
          
          <div class="slider-indicators">
            ${images.map((_, index) => `
              <span class="indicator ${index === 0 ? 'active' : ''}" onclick="goToPostSlide(this, ${index})"></span>
            `).join('')}
          </div>
        ` : ''}
      </div>
    ` : `
      <div class="post-image">
        <img src="${mainImage}" alt="${post.title}" loading="lazy" 
             onerror="this.src='images/placeholder.svg'">
      </div>
    `;
    
    // Create post HTML with same structure as hardcoded posts
    postDiv.innerHTML = `
      ${imageHTML}
      <div class="post-overlay">
        <div class="post-content">
          <div class="post-meta">
            <span class="post-type">${post.type || post.category || 'Design'}</span>
          </div>
          <h3>${post.title}</h3>
          <p>${post.description}</p>
          <div class="post-info">
            <span class="post-date">${this.formatDate(post.date)}</span>
            ${post.featured ? '<span class="featured-badge">Featured</span>' : ''}
          </div>
        </div>
      </div>
    `;

    // Add click handler for lightbox (same as hardcoded posts)
    postDiv.addEventListener('click', () => {
      this.openLightbox(post);
    });

    return postDiv;
  }

  // Create image display (single or multiple)
  createImageDisplay(post) {
    const images = post.images || (post.image ? [post.image] : []);
    
    if (images.length === 0) {
      return `<img src="images/placeholder.svg" alt="${post.title}" class="single-image">`;
    }
    
    if (images.length === 1) {
      return `<img src="${images[0]}" alt="${post.title}" class="single-image">`;
    }

    // Multiple images - create slider
    return `
      <div class="post-images-slider" data-post-id="${post.id}">
        <div class="slider-container">
          ${images.map((img, index) => `
            <div class="slide ${index === 0 ? 'active' : ''}">
              <img src="${img}" alt="${post.title} - ${index + 1}">
            </div>
          `).join('')}
        </div>
        
        ${images.length > 1 ? `
          <div class="slider-nav">
            <button class="slide-btn prev" onclick="prevSlide('${post.id}')" aria-label="Previous image">‹</button>
            <button class="slide-btn next" onclick="nextSlide('${post.id}')" aria-label="Next image">›</button>
          </div>
          
          <div class="slider-dots">
            ${images.map((_, index) => `
              <span class="dot ${index === 0 ? 'active' : ''}" onclick="currentSlide('${post.id}', ${index + 1})"></span>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }

  // Get source icon
  getSourceIcon(source) {
    const icons = {
      'netlify-cms': '🌐',
      'admin': '👨‍💼', 
      'hardcoded': '📦',
      'unknown': '❓'
    };
    return icons[source] || icons.unknown;
  }

  // Format date
  formatDate(dateString) {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('nl-NL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  }

  // Open lightbox for post details
  openLightbox(post) {
    // This should integrate with your existing lightbox system
    console.log('🔍 Opening lightbox for:', post.title);
    
    // Trigger existing lightbox if available
    if (typeof openModal === 'function') {
      openModal(post);
    }
    
    // Track view
    if (typeof trackProjectView === 'function') {
      trackProjectView(post.title);
    }
  }

  // Trigger UI updates (filters, etc.)
  triggerUIUpdates() {
    // Trigger any existing filter updates
    if (typeof updateSeeMoreButton === 'function') {
      updateSeeMoreButton();
    }
    
    // Trigger filter system if available
    if (typeof initializeFilters === 'function') {
      initializeFilters();
    }
  }

  // Refresh posts (call this periodically to check for new CMS posts)
  async refreshPosts() {
    console.log('🔄 Refreshing posts...');
    await this.loadAllPosts();
  }
}

// ===== AUTO-INITIALIZATION =====

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 Initializing Integrated Portfolio Loader...');
  
  window.portfolioLoader = new IntegratedPortfolioLoader();
  await window.portfolioLoader.loadAllPosts();
  
  // Set up periodic refresh (every 5 minutes) to check for new CMS posts
  setInterval(() => {
    if (navigator.onLine) {
      window.portfolioLoader.refreshPosts();
    }
  }, 5 * 60 * 1000);
  
  console.log('✅ Portfolio integration complete!');
});

// Export for global access
window.NetlifyCMSIntegration = NetlifyCMSIntegration;
window.IntegratedPortfolioLoader = IntegratedPortfolioLoader;
