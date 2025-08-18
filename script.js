// ===== ANALYTICS & TRACKING =====

// Track contact form submissions
function trackFormSubmission() {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'form_submit', {
      event_category: 'Contact',
      event_label: 'Contact Form Submission'
    });
  }
}

// Track project views
function trackProjectView(projectName) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'view_item', {
      event_category: 'Portfolio',
      event_label: projectName
    });
  }
}

// ===== ENHANCED INTERACTIVE ELEMENTS =====

// Enhanced project hover effects and analytics
function initializeInteractiveElements() {
  const projectItems = document.querySelectorAll('.work-item');
  
  projectItems.forEach(item => {
    // Add hover analytics tracking
    item.addEventListener('mouseenter', function() {
      const projectName = this.querySelector('h3')?.textContent || 'Unknown Project';
      if (typeof gtag !== 'undefined') {
        gtag('event', 'project_hover', {
          event_category: 'Portfolio',
          event_label: projectName
        });
      }
    });
    
    // Track project clicks
    item.addEventListener('click', function() {
      const projectName = this.querySelector('h3')?.textContent || 'Unknown Project';
      trackProjectView(projectName);
    });
  });
  
  // Smooth scroll for navigation
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Form submission tracking
  const contactForm = document.querySelector('form[name="contact"]');
  if (contactForm) {
    contactForm.addEventListener('submit', trackFormSubmission);
  }
}

// ===== ENHANCED LIGHTBOX FUNCTIONALITY =====

// Enhanced lightbox functionality with zoom and multiple images
function openModal(imageSrc, title, type, date, description, images = []) {
  const modal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalType = document.getElementById('modalType');
  const modalDate = document.getElementById('modalDate');
  const modalDescription = document.getElementById('modalDescription');
  
  modalImage.src = imageSrc;
  modalTitle.textContent = title;
  modalType.textContent = type;
  modalDate.textContent = date;
  modalDescription.textContent = description;
  
  // Reset zoom state
  modalImage.classList.remove('zoomed');
  
  // Add zoom functionality
  modalImage.onclick = function() {
    this.classList.toggle('zoomed');
  };
  
  // Add image gallery navigation if multiple images
  if (images && images.length > 1) {
    addImageGalleryNavigation(images, imageSrc);
  }
  
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
  
  // Track modal opens
  if (typeof gtag !== 'undefined') {
    gtag('event', 'modal_open', {
      event_category: 'Portfolio',
      event_label: title
    });
  }
}

// Add image gallery navigation
function addImageGalleryNavigation(images, currentImage) {
  const modalImageContainer = document.querySelector('.modal-image');
  let currentIndex = images.findIndex(img => img === currentImage);
  
  // Remove existing navigation
  const existingNav = modalImageContainer.querySelector('.image-nav');
  if (existingNav) existingNav.remove();
  
  // Create navigation container
  const navContainer = document.createElement('div');
  navContainer.className = 'image-nav';
  navContainer.innerHTML = `
    <button class="nav-btn prev-btn" ${currentIndex === 0 ? 'disabled' : ''}>❮</button>
    <div class="image-counter">${currentIndex + 1} / ${images.length}</div>
    <button class="nav-btn next-btn" ${currentIndex === images.length - 1 ? 'disabled' : ''}>❯</button>
  `;
  
  // Add navigation functionality
  const prevBtn = navContainer.querySelector('.prev-btn');
  const nextBtn = navContainer.querySelector('.next-btn');
  const counter = navContainer.querySelector('.image-counter');
  const modalImage = document.getElementById('modalImage');
  
  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      modalImage.src = images[currentIndex];
      counter.textContent = `${currentIndex + 1} / ${images.length}`;
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = false;
    }
  });
  
  nextBtn.addEventListener('click', () => {
    if (currentIndex < images.length - 1) {
      currentIndex++;
      modalImage.src = images[currentIndex];
      counter.textContent = `${currentIndex + 1} / ${images.length}`;
      nextBtn.disabled = currentIndex === images.length - 1;
      prevBtn.disabled = false;
    }
  });
  
  modalImageContainer.appendChild(navContainer);
}

// ===== ADMIN FUNCTIONALITY =====

// Admin panel functionality
function initializeAdminPanel() {
  if (window.location.pathname.includes('admin.html')) {
    loadAdminContent();
    setupAdminEventListeners();
  }
}

function loadAdminContent() {
  // Load existing portfolio data for editing
  const portfolioData = getPortfolioData();
  populateAdminForm(portfolioData);
}

function getPortfolioData() {
  // This would normally come from a database or CMS
  // For now, we'll extract it from the existing HTML
  const workItems = document.querySelectorAll('.work-item');
  const portfolioData = [];
  
  workItems.forEach((item, index) => {
    const img = item.querySelector('img');
    const title = item.querySelector('h3')?.textContent;
    const description = item.querySelector('p')?.textContent;
    
    if (img && title) {
      portfolioData.push({
        id: index + 1,
        title: title,
        description: description,
        image: img.src,
        images: [img.src], // For now, single image
        type: 'Design',
        date: '2024',
        featured: item.classList.contains('featured') || false
      });
    }
  });
  
  return portfolioData;
}

function populateAdminForm(data) {
  const adminContainer = document.getElementById('adminContainer');
  if (!adminContainer) return;
  
  // Create admin interface
  adminContainer.innerHTML = `
    <div class="admin-header">
      <h1>Portfolio Admin Panel</h1>
      <button class="btn-primary" onclick="addNewProject()">+ Nieuw Project</button>
    </div>
    
    <div class="projects-grid" id="projectsGrid">
      ${data.map(project => createProjectCard(project)).join('')}
    </div>
    
    <div class="admin-actions">
      <button class="btn-success" onclick="saveChanges()">Wijzigingen Opslaan</button>
      <button class="btn-secondary" onclick="previewSite()">Voorvertoning</button>
    </div>
  `;
}

function createProjectCard(project) {
  return `
    <div class="admin-project-card" data-id="${project.id}">
      <div class="project-images">
        <img src="${project.images[0]}" alt="${project.title}" class="main-image">
        <div class="image-controls">
          <button onclick="addImage(${project.id})" class="btn-small">+ Foto</button>
          <span class="image-count">${project.images.length} foto('s)</span>
        </div>
      </div>
      
      <div class="project-details">
        <input type="text" value="${project.title}" class="project-title" placeholder="Project Titel">
        <textarea class="project-description" placeholder="Project Beschrijving">${project.description}</textarea>
        
        <div class="project-meta">
          <select class="project-type">
            <option value="Branding" ${project.type === 'Branding' ? 'selected' : ''}>Branding</option>
            <option value="Web Design" ${project.type === 'Web Design' ? 'selected' : ''}>Web Design</option>
            <option value="Print" ${project.type === 'Print' ? 'selected' : ''}>Print Design</option>
            <option value="Packaging" ${project.type === 'Packaging' ? 'selected' : ''}>Packaging</option>
          </select>
          
          <input type="text" value="${project.date}" class="project-date" placeholder="Jaar">
          
          <label class="featured-toggle">
            <input type="checkbox" ${project.featured ? 'checked' : ''}>
            <span>Uitgelicht</span>
          </label>
        </div>
        
        <div class="project-actions">
          <button onclick="editProject(${project.id})" class="btn-edit">Bewerken</button>
          <button onclick="deleteProject(${project.id})" class="btn-delete">Verwijderen</button>
        </div>
      </div>
    </div>
  `;
}

