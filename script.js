/**
 * JESSE HIELEMA PORTFOLIO - MAIN JAVASCRIPT
 * Premium gallery experience with smooth animations
 */

// === LENIS SMOOTH SCROLL ===
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1 - Math.pow(2, -10 * t)), // expo ease-out
  orientation: 'vertical',
  gestureOrientation: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 2,
  infinite: false,
});

// Connect Lenis to GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// === CONFIGURATION ===
const CONFIG = {
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

    if (!this.navbar) return;

    this.init();
  }

  init() {
    // Scroll behavior
    this.handleScroll();
    window.addEventListener('scroll', () => this.handleScroll());

    // Section-based navbar color switching
    this.setupNavbarColors();
  }

  handleScroll() {
    if (window.scrollY > 100) {
      this.navbar.classList.add('scrolled');
    } else {
      this.navbar.classList.remove('scrolled');
    }
  }

  setupNavbarColors() {
    if (!window.gsap || !window.ScrollTrigger) return;

    const galleryWrapper = $('#galleryWrapper');
    const overMijSection = $('.over-mij-section');
    const navbar = this.navbar;

    // Dark navbar when gallery section is in view
    if (galleryWrapper) {
      ScrollTrigger.create({
        trigger: galleryWrapper,
        start: 'top top',
        end: 'bottom top',
        onEnter: () => navbar.classList.add('navbar-dark'),
        onLeaveBack: () => navbar.classList.remove('navbar-dark'),
        onLeave: () => navbar.classList.remove('navbar-dark'),
        onEnterBack: () => navbar.classList.add('navbar-dark'),
      });
    }
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

    // Animate hero subtitle
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
      gsap.to(heroSubtitle, {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.8,
        ease: 'power3.out'
      });
    }
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
    this.heroSection = $('#heroSection');
    this.galleryWrapper = $('#galleryWrapper');
    this.projectsTitle = $('#projectsTitle');
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
    
    // Set first item as active immediately
    if (this.scrollItems.length > 0) {
      this.scrollItems[0].classList.add('active');
    }
    
    // Setup animations
    this.setupHeroScroll();
    this.setupHorizontalScroll();
  }
  
  setupHorizontalScroll() {
    const trackWidth = this.track.scrollWidth;
    const containerWidth = this.section.offsetWidth;
    const itemWidth = this.scrollItems[0]?.offsetWidth || 300;
    
    // Calculate initial offset - start images off-screen to the right
    const initialOffset = containerWidth + 100;
    
    // End position: center first item, then scroll through all
    const centeredOffset = (containerWidth / 2) - (itemWidth / 2);
    const scrollDistance = trackWidth - itemWidth;

    // Create master timeline - gallery below hero, horizontal scroll on vertical scroll
    const masterTl = gsap.timeline({
      scrollTrigger: {
        trigger: this.galleryWrapper,
        start: 'top top',
        end: '+=200%',
        scrub: 1,
        pin: this.section,
        pinSpacing: false,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });

    // Phase 1: Title starts centered (already positioned via CSS), drifts to the left
    masterTl.fromTo(this.projectsTitle,
      { x: 0, opacity: 1, scale: 1 },
      {
        x: -(containerWidth * 0.35),
        opacity: 0.9,
        scale: 0.7,
        ease: 'power1.inOut',
        duration: 0.25
      }, 0
    );

    // Phase 1b: Images come in from the right
    masterTl.fromTo(this.track, {
      x: initialOffset
    }, {
      x: centeredOffset,
      ease: 'power2.out',
      duration: 0.25,
    }, 0);

    // Phase 2: Scroll through all gallery items
    masterTl.to(this.track, {
      x: -(scrollDistance - centeredOffset),
      ease: 'none',
      duration: 0.65,
      onUpdate: () => {
        this.updateActiveItemByPosition();
      }
    }, 0.25);

    // Keep title pinned at left side during gallery scroll
    masterTl.to(this.projectsTitle, {
      x: -(containerWidth * 0.35),
      opacity: 0.9,
      scale: 0.7,
      ease: 'none',
      duration: 0.65
    }, 0.25);

    // Hold position at end
    masterTl.to(this.track, {
      x: -(scrollDistance - centeredOffset),
      ease: 'none',
      duration: 0.1
    }, 0.9);
  }
  
  setupHeroScroll() {
    // MOVES text: subtle animation on scroll
    const movesText = document.querySelector('.moves-text');
    if (movesText) {
      gsap.to(movesText, {
        skewX: -15,
        x: '-40px',
        ease: 'none',
        scrollTrigger: {
          trigger: this.galleryWrapper,
          start: 'top bottom',
          end: 'top top',
          scrub: 1,
          invalidateOnRefresh: true
        }
      });
    }
  }

  updateActiveItemByPosition() {
    const sectionRect = this.section.getBoundingClientRect();
    const centerX = sectionRect.left + (sectionRect.width / 2);
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
    const threshold = sectionRect.width * 0.15; // 15% of section width as threshold

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
        const title = item.dataset.project || '';
        const description = item.dataset.description || '';
        const date = item.dataset.date || '';

        this.projectInfoTitle.textContent = title;
        this.projectInfoDescription.textContent = description;
        this.projectInfoDate.textContent = date;
        this.projectInfo.classList.add('show');
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
  new Navigation();
  new MosaicGallery();
  new PerformanceOptimizer();

  // Hero subtitle cycling text
  const subtitleText = document.querySelector('.hero-subtitle-text');
  if (subtitleText) {
    const titles = [
      'GRAFISCH ONTWERPER',
      'CONCEPT DENKER',
      'VISUEEL DENKER',
      'CREATIEF STRATEEG',
      'IDEEËNMAKER',
      'CONCEPT DRIVEN DESIGNER',
      'VAN IDEE NAAR DESIGN'
    ];
    let currentIndex = 0;

    setInterval(() => {
      subtitleText.classList.add('fade-out');
      setTimeout(() => {
        currentIndex = (currentIndex + 1) % titles.length;
        subtitleText.textContent = titles[currentIndex];
        subtitleText.classList.remove('fade-out');
      }, 300);
    }, 2000);
  }

  // Wait for GSAP to load before initializing scroll animations
  if (window.gsap && window.ScrollTrigger) {
    new ScrollAnimations();
    new HorizontalScroll();

    // Hero → About horizontal scroll (desktop only, stacked on mobile)
    const heroAboutWrapper = document.getElementById('heroAboutWrapper');
    const heroAboutTrack = document.getElementById('heroAboutTrack');
    if (heroAboutWrapper && heroAboutTrack && window.innerWidth > 768) {
      let overMijTriggered = false;
      gsap.to(heroAboutTrack, {
        x: () => -(heroAboutTrack.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: heroAboutWrapper,
          start: 'top top',
          end: () => '+=' + (heroAboutTrack.scrollWidth - window.innerWidth + window.innerHeight),
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Trigger over-mij animation when scrolled ~40% into horizontal scroll
            if (self.progress > 0.4 && !overMijTriggered) {
              overMijTriggered = true;
              if (window.triggerOverMijAnimation) window.triggerOverMijAnimation();
            }
          }
        }
      });
    }

    // Animate Journey Section
    animateJourneySection();

    // Animate Over Mij Section
    animateOverMijSection();

    // Refresh ScrollTrigger after all animations are set up
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    // Hide scroll indicator when reaching projects section
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const projectsTitle = document.querySelector('.projects-big-title');

    if (scrollIndicator && projectsTitle) {
      gsap.to(scrollIndicator, {
        opacity: 0,
        pointerEvents: 'none',
        scrollTrigger: {
          trigger: projectsTitle,
          start: 'top 80%',
          end: 'top 10%',
          scrub: true
        }
      });
    }
  } else {
    console.warn('GSAP or ScrollTrigger not loaded. Some animations will not work.');
  }

  // Navbar color change and scroll behavior on scroll
  const navbar = document.querySelector('.navbar');
  const gallerySection = document.querySelector('.horizontal-scroll-section');
  const overMijSection = document.querySelector('.over-mij-section');

  if (navbar) {
    let ticking = false;
    let lastState = 'default';
    let lastScrollTop = window.scrollY || 0;
    let downDistance = 0;
    let upDistance = 0;
    let hasScrolledClass = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollTop = window.scrollY;
          const galleryRect = gallerySection ? gallerySection.getBoundingClientRect() : null;
          const overMijRect = overMijSection ? overMijSection.getBoundingClientRect() : null;
          const navbarHeight = navbar.offsetHeight;

          // Stabilize compact navbar transitions using directional distance thresholds.
          const delta = scrollTop - lastScrollTop;
          const absDelta = Math.abs(delta);

          if (absDelta > 0.5) {
            if (delta > 0) {
              downDistance += delta;
              upDistance = 0;
            } else {
              upDistance += -delta;
              downDistance = 0;
            }
          }

          const minCompactScroll = 80;
          const downTriggerDistance = 18;
          const upTriggerDistance = 10;

          if (!hasScrolledClass && scrollTop > minCompactScroll && downDistance > downTriggerDistance) {
            navbar.classList.add('navbar-scrolled');
            hasScrolledClass = true;
            downDistance = 0;
          } else if (hasScrolledClass && (scrollTop <= minCompactScroll || upDistance > upTriggerDistance)) {
            navbar.classList.remove('navbar-scrolled');
            hasScrolledClass = false;
            upDistance = 0;
          }

          lastScrollTop = scrollTop;

          let newState = 'default';

          // If over-mij section touches navbar, add dark class
          if (overMijRect && overMijRect.top <= navbarHeight && overMijRect.bottom > navbarHeight) {
            newState = 'dark';
          }
          // Else if gallery is at navbar, add dark class (make black)
          else if (galleryRect && galleryRect.top <= navbarHeight) {
            newState = 'dark';
          }

          // Only update classes if state changed
          if (newState !== lastState) {
            navbar.classList.remove('dark', 'white');
            if (newState !== 'default') {
              navbar.classList.add(newState);
            }
            lastState = newState;
          }

          ticking = false;
        });

        ticking = true;
      }
    });
  }

  // Smooth scroll for anchor links
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
});

