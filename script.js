/**
 * JESSE HIELEMA PORTFOLIO - MAIN JAVASCRIPT
 * Premium gallery experience with smooth animations
 */

// === CONFIGURATION ===
const CONFIG = {
  preloader: {
    duration: 2500, // Total loading duration in ms
    minDuration: 1500 // Minimum duration to show preloader
  },
  horizontal: {
    cardWidth: 450, // Width of each gallery card
    cardGap: 40, // Gap between cards
    triggerStart: 'top top',
    triggerEnd: '+=300%' // Adjust based on number of cards
  }
};

// === UTILITIES ===
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// === PRELOADER ===
class Preloader {
  constructor() {
    this.preloader = $('#preloader');
    this.progressCircle = $('#progressCircle');
    this.percentage = $('#preloaderPercentage');
    this.logo = $('.preloader-logo-img');
    this.rippleContainer = $('#rippleContainer');
    this.startTime = Date.now();
    this.circumference = 2 * Math.PI * 90; // radius = 90
    
    if (!this.preloader) return;
    
    // Add loading class to body
    document.body.classList.add('loading');
    
    this.init();
  }
  
  init() {
    // Initialize circle
    if (this.progressCircle) {
      this.progressCircle.style.strokeDasharray = this.circumference;
      this.progressCircle.style.strokeDashoffset = this.circumference;
    }
    
    // Start loading animation
    this.animateProgress();
    
    // Wait for minimum duration and actual page load
    Promise.all([
      this.waitMinDuration(),
      this.waitPageLoad()
    ]).then(() => {
      this.complete();
    });
  }
  
  animateProgress() {
    const duration = CONFIG.preloader.duration;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      // Stop at 95% until page is actually loaded
      const progress = Math.min((elapsed / duration) * 0.95, 0.95);
      
      // Update circle
      const offset = this.circumference - (progress * this.circumference);
      if (this.progressCircle) {
        this.progressCircle.style.strokeDashoffset = offset;
      }
      
      // Update percentage
      if (this.percentage) {
        this.percentage.textContent = Math.floor(progress * 100) + '%';
      }
      
      if (progress < 0.95) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }
  
  waitMinDuration() {
    return new Promise(resolve => {
      setTimeout(resolve, CONFIG.preloader.minDuration);
    });
  }
  
  waitPageLoad() {
    return new Promise(resolve => {
      if (document.readyState === 'complete') {
        resolve();
      } else {
        window.addEventListener('load', resolve);
      }
    });
  }
  
  complete() {
    // Animate from 95% to 100%
    const startOffset = this.circumference * 0.05; // 95%
    const startTime = Date.now();
    const fillDuration = 600; // Duration to fill last 5%
    
    const finishAnimation = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / fillDuration, 1);
      const easeProgress = this.easeOutCubic(progress);
      
      const currentOffset = startOffset - (startOffset * easeProgress);
      const currentPercentage = 95 + (5 * easeProgress);
      
      if (this.progressCircle) {
        this.progressCircle.style.strokeDashoffset = currentOffset;
      }
      if (this.percentage) {
        this.percentage.textContent = Math.floor(currentPercentage) + '%';
      }
      