// Admin functions
function addNewProject() {
  const projectsGrid = document.getElementById('projectsGrid');
  const newId = Date.now(); // Simple ID generation
  
  const newProjectHTML = createProjectCard({
    id: newId,
    title: 'Nieuw Project',
    description: 'Project beschrijving...',
    images: ['images/placeholder.svg'],
    type: 'Branding',
    date: new Date().getFullYear(),
    featured: false
  });
  
  projectsGrid.insertAdjacentHTML('beforeend', newProjectHTML);
}

function addImage(projectId) {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.multiple = true;
  
  fileInput.onchange = function(e) {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = function(event) {
        // Add image to project (in real app, upload to server)
        console.log(`Adding image to project ${projectId}:`, event.target.result);
        // Update image count display
        const card = document.querySelector(`[data-id="${projectId}"]`);
        const imageCount = card.querySelector('.image-count');
        const currentCount = parseInt(imageCount.textContent);
        imageCount.textContent = `${currentCount + 1} foto('s)`;
      };
      reader.readAsDataURL(file);
    });
  };
  
  fileInput.click();
}

function editProject(projectId) {
  console.log(`Editing project ${projectId}`);
  // Implementation for detailed project editing
}

function deleteProject(projectId) {
  if (confirm('Weet je zeker dat je dit project wilt verwijderen?')) {
    const card = document.querySelector(`[data-id="${projectId}"]`);
    card.remove();
  }
}

function saveChanges() {
  // Collect all project data from admin form
  const projectCards = document.querySelectorAll('.admin-project-card');
  const portfolioData = [];
  
  projectCards.forEach(card => {
    const id = card.dataset.id;
    const title = card.querySelector('.project-title').value;
    const description = card.querySelector('.project-description').value;
    const type = card.querySelector('.project-type').value;
    const date = card.querySelector('.project-date').value;
    const featured = card.querySelector('input[type="checkbox"]').checked;
    
    portfolioData.push({ id, title, description, type, date, featured });
  });
  
  // In real app, send to server
  console.log('Saving portfolio data:', portfolioData);
  alert('Wijzigingen opgeslagen! (Demo versie - geen echte opslag)');
}

function previewSite() {
  window.open('index.html', '_blank');
}

// ===== INITIALIZATION =====

const menuBtn = document.getElementById('menuBtn');
const closeMenu = document.getElementById('closeMenu');
const sideMenu = document.getElementById('sideMenu');
const overlay = document.getElementById('overlay');
const logoContainer = document.querySelector('.logo-container');
const logoVideo = document.querySelector('.logo-video');
const navbar = document.querySelector('.navbar');
const ctaButton = document.getElementById('ctaButton');

// Mobile filter dropdown elements
const mobileFilterBtn = document.getElementById('mobileFilterBtn');
const mobileFilterMenu = document.getElementById('mobileFilterMenu');
const mobileFilterOptions = document.querySelectorAll('.mobile-filter-option');
const filterText = document.querySelector('.filter-text');

// Hero elements
const heroImage = document.querySelector('.hero-image img');
const postBadge = document.querySelector('.post-badge');

// Start animation for BOLD and LOSES words
function playStartAnimation() {
  const boldWord = document.querySelector('.bold-word');
  const losesWord = document.querySelector('.loses-word');
  
  if (boldWord && losesWord) {
    // Start na 1 seconde
    setTimeout(() => {
      // Trigger BOLD hover effect
      boldWord.style.transform = 'scale(1.2) skew(-8deg)';
      boldWord.style.background = 'linear-gradient(45deg, #ffff00, #ffd700, #6ec512, #6fff0f)';
      boldWord.style.backgroundSize = '400% 400%';
      boldWord.style.webkitBackgroundClip = 'text';
      boldWord.style.backgroundClip = 'text';
      boldWord.style.webkitTextFillColor = 'transparent';
      boldWord.style.filter = 'drop-shadow(0 8px 15px rgba(255,215,0,0.6))';
      boldWord.style.animation = 'gradientShift 2s ease infinite';
      
      // Trigger LOSES fade effect
      losesWord.style.opacity = '0.3';
      losesWord.style.filter = 'blur(2px)';
      
      // Reset na 3 seconden
      setTimeout(() => {
        boldWord.style.transform = '';
        boldWord.style.background = '';
        boldWord.style.webkitBackgroundClip = '';
        boldWord.style.backgroundClip = '';
        boldWord.style.webkitTextFillColor = '';
        boldWord.style.filter = '';
        boldWord.style.animation = '';
        
        losesWord.style.opacity = '';
        losesWord.style.filter = '';
      }, 3000);
    }, 1000);
  }
}