// === JOURNEY SECTION ANIMATIONS ===
function animateJourneySection() {
  const experiencesTitle = document.querySelector('.experiences-title');
  const experienceItems = document.querySelectorAll('.experience-item');

  if (!experiencesTitle || !experienceItems.length) return;

  // Animate title on scroll
  gsap.to(experiencesTitle, {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.experiences-hero',
      start: 'top 70%',
      toggleActions: 'play none none none'
    }
  });

  // Animate each experience item
  experienceItems.forEach((item, index) => {
    gsap.to(item, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay: index * 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: item,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
  });
}

// === OVER MIJ SECTION ANIMATIONS ===
function animateOverMijSection() {
  const overMijSection = document.querySelector('.over-mij-section');
  const overMijSubtitle = document.querySelector('.over-mij-subtitle');
  const overMijName = document.querySelector('.over-mij-name');
  const overMijTexts = document.querySelectorAll('.over-mij-text');
  const overMijQuestion = document.querySelector('.over-mij-question');
  
  if (!overMijSubtitle || !overMijSection) return;

  // Words to highlight with special animation
  const highlightWords = ['beter', 'werkt', 'sterker', 'leuk', 'creatief', 'beste', 'blijft', 'hangen'];

  // Wrap each word in a span, mark highlight words
  const wrapWords = (element) => {
    const text = element.textContent;
    const words = text.split(' ');
    element.innerHTML = words.map(word => {
      const clean = word.replace(/[.,!?]/g, '');
      const isHighlight = highlightWords.some(hw => clean.toLowerCase() === hw.toLowerCase());
      return `<span class="word${isHighlight ? ' word-highlight' : ''}">${word}</span>`;
    }).join(' ');
  };

  overMijTexts.forEach(wrapWords);
  if (overMijQuestion) wrapWords(overMijQuestion);

  // Set initial states
  gsap.set(overMijSubtitle, { opacity: 0, y: -20 });
  gsap.set(overMijName, { opacity: 0, scale: 0.95, y: 30 });
  const allWords = overMijSection.querySelectorAll('.word');
  gsap.set(allWords, { opacity: 0, y: 8 });

  let hasAnimated = false;

  // Function to trigger the animation (called when panel is in view)
  window.triggerOverMijAnimation = () => {
    if (hasAnimated) return;
    hasAnimated = true;

    const tl = gsap.timeline();

    // 1) Subtitle slides in
    tl.to(overMijSubtitle, {
      opacity: 1, y: 0, duration: 0.6, ease: 'power3.out'
    });

    // 2) Name scales in
    tl.to(overMijName, {
      opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'power3.out'
    }, '-=0.3');

    // 3) Words appear one by one at reading pace
    tl.to(allWords, {
      opacity: 1,
      y: 0,
      duration: 0.25,
      stagger: 0.12,
      ease: 'power2.out',
      onStart: function() {
        // Add highlight animation to special words as they appear
        allWords.forEach((word, i) => {
          if (word.classList.contains('word-highlight')) {
            gsap.fromTo(word, 
              { scale: 1, color: 'inherit' },
              { 
                scale: 1.15, 
                color: '#E85D04', 
                fontWeight: 700,
                duration: 0.4, 
                delay: i * 0.12 + 0.2,
                ease: 'back.out(2)',
                yoyo: true,
                repeat: 1,
                repeatDelay: 0.1,
                onComplete: () => {
                  gsap.set(word, { scale: 1, color: '#E85D04', fontWeight: 700 });
                }
              }
            );
          }
        });
      }
    }, '-=0.2');
  };

  // On mobile (no horizontal scroll), use ScrollTrigger to trigger animation
  if (window.innerWidth <= 768) {
    ScrollTrigger.create({
      trigger: overMijSection,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        if (window.triggerOverMijAnimation) window.triggerOverMijAnimation();
      }
    });
  }
}