      if (progress < 1) {
        requestAnimationFrame(finishAnimation);
      } else {
        // Completed at 100%
        setTimeout(() => {
          this.fadeOutWithScale();
        }, 400);
      }
    };
    
    requestAnimationFrame(finishAnimation);
  }
  
  easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }
  
  fadeOutWithScale() {
    // Trigger ripple effect
    if (this.rippleContainer) {
      this.rippleContainer.classList.add('active');
    }
    
    // Scale down and fade out preloader content
    const preloaderContent = $('.preloader-content');
    if (preloaderContent) {
      preloaderContent.style.transition = 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
      preloaderContent.style.opacity = '0';
      preloaderContent.style.transform = 'scale(0.9)';
    }
    
    // Start entrance animations during ripple
    setTimeout(() => {
      this.triggerEntranceAnimations();
    }, 600);
    
    setTimeout(() => {
      this.remove();
    }, 1600);
  }
  
  remove() {
    document.body.classList.remove('loading');
    if (this.preloader) {
      this.preloader.remove();
    }
    
    // Trigger entrance animations
    this.triggerEntranceAnimations();
  }
  
  triggerEntranceAnimations() {
    // Animate hero title
    const heroTitle = $('.hero-title');
    if (heroTitle) {
      setTimeout(() => {
        heroTitle.style.transition = 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        heroTitle.style.opacity = '1';
        heroTitle.style.transform = 'translateY(0)';
      }, 100);
    }
    
    // Animate hero quote
    const heroQuote = $('.hero-quote');
    if (heroQuote) {
      setTimeout(() => {
        heroQuote.style.transition = 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        heroQuote.style.opacity = '1';
        heroQuote.style.transform = 'translateY(0)';
      }, 250);
    }
    
    // Animate hero video
    const heroVideo = $('.hero-video');
    if (heroVideo) {
      setTimeout(() => {
        heroVideo.style.transition = 'opacity 1s ease';
        heroVideo.style.opacity = '1';
      }, 400);
    }
    
    // Animate hero image
    const heroImage = $('.hero-image');
    if (heroImage) {
      setTimeout(() => {
        heroImage.style.transition = 'opacity 1s ease';
        heroImage.style.opacity = '1';
      }, 400);
    }
    
    // Fade in navbar
    const navbar = $('.navbar');
    if (navbar) {
      navbar.style.opacity = '0';
      setTimeout(() => {
        navbar.style.transition = 'opacity 0.6s ease';
        navbar.style.opacity = '1';
      }, 150);
    }
    // Fade in hero mosaic items
    const mosaicItems = $$('.mosaic-item');
    
    if (window.gsap && !prefersReducedMotion) {
      gsap.from(mosaicItems, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out'
      });
    } else {
      // Fallback without GSAP
      mosaicItems.forEach((item, index) => {
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        }, index * 100);
      });
    }
  }
}

// === QUOTE ANIMATION ===
class QuoteAnimation {
  constructor() {
    this.container = $('#quoteAnimated');
    if (!this.container) return;
    
    this.words = Array.from(this.container.querySelectorAll('.quote-word'));
    this.currentIndex = 0;
    this.interval = null;
    
    // Check for reduced motion
    if (prefersReducedMotion) {
      this.showStaticWord();
      return;
    }
    
    this.init();
  }
  
  init() {
    // Show first word immediately
    this.showWord(0);
    
    // Start cycling after entrance animation
    setTimeout(() => {
      this.startCycling();
    }, 3000);
  }
  
  showStaticWord() {
    // Show "feel at home" for reduced motion
    const feelAtHomeWord = this.words.find(w => w.dataset.color === '#8FA88C');
    if (feelAtHomeWord) {
      feelAtHomeWord.classList.add('active');
      feelAtHomeWord.style.color = feelAtHomeWord.dataset.color;
    }
  }
  
  showWord(index) {
    const word = this.words[index];
    if (!word) return;
    
    word.classList.add('active');
    word.style.color = word.dataset.color;
  }
  
  hideWord(index) {
    const word = this.words[index];
    if (!word) return;
    
    word.classList.add('exiting');
    word.classList.remove('active');
    
    setTimeout(() => {
      word.classList.remove('exiting');
    }, 700);
  }
  
  startCycling() {
    this.interval = setInterval(() => {
      const nextIndex = (this.currentIndex + 1) % this.words.length;
      
      this.hideWord(this.currentIndex);
      
      setTimeout(() => {
        this.showWord(nextIndex);
        this.currentIndex = nextIndex;
      }, 350);
      
    }, 2800); // 2.8s visible + 0.7s transition
  }
  
  destroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}

// === NAVIGATION ===
class Navigation {
  constructor() {
    this.navbar = $('.navbar');
    this.menuBtn = $('#menuBtn');
    this.sideMenu = $('#sideMenu');
    this.closeBtn = $('#closeMenu');
    this.pageWrapper = $('#pageWrapper');
    this.menuContent = $('.menu-content');
    
    if (!this.navbar) return;
    
    this.init();
  }
  