// CTA Button scroll functionaliteit
if (ctaButton) {
  ctaButton.addEventListener('click', () => {
    const feedSection = document.querySelector('.feed');
    if (feedSection) {
      feedSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
}

// See More functionality
const seeMoreBtn = document.getElementById('seeMoreBtn');
const seeMoreContainer = document.getElementById('seeMoreContainer');
const feedGrid = document.querySelector('.feed-grid');

if (seeMoreBtn && feedGrid) {
  // Initially collapse the feed grid
  feedGrid.classList.add('collapsed');
  
  // Check if we need to show/hide see more button based on content
  function checkSeeMoreVisibility() {
    const posts = feedGrid.children;
    if (posts.length <= 8) { // If 8 or fewer posts, hide see more button
      seeMoreContainer.classList.add('hidden');
    } else {
      seeMoreContainer.classList.remove('hidden');
    }
  }
  
  // See more button click handler
  seeMoreBtn.addEventListener('click', () => {
    const isCollapsed = feedGrid.classList.contains('collapsed');
    
    if (isCollapsed) {
      // Expand
      feedGrid.classList.remove('collapsed');
      seeMoreBtn.classList.add('expanded');
      seeMoreBtn.querySelector('.see-more-text').textContent = 'See';
    } else {
      // Collapse
      feedGrid.classList.add('collapsed');
      seeMoreBtn.classList.remove('expanded');
      seeMoreBtn.querySelector('.see-more-text').textContent = 'See more';
      
      // Smooth scroll to top of feed section
      document.querySelector('.feed').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
  
  // Check visibility on load
  checkSeeMoreVisibility();
  
  // Also check when posts are loaded/filtered
  const observer = new MutationObserver(checkSeeMoreVisibility);
  observer.observe(feedGrid, { childList: true });
}

// Timeline Scroll Animation
function initTimelineAnimations() {
  const timeline = document.querySelector('.timeline');
  const timelineItems = document.querySelectorAll('.timeline-item');
  const timelineLine = document.querySelector('.timeline::before');
  
  if (!timeline || timelineItems.length === 0) return;
  
  // Create intersection observer for timeline items
  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        
        // Calculate timeline line height based on visible items
        updateTimelineHeight();
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '0px 0px -10% 0px'
  });
  
  // Observe all timeline items
  timelineItems.forEach(item => {
    timelineObserver.observe(item);
  });
  
  function updateTimelineHeight() {
    const visibleItems = document.querySelectorAll('.timeline-item.animate');
    if (visibleItems.length > 0) {
      const lastVisibleItem = visibleItems[visibleItems.length - 1];
      const timelineRect = timeline.getBoundingClientRect();
      const lastItemRect = lastVisibleItem.getBoundingClientRect();
      
      // Calculate height from timeline start to last visible item
      const newHeight = lastItemRect.top + lastItemRect.height/2 - timelineRect.top;
      timeline.style.setProperty('--timeline-height', newHeight + 'px');
      
      // Update CSS custom property for the line height
      const timelineStyle = document.createElement('style');
      timelineStyle.textContent = `
        .timeline::before {
          height: ${Math.max(0, newHeight)}px !important;
        }
      `;
      document.head.appendChild(timelineStyle);
    }
  }
  
  // Initial update
  setTimeout(updateTimelineHeight, 100);
  
  // Update on scroll for smooth line growth
  window.addEventListener('scroll', () => {
    updateTimelineHeight();
  });
}

// Initialize timeline animations when page loads
document.addEventListener('DOMContentLoaded', initTimelineAnimations);

// Start de animatie wanneer de pagina laadt
window.addEventListener('load', playStartAnimation);

// Navbar scroll effect
window.addEventListener('scroll', () => {
  const feedSection = document.querySelector('.feed');
  if (feedSection) {
    const feedPosition = feedSection.offsetTop - 100; // Start transition 100px before feed section
    const scrollPosition = window.scrollY;
    
    if (scrollPosition >= feedPosition) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
});

menuBtn.addEventListener('click', () => {
  // Toggle menu open/close
  if (sideMenu.classList.contains('active')) {
    sideMenu.classList.remove('active');
    overlay.classList.remove('active');
  } else {
    sideMenu.classList.add('active');
    overlay.classList.add('active');
  }
});

closeMenu.addEventListener('click', () => {
  sideMenu.classList.remove('active');
  overlay.classList.remove('active');
});

overlay.addEventListener('click', () => {
  sideMenu.classList.remove('active');
  overlay.classList.remove('active');
});

// Mobile Filter Dropdown Functionality
if (mobileFilterBtn && mobileFilterMenu) {
  mobileFilterBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = mobileFilterMenu.classList.contains('open');
    
    if (isOpen) {
      mobileFilterMenu.classList.remove('open');
      mobileFilterBtn.classList.remove('active');
    } else {
      mobileFilterMenu.classList.add('open');
      mobileFilterBtn.classList.add('active');
    }
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!mobileFilterBtn.contains(e.target) && !mobileFilterMenu.contains(e.target)) {
      mobileFilterMenu.classList.remove('open');
      mobileFilterBtn.classList.remove('active');
    }
  });
  
  // Handle mobile filter option selection
  mobileFilterOptions.forEach(option => {
    option.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Remove active class from all options
      mobileFilterOptions.forEach(opt => opt.classList.remove('active'));
      
      // Add active class to clicked option
      option.classList.add('active');
      
      // Update button text
      filterText.textContent = option.textContent;
      
      // Close dropdown
      mobileFilterMenu.classList.remove('open');
      mobileFilterBtn.classList.remove('active');
      
      // Apply filter (use same logic as desktop filters)
      const filter = option.dataset.filter;
      filterPosts(filter);
      
      // Update desktop filter buttons to match
      const desktopFilterBtns = document.querySelectorAll('.filter-btn');
      desktopFilterBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
      });
    });
  });
}

// Logo hover video effect
let logoVideoTimeout;

logoContainer.addEventListener('mouseenter', () => {
  clearTimeout(logoVideoTimeout);
  logoVideo.play().catch(e => console.log('Video play failed:', e));
}, { passive: true });

logoContainer.addEventListener('mouseleave', () => {
  logoVideoTimeout = setTimeout(() => {
    logoVideo.pause();
    logoVideo.currentTime = 0;
  }, 100);
}, { passive: true });