// === LOGO VIDEO AUTOPLAY ON HOVER ===
const logoVideo = $('.logo-video');
if (logoVideo) {
  const logoContainer = $('.logo-container');

  logoContainer.addEventListener('mouseenter', () => {
    logoVideo.currentTime = 0;
    logoVideo.play().catch(() => { });
  });

  logoContainer.addEventListener('mouseleave', () => {
    logoVideo.pause();
    logoVideo.currentTime = 0;
  });
}

// === EXPORT FOR DEBUGGING ===
window.PortfolioApp = {
  CONFIG,
  prefersReducedMotion
};

// Initialize quote animation
const quoteAnimation = new QuoteAnimation();

// === INTRO TEXT ANIMATION (About Page) ===
function initIntroTextAnimation() {
  // Check if we're on the about page and GSAP is available
  const introSection = document.querySelector('.intro-text-animated');
  if (!introSection || !window.gsap || !window.ScrollTrigger) return;

  const paragraphs = document.querySelectorAll('.intro-paragraph');
  const highlightWords = document.querySelectorAll('.highlight-word');

  // Animate paragraphs on scroll
  gsap.registerPlugin(ScrollTrigger);
  
  paragraphs.forEach((paragraph, index) => {
    gsap.to(paragraph, {
      scrollTrigger: {
        trigger: paragraph,
        start: 'top 85%',
        end: 'top 60%',
        toggleActions: 'play none none none',
        once: true
      },
      duration: 0.8,
      delay: index * 0.15,
      onStart: () => {
        paragraph.classList.add('animate-in');
      }
    });
  });

  // Highlight words as they scroll into view (subtle wave effect)
  highlightWords.forEach((word, index) => {
    gsap.to(word, {
      scrollTrigger: {
        trigger: word,
        start: 'top 75%',
        end: 'top 40%',
        toggleActions: 'play none none reverse',
        onEnter: () => {
          setTimeout(() => {
            word.classList.add('active');
            // Remove after some time for a wave effect
            setTimeout(() => {
              word.classList.remove('active');
            }, 1500);
          }, index * 100); // Stagger the highlights
        }
      }
    });
  });
}