  init() {
    // Scroll behavior
    this.handleScroll();
    window.addEventListener('scroll', () => this.handleScroll());
    
    // Menu toggle
    if (this.menuBtn && this.sideMenu) {
      this.menuBtn.addEventListener('click', () => this.openMenu());
    }
    
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.closeMenu());
    }
    
    // Close menu on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.sideMenu.classList.contains('active')) {
        this.closeMenu();
      }
    });
    
    // Auto-scroll functionality on hover
    this.initAutoScroll();
  }
  
  handleScroll() {
    if (window.scrollY > 100) {
      this.navbar.classList.add('scrolled');
    } else {
      this.navbar.classList.remove('scrolled');
    }
  }
  
  openMenu() {
    this.sideMenu.classList.add('active');
    if (this.pageWrapper) {
      this.pageWrapper.classList.add('menu-open');
    }
    document.body.style.overflow = 'hidden';
  }
  
  closeMenu() {
    this.sideMenu.classList.remove('active');
    if (this.pageWrapper) {
      this.pageWrapper.classList.remove('menu-open');
    }
    document.body.style.overflow = '';
  }
  
  initAutoScroll() {
    if (!this.menuContent) return;
    
    let scrollSpeed = 0;
    let isScrolling = false;
    let animationId = null;
    
    const AUTO_SCROLL_THRESHOLD = 50; // pixels from top/bottom to trigger
    const MAX_SCROLL_SPEED = 15; // max pixels per frame
    
    const autoScroll = () => {
      if (isScrolling) {
        this.menuContent.scrollTop += scrollSpeed;
        animationId = requestAnimationFrame(autoScroll);
      }
    };
    
    this.menuContent.addEventListener('mousemove', (e) => {
      const rect = this.menuContent.getBoundingClientRect();
      const mouseY = e.clientY - rect.top;
      const height = rect.height;
      
      // Calculate distance from top and bottom
      const distanceFromTop = mouseY;
      const distanceFromBottom = height - mouseY;
      
      // Scroll down when near bottom
      if (distanceFromBottom < AUTO_SCROLL_THRESHOLD) {
        const intensity = 1 - (distanceFromBottom / AUTO_SCROLL_THRESHOLD);
        scrollSpeed = intensity * MAX_SCROLL_SPEED;
        
        if (!isScrolling) {
          isScrolling = true;
          autoScroll();
        }
      }
      // Scroll up when near top
      else if (distanceFromTop < AUTO_SCROLL_THRESHOLD) {
        const intensity = 1 - (distanceFromTop / AUTO_SCROLL_THRESHOLD);
        scrollSpeed = -intensity * MAX_SCROLL_SPEED;
        
        if (!isScrolling) {
          isScrolling = true;
          autoScroll();
        }
      }
      // Stop scrolling when in middle area
      else {
        isScrolling = false;
        scrollSpeed = 0;
        if (animationId) {
          cancelAnimationFrame(animationId);
          animationId = null;
        }
      }
    });
    
    this.menuContent.addEventListener('mouseleave', () => {
      isScrolling = false;
      scrollSpeed = 0;
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    });
    
    // Visual feedback: add hover zones
    const createHoverZone = (position) => {
      const zone = document.createElement('div');
      zone.className = `menu-scroll-zone menu-scroll-zone-${position}`;
      zone.style.cssText = `
        position: absolute;
        ${position}: 0;
        left: 0;
        right: 0;
        height: ${AUTO_SCROLL_THRESHOLD}px;
        pointer-events: none;
        background: linear-gradient(to ${position === 'top' ? 'bottom' : 'top'}, 
          rgba(228, 87, 46, 0.1), transparent);
        opacity: 0;
        transition: opacity 0.3s;
        z-index: 1;
      `;
      return zone;
    };
    
    const topZone = createHoverZone('top');
    const bottomZone = createHoverZone('bottom');
    
    this.menuContent.style.position = 'relative';
    this.menuContent.appendChild(topZone);
    this.menuContent.appendChild(bottomZone);
    
    // Show zones when hovering near edges
    this.menuContent.addEventListener('mousemove', (e) => {
      const rect = this.menuContent.getBoundingClientRect();
      const mouseY = e.clientY - rect.top;
      const height = rect.height;
      
      if (mouseY < AUTO_SCROLL_THRESHOLD) {
        topZone.style.opacity = '1';
        bottomZone.style.opacity = '0';
      } else if ((height - mouseY) < AUTO_SCROLL_THRESHOLD) {
        topZone.style.opacity = '0';
        bottomZone.style.opacity = '1';
      } else {
        topZone.style.opacity = '0';
        bottomZone.style.opacity = '0';
      }
    });
  }
}