// Posts data (later te vervangen door CMS/API)
let posts = [
  {
    id: 1,
    title: "Character Design Project",
    image: "images/characters.jpg",
    type: "Design",
    date: "2024-01-15",
    featured: true,
    description: "Een uitgebreide character design studie voor een nieuwe animatieserie.",
    client: "Animation Studio XYZ",
    purpose: "Character ontwikkeling voor nieuwe serie",
    tools: "Photoshop, Illustrator, Procreate"
  },
  {
    id: 2,
    title: "Brand Identity",
    image: "images/project2.jpg",
    type: "Branding",
    date: "2024-01-10",
    featured: false,
    description: "Complete merkidentiteit voor een tech startup.",
    client: "TechStart BV",
    purpose: "Volledige rebranding voor marktlancering",
    tools: "Illustrator, InDesign, Figma"
  },
  {
    id: 3,
    title: "Mobile App Design",
    image: "images/project3.jpg",
    type: "UI/UX",
    date: "2024-01-08",
    featured: false,
    description: "Gebruiksvriendelijke mobile app voor fitness tracking.",
    client: "FitLife App",
    purpose: "Intuïtieve fitness tracking experience",
    tools: "Figma, Principle, After Effects"
  },
  {
    id: 4,
    title: "Logo Animation",
    image: "images/project4.jpg",
    type: "Motion",
    date: "2024-01-05",
    featured: true,
    description: "Dynamische logo animatie voor branding purposes.",
    client: "Dynamic Brands",
    purpose: "Levendige merkidentiteit voor video content",
    tools: "After Effects, Cinema 4D, Illustrator"
  },
  {
    id: 5,
    title: "Website Redesign",
    image: "images/project5.png",
    type: "Web",
    date: "2024-01-03",
    featured: false,
    description: "Moderne website redesign met focus op UX.",
    client: "E-commerce Plus",
    purpose: "Verbetering van conversie en gebruikerservaring",
    tools: "Figma, HTML/CSS, JavaScript"
  },
  {
    id: 6,
    title: "Packaging Design",
    image: "images/project6.png",
    type: "Design",
    date: "2024-01-01",
    featured: false,
    description: "Duurzame packaging oplossing voor cosmetica merk.",
    client: "Natural Beauty Co",
    purpose: "Eco-vriendelijke verpakking met premium uitstraling",
    tools: "Illustrator, Photoshop, KeyShot"
  },
  {
    id: 7,
    title: "Streetwear Collection",
    image: "images/project7.png",
    type: "Design",
    date: "2024-01-20",
    featured: false,
    description: "Urban streetwear collectie met focus op duurzaamheid.",
    client: "Urban Culture Brand",
    purpose: "Duurzame streetwear lijn voor jonge doelgroep",
    tools: "Illustrator, Photoshop, CLO 3D"
  },
  {
    id: 8,
    title: "Digital Campaign",
    image: "images/project8.png",
    type: "Design",
    date: "2024-01-18",
    featured: false,
    description: "Digitale campagne voor nieuwe productlancering.",
    client: "Innovation Labs",
    purpose: "Aandacht genereren voor product lancering",
    tools: "Photoshop, After Effects, Premiere Pro"
  },
  {
    id: 9,
    title: "E-commerce Platform",
    image: "images/project9.png",
    type: "Web",
    date: "2024-01-16",
    featured: false,
    description: "Moderne e-commerce platform met seamless UX.",
    client: "ShopEasy BV",
    purpose: "Verhogen van online verkoop en klanttevredenheid",
    tools: "Figma, React, Node.js"
  },
  {
    id: 10,
    title: "Motion Graphics Reel",
    image: "images/project10.png",
    type: "Motion",
    date: "2024-01-14",
    featured: false,
    description: "Showcase van motion graphics projecten.",
    client: "Portfolio showcase",
    purpose: "Demonstratie van motion design vaardigheden",
    tools: "After Effects, Cinema 4D, Premiere Pro"
  },
  {
    id: 11,
    title: "Corporate Identity",
    image: "images/project11.png",
    type: "Branding",
    date: "2024-01-12",
    featured: false,
    description: "Complete corporate identity voor financiële instelling.",
    client: "SecureBank NL",
    purpose: "Professionele en betrouwbare uitstraling",
    tools: "Illustrator, InDesign, Photoshop"
  },
  {
    id: 12,
    title: "Product Photography",
    image: "images/project12.png",
    type: "Photography",
    date: "2024-01-09",
    featured: false,
    description: "High-end product fotografie voor luxe merk.",
    client: "Luxury Goods Inc",
    purpose: "Premium productpresentatie voor e-commerce",
    tools: "Canon 5D, Lightroom, Photoshop"
  }
];

// Load posts from localStorage and merge with default posts
function loadPosts() {
  // Use safeStorage if available, fallback to regular localStorage
  const storage = window.safeStorage || localStorage;
  
  let savedPosts, deletedPosts, overriddenPosts, hiddenHardcodedPosts, overriddenHardcodedPosts;
  
  try {
    savedPosts = JSON.parse(storage.getItem('portfolioPosts') || '[]');
    deletedPosts = JSON.parse(storage.getItem('deletedDefaultPosts') || '[]');
    overriddenPosts = JSON.parse(storage.getItem('overriddenDefaultPosts') || '{}');
    hiddenHardcodedPosts = JSON.parse(storage.getItem('hiddenHardcodedPosts') || '[]');
    overriddenHardcodedPosts = JSON.parse(storage.getItem('overriddenHardcodedPosts') || '{}');
    
    console.log('✅ Successfully loaded portfolio data from storage');
  } catch (e) {
    console.error('❌ Error loading portfolio data:', e);
    // Fallback to empty data
    savedPosts = [];
    deletedPosts = [];
    overriddenPosts = {};
    hiddenHardcodedPosts = [];
    overriddenHardcodedPosts = {};
  }
  
  // Filter out deleted default posts and apply overrides
  const visibleDefaultPosts = posts
    .filter(post => !deletedPosts.includes(post.id))
    .filter(post => !hiddenHardcodedPosts.includes(post.id)) // Also filter hidden hardcoded posts
    .map(post => {
      // Check for hardcoded post overrides first, then regular overrides
      if (overriddenHardcodedPosts[post.id]) {
        return overriddenHardcodedPosts[post.id];
      } else if (overriddenPosts[post.id]) {
        return overriddenPosts[post.id];
      }
      return post;
    });
  
  // Merge saved posts with visible default posts
  const allPosts = [...visibleDefaultPosts, ...savedPosts];
  
  // Remove duplicates based on ID (saved posts override default posts)
  const uniquePosts = [];
  const seenIds = new Set();
  
  for (const post of allPosts) {
    if (!seenIds.has(post.id)) {
      uniquePosts.push(post);
      seenIds.add(post.id);
    }
  }
  
  posts = uniquePosts;
  
  console.log('Posts loaded:', posts.length);
  
  // Update hero section with latest post
  updateHeroSection();
  
  // Always render feed after loading posts
  renderFeed();
}

// Feed rendering functie
function renderFeed() {
  const feedGrid = document.getElementById('postsContainer');
  
  if (!feedGrid) {
    console.error('Posts container not found');
    return;
  }
  
  // Sorteer posts op datum (nieuwste eerst)
  const sortedPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // Use DocumentFragment for better performance
  const fragment = document.createDocumentFragment();
  
  sortedPosts.forEach(post => {
    const postElement = createPostElement(post);
    fragment.appendChild(postElement);
  });
  
  feedGrid.innerHTML = '';
  feedGrid.appendChild(fragment);
}