// Initialize intro text animation when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initIntroTextAnimation);
} else {
  initIntroTextAnimation();
}

// === PROJECTEN PAGINA - FILTER FUNCTIONALITEIT ===
function initProjectenFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.project-item');

  if (filterButtons.length && projectItems.length) {
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');

        // Get filter value
        const filter = button.getAttribute('data-filter');

        // Filter projects with animation
        projectItems.forEach((item, index) => {
          const category = item.getAttribute('data-category');
          
          if (filter === 'all' || category === filter) {
            // Show item
            setTimeout(() => {
              item.classList.remove('hidden');
              item.style.animation = 'none';
              // Trigger reflow
              void item.offsetWidth;
              item.style.animation = `fadeInUp 0.6s ease forwards ${index * 0.1}s`;
            }, 50);
          } else {
            // Hide item
            item.classList.add('hidden');
          }
        });
      });
    });
  }

  // GSAP Scroll Animations for projecten page
  if (window.gsap && window.ScrollTrigger) {
    // Animate title
    gsap.from('.projecten-title', {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.projecten-title',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });

    // Animate filter buttons
    gsap.from('.filter-btn', {
      opacity: 0,
      y: 20,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.projecten-filter',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });

    // Animate project items
    gsap.from('.project-item', {
      opacity: 0,
      y: 30,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.projecten-grid',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
  }
}

// === IMAGE OPTIMIZATION - LAZY LOADING ===
function initImageOptimization() {
  // Lazy Loading voor alle afbeeldingen
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          
          // Laad de afbeelding
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          
          // Voeg fade-in effect toe
          img.style.opacity = '0';
          img.style.transition = 'opacity 0.3s ease';
          
          img.onload = function() {
            this.style.opacity = '1';
          };
          
          // Stop met observeren
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px' // Begin met laden 50px voor de afbeelding zichtbaar wordt
    });

    // Observeer alle afbeeldingen die lazy geladen moeten worden
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
  
  // Fallback voor oude browsers - laad alle afbeeldingen direct
  else {
    document.querySelectorAll('img[data-src]').forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  }
  
  // Preload belangrijke afbeeldingen (logo's)
  const criticalImages = [
    'images/mono-rond.png',
    'images/mono-wit-01-01.png'
  ];

  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
  
  console.log('✅ Image optimization loaded');
}

// Initialize projecten filter and image optimization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initProjectenFilter();
    initImageOptimization();
  });
} else {
  initProjectenFilter();
  initImageOptimization();
}

console.log('🎨 Portfolio initialized successfully');