// === 3D PARALLAX GRID ===
class ParallaxGrid {
  constructor() {
    this.grid = $('#parallaxGrid');
    this.items = $$('.grid-item');
    
    if (!this.grid || !this.items.length) return;
    
    this.isMobile = /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent);
    this.init();
  }
  
  init() {
    if (this.isMobile) {
      this.initGyroscope();
    } else {
      this.initMouseParallax();
    }
  }
  
  initMouseParallax() {
    this.grid.addEventListener('mousemove', (e) => {
      const rect = this.grid.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      
      this.items.forEach((item) => {
        const depth = parseFloat(item.dataset.depth) || 0.2;
        const rotateX = y * depth * 15;
        const rotateY = -x * depth * 15;
        
        item.style.transform = `
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
        `;
      });
    });
    
    this.grid.addEventListener('mouseleave', () => {
      this.items.forEach((item) => {
        item.style.transform = 'rotateX(0) rotateY(0)';
      });
    });
  }
  
  initGyroscope() {
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', (e) => {
        const gamma = e.gamma || 0; // Left to right tilt (-90 to 90)
        const beta = e.beta || 0;   // Front to back tilt (-180 to 180)
        
        const x = gamma / 90;
        const y = (beta - 90) / 90;
        
        this.items.forEach((item) => {
          const depth = parseFloat(item.dataset.depth) || 0.2;
          const rotateX = y * depth * 8;
          const rotateY = -x * depth * 8;
          
          item.style.transform = `
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
          `;
        });
      });
    }
  }
}

// === MOSAIC INTERACTIONS ===
class MosaicGallery {
  constructor() {
    this.items = $$('.mosaic-item');
    
    if (!this.items.length) return;
    
    this.init();
  }
  
  init() {
    this.items.forEach(item => {
      // Make focusable for keyboard navigation
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      
      // Click/Enter handler
      const handleActivate = (e) => {
        if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
        
        e.preventDefault();
        const projectId = item.dataset.project;
        this.openProject(projectId);
      };
      
      item.addEventListener('click', handleActivate);
      item.addEventListener('keydown', handleActivate);
    });
  }
  
  openProject(projectId) {
    console.log('Opening project:', projectId);
    // TODO: Implement project modal or navigation
    // For now, just log to console
    alert(`Opening project: ${projectId}\n\nYou can implement a modal or navigate to a project page here.`);
  }
}

// === SCROLL ANIMATIONS ===
class ScrollAnimations {
  constructor() {
    if (!window.gsap || !window.ScrollTrigger) return;
    
    this.init();
  }
  
  init() {
    gsap.registerPlugin(ScrollTrigger);
  }
}

// === PERFORMANCE OPTIMIZATION ===
class PerformanceOptimizer {
  constructor() {
    this.init();
  }
  
  init() {
    // Lazy load images
    this.lazyLoadImages();
    
    // Optimize scroll performance
    this.optimizeScroll();
  }
  
  lazyLoadImages() {
    const images = $$('[data-src]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        });
      });
      
      images.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback: load all images
      images.forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      });
    }
  }
  
  optimizeScroll() {
    let ticking = false;
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Scroll handlers are already optimized
          ticking = false;
        });
        
        ticking = true;
      }
    });
  }
}