// Post element maken met Instagram-style multi-image ondersteuning
function createPostElement(post) {
  const postDiv = document.createElement('div');
  postDiv.className = `post-card ${post.featured ? 'featured' : ''}`;
  
  // Handle multiple images or single image
  const images = post.images || [post.image || post.mainImage];
  const mainImage = images[0];
  
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
      
      <div class="post-overlay">
        <div class="post-type">${post.type || post.category || 'Design'}</div>
        ${images.length > 1 ? `<div class="image-count">📷 ${images.length}</div>` : ''}
      </div>
    </div>
  ` : `
    <div class="post-image">
      <img src="${mainImage}" alt="${post.title}" loading="lazy" 
           onerror="this.src='images/placeholder.svg'">
      <div class="post-overlay">
        <div class="post-type">${post.type || post.category || 'Design'}</div>
      </div>
    </div>
  `;
  
  postDiv.innerHTML = `
    ${imageHTML}
    <div class="post-content">
      <h3 class="post-title">${post.title}</h3>
      <p class="post-date">${formatDate(post.date)}</p>
      ${post.description ? `<p class="post-description">${post.description}</p>` : ''}
    </div>
  `;
  
  // Add click handlers for images to open lightbox
  const postImages = postDiv.querySelectorAll('.slide img, .single-image');
  postImages.forEach((img, index) => {
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      openImageLightbox(images, index, post.title);
    });
    img.style.cursor = 'pointer';
  });
  
  // Use event delegation instead of individual listeners for better performance
  postDiv.addEventListener('click', (e) => {
    // Don't trigger modal if clicking on slider controls or images
    if (!e.target.closest('.slider-btn') && !e.target.closest('.indicator') && !e.target.closest('img')) {
      openPostDetail(post);
    }
  }, { passive: true });
  
  return postDiv;
}

// Instagram-style slider functionaliteit voor posts
function changePostSlide(button, direction) {
  const slider = button.closest('.post-image-slider');
  const slides = slider.querySelectorAll('.slide');
  const indicators = slider.querySelectorAll('.indicator');
  
  let currentIndex = Array.from(slides).findIndex(slide => slide.classList.contains('active'));
  
  // Remove active class from current slide and indicator
  slides[currentIndex].classList.remove('active');
  indicators[currentIndex].classList.remove('active');
  
  // Calculate next index
  currentIndex += direction;
  
  if (currentIndex >= slides.length) {
    currentIndex = 0;
  } else if (currentIndex < 0) {
    currentIndex = slides.length - 1;
  }
  
  // Add active class to new slide and indicator
  slides[currentIndex].classList.add('active');
  indicators[currentIndex].classList.add('active');
}

function goToPostSlide(indicator, slideIndex) {
  const slider = indicator.closest('.post-image-slider');
  const slides = slider.querySelectorAll('.slide');
  const indicators = slider.querySelectorAll('.indicator');
  
  // Remove active from all
  slides.forEach(slide => slide.classList.remove('active'));
  indicators.forEach(ind => ind.classList.remove('active'));
  
  // Add active to selected
  slides[slideIndex].classList.add('active');
  indicators[slideIndex].classList.add('active');
}

// Datum formatteren
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return date.toLocaleDateString('nl-NL', options);
}

// Post detail openen met Instagram-style multi-image ondersteuning
function openPostDetail(post) {
  const modal = document.getElementById('postModal');
  const modalImage = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalType = document.getElementById('modalType');
  const modalDate = document.getElementById('modalDate');
  const modalDescription = document.getElementById('modalDescription');
  const modalClient = document.getElementById('modalClient');
  const modalPurpose = document.getElementById('modalPurpose');
  const modalTools = document.getElementById('modalTools');
  const modalProjectType = document.getElementById('modalProjectType');
  const modalProjectDate = document.getElementById('modalProjectDate');
  const modalFeatured = document.getElementById('modalFeatured');

  if (!modal || !modalImage || !modalTitle) {
    console.error('Modal elements not found');
    return;
  }

  // Handle multiple images or single image
  const images = post.images || [post.image || post.mainImage];
  const mainImage = images[0];

  // Fill modal with post data
  modalImage.src = mainImage;
  modalImage.alt = post.title;
  modalTitle.textContent = post.title;
  
  if (modalType) modalType.textContent = `${post.category || post.type}${images.length > 1 ? ` • ${images.length} foto's` : ''}`;
  if (modalDate) modalDate.textContent = formatDate(post.projectDate || post.date);
  if (modalDescription) modalDescription.textContent = post.description || 'Geen beschrijving beschikbaar.';
  if (modalClient) modalClient.textContent = post.client || '-';
  if (modalPurpose) modalPurpose.textContent = post.purpose || '-';
  if (modalTools) modalTools.textContent = post.tools || '-';
  if (modalProjectType) modalProjectType.textContent = post.type || '-';
  if (modalProjectDate) modalProjectDate.textContent = formatDate(post.projectDate || post.date);
  if (modalFeatured) modalFeatured.textContent = post.status || (post.featured ? 'Featured Project' : 'Standaard Project');

  // Add image navigation if multiple images
  if (images.length > 1) {
    // Store images for navigation
    modal.dataset.images = JSON.stringify(images);
    modal.dataset.currentImage = '0';
    
    // Add navigation indicators if not already present
    const modalImageContainer = modalImage.parentNode;
    let navContainer = modalImageContainer.querySelector('.modal-image-nav');
    if (!navContainer) {
      navContainer = document.createElement('div');
      navContainer.className = 'modal-image-nav';
      navContainer.innerHTML = `
        <button class="modal-nav-btn prev" onclick="changeModalImage(-1)">❮</button>
        <button class="modal-nav-btn next" onclick="changeModalImage(1)">❯</button>
      `;
      modalImageContainer.appendChild(navContainer);
    }
    
    // Add counter if not already present
    let counterElement = modalImageContainer.querySelector('.modal-image-counter');
    if (!counterElement) {
      counterElement = document.createElement('div');
      counterElement.className = 'modal-image-counter';
      modalImageContainer.appendChild(counterElement);
    }
    
    counterElement.textContent = `1 / ${images.length}`;
    navContainer.style.display = 'flex';
    counterElement.style.display = 'block';
  } else {
    // Hide navigation for single images
    const modalImageContainer = modalImage.parentNode;
    const navContainer = modalImageContainer.querySelector('.modal-image-nav');
    const counterElement = modalImageContainer.querySelector('.modal-image-counter');
    
    if (navContainer) {
      navContainer.style.display = 'none';
    }
    if (counterElement) {
      counterElement.style.display = 'none';
    }
  }

  // Show modal
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  // Add CTA button if not already present
  let ctaButton = modal.querySelector('.modal-cta-btn');
  if (!ctaButton) {
    ctaButton = document.createElement('button');
    ctaButton.className = 'modal-cta-btn';
    ctaButton.innerHTML = 'Dit wil ik ook';
    ctaButton.addEventListener('click', () => {
      // Track CTA click
      if (typeof gtag !== 'undefined') {
        gtag('event', 'cta_click', {
          event_category: 'Contact',
          event_label: post.title
        });
      }
      
      closePostModal();
      // Redirect to contact
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = 'contact.html';
      }
    });
    
    // Add button to modal content
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
      modalContent.appendChild(ctaButton);
    }
  }
  
  // Track project view
  trackProjectView(post.title);
}

// Image lightbox functionality
function openImageLightbox(images, startIndex = 0, projectTitle = '') {
  // Create lightbox if it doesn't exist
  let lightbox = document.getElementById('imageLightbox');
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.id = 'imageLightbox';
    lightbox.className = 'image-lightbox';
    lightbox.innerHTML = `
      <div class="lightbox-backdrop"></div>
      <div class="lightbox-container">
        <button class="lightbox-close">&times;</button>
        <button class="lightbox-nav prev">❮</button>
        <button class="lightbox-nav next">❯</button>
        <img class="lightbox-image" alt="">
        <div class="lightbox-info">
          <span class="lightbox-counter"></span>
          <span class="lightbox-title"></span>
        </div>
        <div class="lightbox-cta">
          <button class="cta-like-btn">❤️ Vind je dit mooi?</button>
          <p>Wil je ook zoiets? Laten we praten!</p>
        </div>
      </div>
    `;
    document.body.appendChild(lightbox);
    
    // Add event listeners
    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-backdrop').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-nav.prev').addEventListener('click', () => changeLightboxImage(-1));
    lightbox.querySelector('.lightbox-nav.next').addEventListener('click', () => changeLightboxImage(1));
    lightbox.querySelector('.cta-like-btn').addEventListener('click', handleLikeAction);
    
    // Keyboard navigation
    document.addEventListener('keydown', handleLightboxKeydown);
  }
  
  // Set up lightbox data
  lightbox.dataset.images = JSON.stringify(images);
  lightbox.dataset.currentIndex = startIndex;
  lightbox.dataset.projectTitle = projectTitle;
  
  // Update display
  updateLightboxDisplay();
  
  // Show lightbox
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function updateLightboxDisplay() {
  const lightbox = document.getElementById('imageLightbox');
  const images = JSON.parse(lightbox.dataset.images);
  const currentIndex = parseInt(lightbox.dataset.currentIndex);
  const projectTitle = lightbox.dataset.projectTitle;
  
  const lightboxImage = lightbox.querySelector('.lightbox-image');
  const counter = lightbox.querySelector('.lightbox-counter');
  const title = lightbox.querySelector('.lightbox-title');
  const prevBtn = lightbox.querySelector('.lightbox-nav.prev');
  const nextBtn = lightbox.querySelector('.lightbox-nav.next');
  
  lightboxImage.src = images[currentIndex];
  lightboxImage.alt = `${projectTitle} - Afbeelding ${currentIndex + 1}`;
  counter.textContent = `${currentIndex + 1} / ${images.length}`;
  title.textContent = projectTitle;
  
  // Show/hide navigation buttons
  prevBtn.style.display = images.length > 1 ? 'block' : 'none';
  nextBtn.style.display = images.length > 1 ? 'block' : 'none';
}

function changeLightboxImage(direction) {
  const lightbox = document.getElementById('imageLightbox');
  const images = JSON.parse(lightbox.dataset.images);
  let currentIndex = parseInt(lightbox.dataset.currentIndex);
  
  currentIndex += direction;
  
  if (currentIndex >= images.length) {
    currentIndex = 0;
  } else if (currentIndex < 0) {
    currentIndex = images.length - 1;
  }
  
  lightbox.dataset.currentIndex = currentIndex;
  updateLightboxDisplay();
}

function closeLightbox() {
  const lightbox = document.getElementById('imageLightbox');
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
  document.removeEventListener('keydown', handleLightboxKeydown);
}

function handleLightboxKeydown(e) {
  if (e.key === 'Escape') {
    closeLightbox();
  } else if (e.key === 'ArrowLeft') {
    changeLightboxImage(-1);
  } else if (e.key === 'ArrowRight') {
    changeLightboxImage(1);
  }
}

function handleLikeAction() {
  const lightbox = document.getElementById('imageLightbox');
  const projectTitle = lightbox.dataset.projectTitle;
  
  // Track the like action
  if (typeof gtag !== 'undefined') {
    gtag('event', 'like_project', {
      event_category: 'Engagement',
      event_label: projectTitle
    });
  }
  
  // Show contact CTA
  const ctaBtn = lightbox.querySelector('.cta-like-btn');
  ctaBtn.innerHTML = '✅ Geliked!';
  ctaBtn.style.background = '#27ae60';
  
  // Redirect to contact after short delay
  setTimeout(() => {
    closeLightbox();
    // Scroll to contact section or open contact page
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = 'contact.html';
    }
  }, 1500);
}

// Modal image navigation
function changeModalImage(direction) {
  const modal = document.getElementById('postModal');
  const modalImage = document.getElementById('modalImage');
  
  if (!modal.dataset.images) return;
  
  const images = JSON.parse(modal.dataset.images);
  let currentIndex = parseInt(modal.dataset.currentImage);
  
  currentIndex += direction;
  
  if (currentIndex >= images.length) {
    currentIndex = 0;
  } else if (currentIndex < 0) {
    currentIndex = images.length - 1;
  }
  
  modalImage.src = images[currentIndex];
  modal.dataset.currentImage = currentIndex;
  
  // Update counter
  const modalImageContainer = modalImage.parentNode;
  const counter = modalImageContainer.querySelector('.modal-image-counter');
  if (counter) {
    counter.textContent = `${currentIndex + 1} / ${images.length}`;
  }
}

// Close modal functionality
function closePostModal() {
  const modal = document.getElementById('postModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// Modal event listeners
document.addEventListener('DOMContentLoaded', () => {
  const closeModalBtn = document.getElementById('modalClose');
  const modal = document.getElementById('postModal');

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closePostModal);
  }
  
  // Close modal when clicking outside
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closePostModal();
      }
    });
  }

  // Close modal with escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closePostModal();
    }
  });
});

// Scroll to specific post in feed
function scrollToPost(postId) {
  const feedSection = document.querySelector('.feed');
  const headerHeight = document.querySelector('.navbar').offsetHeight;
  
  // First scroll to feed section
  window.scrollTo({
    top: feedSection.offsetTop - headerHeight - 20,
    behavior: 'smooth'
  });
  
  // Then try to find and highlight the specific post
  setTimeout(() => {
    const postCards = document.querySelectorAll('.post-card');
    postCards.forEach(card => {
      const postTitle = card.querySelector('.post-title').textContent;
      const currentPost = posts.find(p => p.title === postTitle);
      
      if (currentPost && currentPost.id === postId) {
        // Add highlight effect
        card.style.border = '3px solid #ff4444';
        card.style.transform = 'scale(1.02)';
        
        // Remove highlight after 3 seconds
        setTimeout(() => {
          if (!card.classList.contains('featured')) {
            card.style.border = 'none';
          }
          card.style.transform = 'none';
        }, 3000);
      }
    });
  }, 500);
}

// Nieuwe post toevoegen functie (voor toekomstige mobile upload)
function addNewPost(postData) {
  const newPost = {
    id: posts.length + 1,
    ...postData,
    date: new Date().toISOString().split('T')[0]
  };
  
  posts.unshift(newPost); // Voeg toe aan het begin van de array
  
  // Update hero section with the new post
  updateHeroSection();
  
  // Re-render de feed met nieuwe post animation
  const feedGrid = document.getElementById('postsContainer');
  const newPostElement = createPostElement(newPost);
  
  // Insert at the beginning of the grid
  feedGrid.insertBefore(newPostElement, feedGrid.firstChild);
  
  // Update localStorage with safe storage
  const storage = window.safeStorage || localStorage;
  
  try {
    const savedPosts = JSON.parse(storage.getItem('portfolioPosts') || '[]');
    savedPosts.unshift(newPost);
    storage.setItem('portfolioPosts', JSON.stringify(savedPosts));
    console.log('✅ Successfully saved new post to storage');
  } catch (e) {
    console.error('❌ Error saving new post:', e);
  }
}

// Filter posts functie (voor toekomstige filtering)
function filterPosts(type = 'all') {
  const feedGrid = document.getElementById('postsContainer');
  const filteredPosts = type === 'all' ? posts : posts.filter(post => post.type === type);
  
  // Use DocumentFragment for better performance
  const fragment = document.createDocumentFragment();
  
  filteredPosts.forEach(post => {
    const postElement = createPostElement(post);
    fragment.appendChild(postElement);
  });
  
  feedGrid.innerHTML = '';
  feedGrid.appendChild(fragment);
}

// Placeholder image fallback
function createPlaceholderImage() {
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 300;
  const ctx = canvas.getContext('2d');
  
  // Gradient background
  const gradient = ctx.createLinearGradient(0, 0, 400, 300);
  gradient.addColorStop(0, '#f0f0f0');
  gradient.addColorStop(1, '#e0e0e0');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 400, 300);
  
  // Text
  ctx.fillStyle = '#999';
  ctx.font = '16px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Image not found', 200, 150);
  
  return canvas.toDataURL();
}

// Initialize feed when page loads
document.addEventListener('DOMContentLoaded', () => {
  loadPosts(); // Load posts from localStorage first
  renderFeed();
  initializeFilters();
  initializeInteractiveElements(); // Initialize new interactive features
  initializeAdminPanel(); // Initialize admin panel if on admin page
});

// Debug function to reset localStorage if needed
function resetPortfolioData() {
  localStorage.removeItem('portfolioPosts');
  localStorage.removeItem('deletedDefaultPosts');
  localStorage.removeItem('overriddenDefaultPosts');
  localStorage.removeItem('newPostAdded');
  console.log('Portfolio data reset. Reloading page...');
  location.reload();
}

// Expose reset function to console for debugging
window.resetPortfolioData = resetPortfolioData;

// Listen for storage changes (new posts added from admin panel)
window.addEventListener('storage', (e) => {
  console.log('Storage event detected:', e.key);
  if (e.key === 'newPostAdded' || 
      e.key === 'portfolioPosts' || 
      e.key === 'portfolioUpdated' ||
      e.key === 'lastPortfolioUpdate' ||
      e.key === 'forcePortfolioReload' ||
      e.key === 'forceRefresh' ||
      e.key === 'deletedDefaultPosts' || 
      e.key === 'overriddenDefaultPosts') {
    // Reload posts and update hero when posts are modified
    console.log('🔄 Storage change detected, reloading posts...');
    setTimeout(() => {
      loadPosts();
      renderFeed();
      updateHeroSection();
    }, 100); // Small delay to ensure storage is updated
  }
});

// Also listen for storage changes in the same tab
window.addEventListener('focus', () => {
  // Check if there are new posts when returning to the tab
  console.log('🔍 Window focus detected, checking for updates...');
  
  // Use safe storage
  const storage = window.safeStorage || localStorage;
  
  try {
    // Check multiple storage keys for updates
    const portfolioUpdated = storage.getItem('portfolioUpdated');
    const newPostAdded = storage.getItem('newPostAdded');
    const lastUpdate = storage.getItem('lastPortfolioUpdate');
    const sessionUpdate = (typeof sessionStorage !== 'undefined') ? sessionStorage.getItem('portfolioNeedsUpdate') : null;
    
    if (portfolioUpdated || newPostAdded || lastUpdate || sessionUpdate) {
      console.log('📥 Updates found, reloading...');
      loadPosts();
      renderFeed();
      updateHeroSection();
      
      // Clear the flags
      storage.removeItem('newPostAdded');
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.removeItem('portfolioNeedsUpdate');
      }
    }
  } catch (e) {
    console.error('❌ Error checking for updates:', e);
  }
});

// Check for updates when page becomes visible
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    console.log('Page became visible, checking for updates...');
    loadPosts();
    renderFeed();
    updateHeroSection();
  }
});

// Listen for direct messages from admin panel
window.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PORTFOLIO_UPDATED') {
    console.log('📡 Direct update signal received from admin panel');
    loadPosts();
    renderFeed();
    updateHeroSection();
  }
});

// Force reload posts periodically when page is active (especially for file:// protocol)
setInterval(() => {
  if (!document.hidden) {
    const lastUpdate = localStorage.getItem('lastPortfolioUpdate');
    const lastCheck = sessionStorage.getItem('lastPortfolioCheck');
    
    if (lastUpdate && lastUpdate !== lastCheck) {
      console.log('🔄 Periodic update check - reloading posts');
      loadPosts();
      renderFeed();
      updateHeroSection();
      sessionStorage.setItem('lastPortfolioCheck', lastUpdate);
    }
    
    // Also check for new posts flag
    const newPostAdded = localStorage.getItem('newPostAdded');
    if (newPostAdded === 'true') {
      console.log('🆕 New post flag detected - reloading');
      loadPosts();
      renderFeed();
      updateHeroSection();
      localStorage.removeItem('newPostAdded');
    }
  }
}, 1000); // Check every 1 second for file:// protocol

// Initialize filter functionality
function initializeFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      button.classList.add('active');
      
      // Filter posts
      const filterType = button.getAttribute('data-filter');
      filterPosts(filterType);
      
      // Update mobile dropdown to match
      if (mobileFilterOptions && filterText) {
        mobileFilterOptions.forEach(opt => opt.classList.remove('active'));
        const matchingMobileOption = Array.from(mobileFilterOptions).find(opt => opt.dataset.filter === filterType);
        if (matchingMobileOption) {
          matchingMobileOption.classList.add('active');
          filterText.textContent = matchingMobileOption.textContent;
        }
      }
    });
  });
}

// Hero image click handler - scroll to feed and highlight latest post
document.querySelector('.hero-image').addEventListener('click', () => {
  // Get the latest post
  const sortedPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  const latestPost = sortedPosts[0];
  
  if (latestPost) {
    scrollToPost(latestPost.id);
  } else {
    // Fallback: just scroll to feed
    const feedSection = document.querySelector('.feed');
    const headerHeight = document.querySelector('.navbar').offsetHeight;
    
    window.scrollTo({
      top: feedSection.offsetTop - headerHeight - 20,
      behavior: 'smooth'
    });
  }
});

// Update hero with latest post
function updateHeroSection() {
  // Sort posts by date to get the latest one
  const sortedPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  const latestPost = sortedPosts[0];
  
  if (latestPost && heroImage && postBadge) {
    // Update hero image
    heroImage.src = latestPost.image;
    heroImage.alt = latestPost.title;
    
    // Update post badge with latest post info
    postBadge.innerHTML = `NEW POST: ${latestPost.title.toUpperCase()} <span class="badge-arrow">→</span>`;
    
    // Add error handling for image loading
    heroImage.onerror = function() {
      this.src = 'images/placeholder.svg';
      this.alt = 'Image not available';
    };
  }
}

// BOLD and ORDINARY word interaction effects
document.addEventListener('DOMContentLoaded', function() {
  const boldWord = document.querySelector('.bold-word');
  const ordinaryWord = document.querySelector('.ordinary-word');
  
  if (boldWord && ordinaryWord) {
    // Enhanced interaction: only BOLD affects ORDINARY, not the other way around
    boldWord.addEventListener('mouseenter', () => {
      ordinaryWord.style.opacity = '0.2';
      ordinaryWord.style.filter = 'blur(4px)';
      ordinaryWord.style.color = '#bbb';
    });
    
    boldWord.addEventListener('mouseleave', () => {
      ordinaryWord.style.opacity = '1';
      ordinaryWord.style.filter = 'none';
      ordinaryWord.style.color = '#222';
    });
    
    // Letter-by-letter reveal effect for BOLD
    boldWord.addEventListener('mouseenter', () => {
      const text = boldWord.textContent;
      boldWord.innerHTML = '';
      
      [...text].forEach((letter, index) => {
        const span = document.createElement('span');
        span.textContent = letter;
        span.style.opacity = '0';
        span.style.color = '#3498db';
        span.style.transform = 'translateY(20px)';
        span.style.transition = `all 0.1s ease ${index * 0.05}s`;
        boldWord.appendChild(span);
        
        setTimeout(() => {
          span.style.opacity = '1';
          span.style.transform = 'translateY(0)';
        }, index * 50);
      });
    });
    
    boldWord.addEventListener('mouseleave', () => {
      setTimeout(() => {
        boldWord.innerHTML = 'BOLD';
      }, 300);
    });
    
    // Sound effect simulation (visual feedback)
    const addRippleEffect = (element) => {
      const ripple = document.createElement('div');
      ripple.style.position = 'absolute';
      ripple.style.borderRadius = '50%';
      ripple.style.background = 'rgba(52, 152, 219, 0.3)';
      ripple.style.transform = 'scale(0)';
      ripple.style.animation = 'ripple 0.6s ease-out';
      ripple.style.left = '50%';
      ripple.style.top = '50%';
      ripple.style.width = '100px';
      ripple.style.height = '100px';
      ripple.style.marginLeft = '-50px';
      ripple.style.marginTop = '-50px';
      ripple.style.pointerEvents = 'none';
      ripple.style.zIndex = '-1';
      
      element.style.position = 'relative';
      element.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    };
    
    boldWord.addEventListener('click', () => addRippleEffect(boldWord));
    ordinaryWord.addEventListener('click', () => addRippleEffect(ordinaryWord));
  }
});

// Add ripple animation to CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// About Me Section Animations
document.addEventListener('DOMContentLoaded', () => {
  // Animated counter for statistics
  function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        element.textContent = target;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(start);
      }
    }, 16);
  }

  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        
        // Animate counters when stats section is visible
        if (entry.target.classList.contains('about-stats')) {
          const statNumbers = entry.target.querySelectorAll('.stat-number');
          statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            animateCounter(stat, target);
          });
        }
      }
    });
  }, observerOptions);

  // Observe about section elements
  const aboutElements = document.querySelectorAll('.about-card, .about-stats, .floating-elements');
  aboutElements.forEach(el => observer.observe(el));

  // Parallax effect for floating elements
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const floatingItems = document.querySelectorAll('.float-item');
    
    floatingItems.forEach((item, index) => {
      const speed = item.dataset.speed || 1;
      const yPos = -(scrolled * speed * 0.1);
      item.style.transform = `translateY(${yPos}px) rotate(${scrolled * 0.02}deg)`;
    });
  });

  // Add smooth entrance animations
  const aboutCards = document.querySelectorAll('.about-card');
  aboutCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.2}s`;
  });
});