// === HORIZONTAL SCROLL GALLERY ===
class HorizontalScroll {
  constructor() {
    this.heroSection = $('#heroWhiteSection');
    this.zoomWrapper = $('#galleryZoomWrapper');
    this.section = $('#horizontalScrollSection');
    this.track = $('#horizontalTrack');
    this.container = $('.horizontal-scroll-container');
    this.labels = $('#projectLabels');
    this.projectInfo = $('#projectInfo');
    this.projectInfoTitle = $('#projectInfoTitle');
    this.projectInfoDescription = $('#projectInfoDescription');
    this.projectInfoDate = $('#projectInfoDate');
    this.scrollItems = [];
    this.labelItems = [];
    this.currentIndex = 0;
    this.isHovering = false;
    this.scrollTriggerInstance = null;
    this.infoVisible = false;
    this.isZoomed = false;
    
    if (!this.section || !this.track || !this.labels) return;
    
    this.init();
  }
  
  init() {
    // Get all scroll items and labels
    this.scrollItems = Array.from(this.track.querySelectorAll('.scroll-item'));
    this.labelItems = Array.from(this.labels.querySelectorAll('.label-item'));
    
    // Set initial active label
    this.updateLabels(0);
    
    // Calculate total scroll distance
    // Add extra distance so the last item can reach the center
    const trackWidth = this.track.scrollWidth;
    const containerWidth = this.section.offsetWidth;
    const extraDistance = containerWidth / 2;
    const scrollDistance = trackWidth - containerWidth + extraDistance;
    
    // Initial position: start from right side of screen
    const startPosition = containerWidth;
    
    // Create animation timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: this.section,
        start: 'top top',
        end: () => `+=${scrollDistance + startPosition}`,
        scrub: 0.5,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        markers: false,
        onUpdate: (self) => {
          // Update active item based on position (this will also handle showing info)
          this.updateActiveItemByPosition();
        }
      }
    });
    
    // Stage 1: Slide in from right (30% of total animation)
    tl.fromTo(this.track, 
      { x: startPosition },
      { 
        x: 0,
        ease: 'power2.out',
        duration: 0.3
      }
    );
    
    // Stage 2: Horizontal scroll (70% of total animation)
    tl.to(this.track, {
      x: -scrollDistance,
      ease: 'none',
      duration: 0.7
    });
  }
  
  updateActiveItemByPosition() {
    const centerX = window.innerWidth / 2;
    let activeIndex = 0;
    let closestIndex = 0;
    let closestDistance = Infinity;
    
    // Find which item is closest to the center of the screen
    this.scrollItems.forEach((item, index) => {
      const rect = item.getBoundingClientRect();
      const itemCenterX = rect.left + (rect.width / 2);
      const distanceFromCenter = Math.abs(itemCenterX - centerX);
      
      if (distanceFromCenter < closestDistance) {
        closestDistance = distanceFromCenter;
        closestIndex = index;
      }
    });
    
    activeIndex = closestIndex;
    
    // Check if first item is centered (show info when it is)
    const firstItemRect = this.scrollItems[0].getBoundingClientRect();
    const firstItemCenterX = firstItemRect.left + (firstItemRect.width / 2);
    const firstItemDistance = Math.abs(firstItemCenterX - centerX);
    const threshold = window.innerWidth * 0.15; // 15% of screen width as threshold
    
    if (firstItemDistance < threshold && !this.isZoomed) {
      // First item is centered, show info
      this.isZoomed = true;
      this.showInfoElements();
    } else if (firstItemDistance >= threshold && firstItemRect.left > centerX && this.isZoomed) {
      // First item hasn't reached center yet, hide info
      this.isZoomed = false;
      this.hideInfoElements();
    }
    
    if (activeIndex !== this.currentIndex) {
      this.currentIndex = activeIndex;
      this.updateActiveItem(activeIndex);
      this.updateLabels(activeIndex);
    }
  }
  
  updateActiveItem(activeIndex) {
    // Remove active class from all items
    this.scrollItems.forEach(item => item.classList.remove('active'));
    
    // Add active class to current item
    if (this.scrollItems[activeIndex]) {
      this.scrollItems[activeIndex].classList.add('active');
      
      // Show project info for active item
      if (this.isZoomed) {
        const item = this.scrollItems[activeIndex];
        const title = item.dataset.project;
        
        this.projectInfoTitle.textContent = title;
        this.projectInfo.classList.add('visible');
      }
    }
  }
  
  showInfoElements() {
    this.infoVisible = true;
    this.labels.classList.add('show');
    this.projectInfo.classList.add('show');
    
    // Set first item as active initially
    if (this.scrollItems.length > 0) {
      this.updateActiveItem(0);
    }
  }
  
  hideInfoElements() {
    this.infoVisible = false;
    this.labels.classList.remove('show');
    this.projectInfo.classList.remove('show');
    
    // Remove active class from all items
    this.scrollItems.forEach(item => item.classList.remove('active'));
    this.projectInfo.classList.remove('visible');
  }
  
  updateLabels(activeIndex) {
    const totalLabels = this.labelItems.length;
    
    this.labelItems.forEach((label, index) => {
      // Remove all classes
      label.classList.remove('active', 'prev', 'next');
      
      if (index === activeIndex) {
        label.classList.add('active');
      } else if (index === (activeIndex - 1 + totalLabels) % totalLabels) {
        label.classList.add('prev');
      } else if (index === (activeIndex + 1) % totalLabels) {
        label.classList.add('next');
      }
    });
  }
}