// CSS for entrance animations
const aboutAnimationStyle = document.createElement('style');
aboutAnimationStyle.textContent = `
  .about-card {
    opacity: 0;
    transform: translateY(50px);
    animation: slideInUp 0.6s ease forwards;
  }

  .about-stats {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s ease;
  }

  .about-stats.animate-in {
    opacity: 1;
    transform: translateY(0);
  }

  .floating-elements {
    opacity: 0;
    transform: scale(0.8);
    transition: all 0.8s ease;
  }

  .floating-elements.animate-in {
    opacity: 1;
    transform: scale(1);
  }

  @keyframes slideInUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .about-card:hover .card-icon {
    animation-play-state: paused;
    transform: scale(1.1);
  }
`;
document.head.appendChild(aboutAnimationStyle);

// Menu navigation functions
function scrollToFeed() {
  const feedSection = document.querySelector('.feed');
  if (feedSection) {
    feedSection.scrollIntoView({ behavior: 'smooth' });
  }
  // Close menu after click
  sideMenu.classList.remove('active');
  overlay.classList.remove('active');
}

// Contact form handler
function handleContactForm(event) {
  event.preventDefault();
  
  // Get form data
  const formData = new FormData(event.target);
  const name = formData.get('naam') || event.target.querySelector('input[placeholder="Naam"]').value;
  const email = formData.get('email') || event.target.querySelector('input[placeholder="Email"]').value;
  const message = formData.get('bericht') || event.target.querySelector('textarea[placeholder="Bericht"]').value;
  
  // Simple validation
  if (!name || !email || !message) {
    alert('Vul alle velden in.');
    return;
  }
  
  // Create mailto link
  const subject = encodeURIComponent(`Portfolio Contact: ${name}`);
  const body = encodeURIComponent(`Naam: ${name}\nEmail: ${email}\n\nBericht:\n${message}`);
  const mailtoLink = `mailto:jesse@example.com?subject=${subject}&body=${body}`;
  
  // Open email client
  window.location.href = mailtoLink;
  
  // Reset form
  event.target.reset();
  
  // Show success message
  const button = event.target.querySelector('button[type="submit"]');
  const originalText = button.innerHTML;
  button.innerHTML = '✓ Verzonden!';
  button.style.background = '#4CAF50';
  
  setTimeout(() => {
    button.innerHTML = originalText;
    button.style.background = '';
  }, 3000);
}