// === INITIALIZATION ===
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modules
  new Preloader();
  new Navigation();
  new MosaicGallery();
  new PerformanceOptimizer();
  
  // Wait for GSAP to load before initializing scroll animations
  if (window.gsap && window.ScrollTrigger) {
    new ScrollAnimations();
    new HorizontalScroll();
  } else {
    console.warn('GSAP or ScrollTrigger not loaded. Some animations will not work.');
  }
  
  // Navbar color change on scroll
  const navbar = document.querySelector('.navbar');
  const gallerySection = document.querySelector('.horizontal-scroll-section');
  
  if (navbar && gallerySection) {
    window.addEventListener('scroll', () => {
      const galleryRect = gallerySection.getBoundingClientRect();
      const navbarHeight = navbar.offsetHeight;
      
      // If gallery top is at or above navbar bottom, add dark class
      if (galleryRect.top <= navbarHeight) {
        navbar.classList.add('dark');
      } else {
        navbar.classList.remove('dark');
      }
    });
  }
});
// === SMOOTH SCROLL FOR ANCHOR LINKS ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    
    // Skip if href is just "#"
    if (href === '#') return;
    
    e.preventDefault();
    const target = $(href);
    
    if (target) {
      target.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start'
      });
    }
  });
});

// === LOGO VIDEO AUTOPLAY ON HOVER ===
const logoVideo = $('.logo-video');
if (logoVideo) {
  const logoContainer = $('.logo-container');
  
  logoContainer.addEventListener('mouseenter', () => {
    logoVideo.currentTime = 0;
    logoVideo.play().catch(() => {});
  });
  
  logoContainer.addEventListener('mouseleave', () => {
    logoVideo.pause();
    logoVideo.currentTime = 0;
  });
}

// === CUSTOM CURSOR ===
const customCursor = $('.custom-cursor');
if (customCursor) {
  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  function animateCursor() {
    const speed = 0.2;
    cursorX += (mouseX - cursorX) * speed;
    cursorY += (mouseY - cursorY) * speed;
    
    customCursor.style.left = cursorX + 'px';
    customCursor.style.top = cursorY + 'px';
    
    requestAnimationFrame(animateCursor);
  }
  
  animateCursor();
  
  // Add hover effect on interactive elements
  const interactiveElements = 'a, button, .scroll-item, .timeline-item';
  document.querySelectorAll(interactiveElements).forEach(el => {
    el.addEventListener('mouseenter', () => {
      customCursor.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      customCursor.classList.remove('hover');
    });
  });
}

// === EXPORT FOR DEBUGGING ===
window.PortfolioApp = {
  CONFIG,
  prefersReducedMotion
};

// Initialize quote animation
const quoteAnimation = new QuoteAnimation();

console.log('🎨 Portfolio initialized successfully');
