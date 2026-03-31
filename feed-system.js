/**
 * JESSE HIELEMA - FEED SYSTEM
 * Fullscreen doomscroll portfolio feed with like interactions
 */

// === PROJECT DATA ===
const FEED_PROJECTS = [
  {
    id: 1,
    year: "2026",
    title: "Startpunt",
    description: "Het fundament waar richting en stijl samenkomen",
    images: ["images/startpunt.jpg", "images/project7.png", "images/project8.png", "images/project9.png"],
    image: "images/startpunt.png",
    tags: ["Strategie", "Concept", "Richting"],
    techniques: ["Concepting", "Visual Direction", "Figma", "Prototype"],
    input: "Van losse ideeen naar een helder vertrekpunt met duidelijke keuzes in stijl en structuur.",
    link: "#"
  },
  {
    id: 2,
    year: "2025",
    title: "1Veen",
    description: "Visuele identiteit en digitale vertaling voor 1Veen",
    images: ["images/project2.jpg", "images/project10.png", "images/project11.png"],
    image: "images/1Veen.jpg",
    tags: ["Brand", "Website", "Identity"],
    techniques: ["Brand Design", "Webdesign", "UI", "Responsive"],
    input: "Een consistente look en feel ontwikkeld die zowel online als in communicatie-uitingen sterk blijft staan.",
    link: "#",
    featured: true
  },
  {
    id: 3,
    year: "2025",
    title: "Tripje met de trein",
    description: "Campagneconcept met storytelling en visuele flow",
    images: ["images/Kopwerk 1.jpeg", "images/Kopwerk 2.jpeg", "images/Kopwerk 3.jpeg"],
    image: "images/kopwerk.jpg",
    tags: ["Campagne", "Story", "Visual"],
    techniques: ["Storyboarding", "Layout", "Design System", "Art Direction"],
    input: "Een verhaallijn ontworpen waarin beeld, typografie en ritme samen de reis versterken.",
    link: "#"
  },
  {
    id: 5,
    year: "2026",
    title: "Website redesign",
    description: "Een bestaande site opnieuw ontworpen voor meer impact",
    images: ["images/project5.png", "images/project16.png", "images/project17.png"],
    image: "images/cocacola.png",
    tags: ["Redesign", "UX", "Frontend"],
    techniques: ["Webdesign", "Wireframing", "UI", "Responsive Design"],
    input: "Structuur, hiërarchie en stijl vernieuwd zodat de site sneller leest en sterker overkomt.",
    link: "#"
  },
  {
    id: 6,
    year: "2026",
    title: "CHECK!",
    description: "Strak en doelgericht concept met een duidelijke boodschap",
    images: ["images/project6.png", "images/project18.png", "images/project19.jpg", "images/project21.png"],
    image: "images/poster.png",
    tags: ["Concept", "Visual", "Brand"],
    techniques: ["Art Direction", "Logo Design", "Layout", "Branding"],
    input: "Een krachtig visueel concept uitgewerkt met focus op herkenning en een heldere call-to-action.",
    link: "#"
  },
  {
    id: 7,
    year: "2025",
    title: "ICDC",
    description: "Campagneconcept voor Love Tomorrow tegen achtergelaten campinggear",
    images: ["images/project12.png", "images/project13.jpg"],
    image: "images/Team_Netherlands.jpg",
    tags: ["Campagne", "Concept", "Duurzaamheid"],
    techniques: ["Concepting", "Art Direction", "Campagne Design", "Pitching"],
    input: "In één intensive week een creatief concept ontwikkeld dat festivalgangers aanzet om hun campingspullen mee te nemen.",
    link: "#"
  }
];

// === LIKE MANAGER ===
class LikeManager {
  constructor() {
    this.likes = this.loadLikes();
  }

  loadLikes() {
    try {
      const stored = localStorage.getItem('feed-likes');
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  }

  saveLikes() {
    try {
      localStorage.setItem('feed-likes', JSON.stringify(this.likes));
    } catch (e) {
      console.warn('Could not save likes');
    }
  }

  toggleLike(projectId) {
    if (!this.likes[projectId]) {
      this.likes[projectId] = true;
    } else {
      this.likes[projectId] = !this.likes[projectId];
    }
    this.saveLikes();
    return this.likes[projectId];
  }

  isLiked(projectId) {
    return this.likes[projectId] || false;
  }

  getTotalLikes() {
    return Object.values(this.likes).filter(v => v === true).length;
  }
}

// === FEED SYSTEM ===
class FeedSystem {
  constructor() {
    this.likeManager = new LikeManager();
    this.container = document.getElementById('feedContainer');
    this.overlay = document.getElementById('detailOverlay');
    this.currentProject = null;
    this.typewriterStarted = false;
    this.lastFeedbackMessage = '';
    this.feedbackHideTimer = null;
    this.feedbackSwapTimer = null;
    this.likeFeedbackMessages = [
      'Je hebt smaak 👀',
      'Dit begint ergens op te lijken',
      'Oke, jij snapt het',
      'Deze nemen we mee',
      'Interessante keuze',
      'Hier zit gevoel in',
      'Jij weet wat werkt',
      'Deze vibe onthoud ik',
      'Sterke pick',
      'We komen dichterbij',
      'Dit zegt genoeg',
      'Nice, dit helpt',
      'Deze past bij je',
      'Hier kunnen we op bouwen',
      'Jij hebt oog voor detail',
      'Dit wordt interessant',
      'Ik zie een richting',
      'Deze houden we erin',
      'Smaakt naar meer',
      'Dit gaat de goede kant op'
    ];
    
    this.init();
  }

  init() {
    this.prepareIntroSlideIn();
    this.renderFeed();
    this.setupScrollAnimations();
    this.setupFilterBar();
    this.setupEventListeners();
    this.updateNavbarLikeCount(false);
  }

  prepareIntroSlideIn() {
    // Wrap description words in spans for word-by-word animation
    const desc = document.querySelector('.feed-intro-description');
    if (!desc || desc.dataset.wrapped) return;
    desc.dataset.wrapped = 'true';

    const html = desc.innerHTML;
    // Split on <br> tags and whitespace, preserving <br> and <br><br>
    const parts = html.split(/(<br\s*\/?>)/gi);
    let result = '';

    parts.forEach(part => {
      if (/^<br\s*\/?>$/i.test(part)) {
        result += '<br>';
        return;
      }
      const words = part.trim().split(/\s+/).filter(Boolean);
      words.forEach((word, i) => {
        const isLike = /^like!?$/i.test(word.replace(/[^a-zA-Z!]/g, ''));
        const cls = isLike ? 'desc-word like-highlight' : 'desc-word';
        const extra = isLike ? ' <span class="floating-hearts"></span>' : '';
        result += `<span class="${cls}">${word}${extra}</span> `;
      });
    });

    desc.innerHTML = result.trim();

    // Click on "like!" to replay hearts
    const likeWord = desc.querySelector('.like-highlight');
    if (likeWord) {
      likeWord.style.cursor = 'pointer';
      likeWord.addEventListener('click', () => {
        gsap.fromTo(likeWord, { scale: 1 }, {
          scale: 1.3,
          duration: 0.25,
          yoyo: true,
          repeat: 1,
          ease: 'power2.inOut'
        });
        this.spawnFloatingHearts(likeWord);
      });
    }
  }

  startIntroSlideIn() {
    // Animate description words one by one
    const desc = document.querySelector('.feed-intro-description');
    if (!desc || this.descAnimated) return;
    this.descAnimated = true;

    const words = desc.querySelectorAll('.desc-word');
    words.forEach((word, i) => {
      gsap.to(word, {
        opacity: 1,
        y: 0,
        duration: 0.35,
        delay: 0.5 + i * 0.06,
        ease: 'power2.out',
        onComplete: () => {
          word.classList.add('visible');
          // Special bounce for "like!" word
          if (word.classList.contains('like-highlight')) {
            gsap.fromTo(word, { scale: 1 }, {
              scale: 1.3,
              duration: 0.25,
              yoyo: true,
              repeat: 1,
              ease: 'power2.inOut'
            });
            this.spawnFloatingHearts(word);
          }
        }
      });
    });
  }

  spawnFloatingHearts(likeEl) {
    const container = likeEl.querySelector('.floating-hearts');
    if (!container) return;
    const heartCount = 6;
    for (let i = 0; i < heartCount; i++) {
      const heart = document.createElement('span');
      heart.className = 'floating-heart';
      heart.textContent = '♥';
      heart.style.setProperty('--float-x', `${(Math.random() - 0.5) * 50}px`);
      heart.style.animationDelay = `${i * 0.15}s`;
      heart.style.color = '#E85D04';
      container.appendChild(heart);
      heart.addEventListener('animationend', () => heart.remove());
    }
  }

  renderFeed() {
    if (!this.container) return;

    this.container.innerHTML = FEED_PROJECTS.map((project) => `
      <div class="feed-card${project.featured ? ' feed-card--featured' : ''}" data-project-id="${project.id}">
        ${project.featured ? '<span class="feed-card-badge">&#9733; Uitgelicht</span>' : ''}
        <div class="feed-card-image-container">
          <img src="${project.image}" alt="${project.title}" class="feed-card-image">
        </div>
        <div class="feed-card-overlay"></div>
        
        <div class="feed-card-content">
          <div class="feed-card-left">
            <div class="feed-card-year">${project.year}</div>
            <h2 class="feed-card-title">${project.title.toUpperCase()}</h2>
            <div class="feed-card-tags">
              ${project.tags.map(tag => `<span class="tag-pill">${tag}</span>`).join('')}
            </div>
            <button class="view-project-btn" data-project-id="${project.id}">Bekijk project</button>
          </div>
          
          <div class="feed-card-right">
            <button class="like-btn-feed" data-project-id="${project.id}">
              <div class="heart-btn ${this.likeManager.isLiked(project.id) ? 'liked' : ''}" data-heart-id="${project.id}">${this.likeManager.isLiked(project.id) ? '♥' : '♡'}</div>
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  setupScrollAnimations() {
    const feedIntro = document.getElementById('feedIntro');
    const feedIntroInner = document.getElementById('feedIntroInner');
    const filterBar = document.getElementById('filterBar');
    const feedContainer = document.getElementById('feedContainer');
    const cards = this.container ? Array.from(this.container.querySelectorAll('.feed-card')) : [];
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) {
      feedIntro?.classList.add('is-visible');
      filterBar?.classList.add('is-visible');
      document.querySelectorAll('.desc-word').forEach(w => { w.style.opacity = 1; w.style.transform = 'none'; });
      cards.forEach(c => { c.style.opacity = 1; c.style.transform = 'none'; });
      return;
    }

    // === 1) Slide-in triggers when feed-intro scrolls into view ===
    ScrollTrigger.create({
      trigger: feedIntroInner,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        feedIntro.classList.add('is-visible');
        this.startIntroSlideIn();
      }
    });

    // === 2) Intro text fades out when cards area scrolls over it ===
    gsap.to(feedIntroInner, {
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: feedContainer,
        start: 'top 100%',
        end: 'top 50%',
        scrub: true
      }
    });

    // === 3) Each card individually animated (brandcreatives style) ===
    const cols = window.innerWidth >= 1200 ? 3 : (window.innerWidth >= 768 ? 2 : 1);

    ScrollTrigger.refresh();

    cards.forEach((card, index) => {
      const colIndex = index % cols;

      gsap.set(card, {
        opacity: 0,
        y: 80 + (colIndex * 25)
      });

      ScrollTrigger.create({
        trigger: card,
        start: 'top 92%',
        end: 'top 30%',
        onEnter: () => {
          gsap.to(card, {
            opacity: 1,
            y: 0,
            duration: 0.8 + (colIndex * 0.1),
            delay: colIndex * 0.1,
            ease: 'power3.out',
            overwrite: 'auto'
          });
        },
        onLeaveBack: () => {
          gsap.to(card, {
            opacity: 0,
            y: 80 + (colIndex * 25),
            duration: 0.4,
            ease: 'power2.in',
            overwrite: 'auto'
          });
        }
      });
    });
  }

  setupFilterBar() {
    const filterBtns = document.querySelectorAll('.filter-btn');

    const categoryMap = {
      'Branding': ['Brand', 'Identity', 'Branding', 'Visual', 'Art Direction', 'Visual Direction'],
      'Web': ['Website', 'Web', 'Frontend', 'Responsive', 'Responsive Design', 'Webdesign', 'UI', 'UX'],
      'Campagne': ['Campagne', 'Story', 'Storyboarding', 'Narrative', 'Concept'],
      'Logo': ['Logo', 'Logo Design', 'Identity']
    };

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.dataset.filter;
        const cards = this.container.querySelectorAll('.feed-card');

        cards.forEach(card => {
          const projectId = parseInt(card.dataset.projectId);
          const project = FEED_PROJECTS.find(p => p.id === projectId);
          if (!project) return;

          if (filterValue === 'all') {
            card.classList.remove('filter-hidden');
            return;
          }

          const relevantTags = categoryMap[filterValue] || [];
          const matchTags = project.tags.some(tag =>
            relevantTags.some(t => tag.toLowerCase().includes(t.toLowerCase()))
          );
          const matchTech = project.techniques.some(tech =>
            relevantTags.some(t => tech.toLowerCase().includes(t.toLowerCase()))
          );

          if (matchTags || matchTech) {
            card.classList.remove('filter-hidden');
          } else {
            card.classList.add('filter-hidden');
          }
        });
      });
    });
  }

  setupEventListeners() {
    // Like buttons
    this.container.addEventListener('click', (e) => {
      const heartBtn = e.target.closest('.heart-btn');
      if (heartBtn) {
        this.handleLike(heartBtn);
      }

      const viewBtn = e.target.closest('.view-project-btn');
      if (viewBtn) {
        const projectId = parseInt(viewBtn.dataset.projectId);
        this.openDetail(projectId);
      }
    });

    // Carousel navigation on feed cards
    this.container.addEventListener('click', (e) => {
      const dot = e.target.closest('.carousel-dots .dot');
      if (dot) {
        const idx = parseInt(dot.dataset.idx);
        const container = dot.closest('.feed-card');
        const scrollContainer = container.querySelector('.image-scroll-container');
        if (scrollContainer) {
          const offset = idx * 100;
          scrollContainer.style.transform = `translateX(-${offset}%)`;
          container.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));
          dot.classList.add('active');
        }
      }
    });
    let lastTap = 0;
    this.container.addEventListener('click', (e) => {
      const cardImage = e.target.closest('.feed-card-image');
      if (cardImage) {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;
        if (tapLength < 300 && tapLength > 0) {
          // Double tap detected
          e.preventDefault();
          const card = cardImage.closest('.feed-card');
          const heartBtn = card.querySelector('.heart-btn');
          
          // Only trigger if not already liked
          if (heartBtn && !this.likeManager.isLiked(parseInt(heartBtn.dataset.heartId))) {
            this.handleLike(heartBtn);
            
            // Show floating heart at double-tap location
            const rect = cardImage.getBoundingClientRect();
            const heart = document.createElement('div');
            heart.className = 'double-tap-heart';
            heart.textContent = '♥';
            heart.style.left = (rect.left + rect.width / 2) + 'px';
            heart.style.top = (rect.top + rect.height / 2) + 'px';
            document.body.appendChild(heart);
            
            setTimeout(() => heart.remove(), 800);
          }
        }
        lastTap = currentTime;
      }
    });

    // Liked projects modal
    const likeCounter = document.getElementById('likeCounterNavbar');
    if (likeCounter) {
      likeCounter.addEventListener('click', (e) => this.openLikedProjectsModal());
      likeCounter.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          this.openLikedProjectsModal();
        }
      });
    }

    // Double-click to like (desktop)
    this.container.addEventListener('dblclick', (e) => {
      const card = e.target.closest('.feed-card');
      if (card) {
        const heartBtn = card.querySelector('.heart-btn');
        if (heartBtn) {
          const projectId = parseInt(heartBtn.dataset.heartId);
          // Only trigger if not already liked
          if (!this.likeManager.isLiked(projectId)) {
            this.handleLike(heartBtn);
            
            // Show floating heart at double-click location
            const rect = card.getBoundingClientRect();
            const heart = document.createElement('div');
            heart.className = 'double-tap-heart';
            heart.textContent = '♥';
            heart.style.left = (e.clientX) + 'px';
            heart.style.top = (e.clientY) + 'px';
            document.body.appendChild(heart);
            
            setTimeout(() => heart.remove(), 800);
          }
        }
      }
    });

    const modalCloseBtn = document.getElementById('modalCloseBtn');
    modalCloseBtn?.addEventListener('click', () => this.closeLikedProjectsModal());

    const modal = document.getElementById('likedProjectsModal');
    modal?.addEventListener('click', (e) => {
      if (e.target === modal) this.closeLikedProjectsModal();
    });

    // Overlay close
    const closeBtn = this.overlay.querySelector('.overlay-close');
    closeBtn?.addEventListener('click', () => this.closeDetail());

    const backdrop = this.overlay;
    backdrop?.addEventListener('click', (e) => {
      if (e.target === backdrop) this.closeDetail();
    });

    // CTA button in overlay
    const ctaBtn = this.overlay.querySelector('.cta-button');
    ctaBtn?.addEventListener('click', () => {
      window.location.href = '/contact.html';
    });
  }

  handleLike(heartBtn) {
    const projectId = parseInt(heartBtn.dataset.heartId);
    const isNowLiked = this.likeManager.toggleLike(projectId);

    // Update heart visuals
    if (isNowLiked) {
      heartBtn.textContent = '♥';
      heartBtn.classList.add('liked');
      
      // Animations only on like (not unlike)
      this.createBurstAnimation(heartBtn);
      this.createFlyingHeart(heartBtn);
    } else {
      heartBtn.textContent = '♡';
      heartBtn.classList.remove('liked');
    }

    // Update navbar
    this.updateNavbarLikeCount(true);

    if (isNowLiked) {
      this.showNavbarFeedback();
    }
  }

  createBurstAnimation(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Create 8 burst particles
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8;
      const distance = 80;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;

      const particle = document.createElement('div');
      particle.className = 'burst-particle';
      particle.textContent = '♡';
      particle.style.left = centerX + 'px';
      particle.style.top = centerY + 'px';
      particle.style.color = '#E85D04';
      particle.style.setProperty('--tx', tx + 'px');
      particle.style.setProperty('--ty', ty + 'px');
      
      document.body.appendChild(particle);
      
      setTimeout(() => particle.remove(), 800);
    }
  }

  createFlyingHeart(element) {
    const rect = element.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;

    // Calculate navbar heart position
    const navbar = document.querySelector('.like-counter-navbar');
    const navbarRect = navbar?.getBoundingClientRect() || { left: window.innerWidth - 100, top: 20 };
    const endX = navbarRect.left + navbarRect.width / 2;
    const endY = navbarRect.top + navbarRect.height / 2;

    const tx = endX - startX;
    const ty = endY - startY;

    const heart = document.createElement('div');
    heart.className = 'flying-heart';
    heart.textContent = '❤️';
    heart.style.left = startX + 'px';
    heart.style.top = startY + 'px';
    heart.style.setProperty('--tx', tx + 'px');
    heart.style.setProperty('--ty', ty + 'px');

    document.body.appendChild(heart);
    
    setTimeout(() => heart.remove(), 1200);
  }

  updateNavbarLikeCount(animate = true) {
    const counter = document.querySelector('.like-counter-navbar .like-count');
    const totalLikes = this.likeManager.getTotalLikes();
    
    if (counter) {
      counter.textContent = totalLikes;
      
      // Pulse animation
      if (animate) {
        const navbar = document.querySelector('.like-counter-navbar');
        navbar?.classList.add('pulse');
        setTimeout(() => {
          navbar?.classList.remove('pulse');
        }, 600);
      }
    }
  }

  showNavbarFeedback() {
    const feedback = document.getElementById('likeFeedback');
    if (!feedback || !this.likeFeedbackMessages.length) return;

    const nextMessage = this.getRandomFeedbackMessage();
    const swapAndShow = () => {
      feedback.textContent = nextMessage;
      requestAnimationFrame(() => {
        feedback.classList.add('show');
      });
    };

    if (feedback.classList.contains('show')) {
      feedback.classList.remove('show');
      if (this.feedbackSwapTimer) {
        clearTimeout(this.feedbackSwapTimer);
      }
      this.feedbackSwapTimer = setTimeout(() => {
        swapAndShow();
      }, 140);
    } else {
      swapAndShow();
    }

    if (this.feedbackHideTimer) {
      clearTimeout(this.feedbackHideTimer);
    }

    this.feedbackHideTimer = setTimeout(() => {
      feedback.classList.remove('show');
    }, 2400);
  }

  getRandomFeedbackMessage() {
    if (this.likeFeedbackMessages.length === 1) {
      this.lastFeedbackMessage = this.likeFeedbackMessages[0];
      return this.lastFeedbackMessage;
    }

    let candidate = this.lastFeedbackMessage;
    while (candidate === this.lastFeedbackMessage) {
      const randomIndex = Math.floor(Math.random() * this.likeFeedbackMessages.length);
      candidate = this.likeFeedbackMessages[randomIndex];
    }

    this.lastFeedbackMessage = candidate;
    return candidate;
  }


  openDetail(projectId) {
    const project = FEED_PROJECTS.find(p => p.id === projectId);
    if (!project) return;

    this.currentProject = project;

    // Populate overlay with multiple images
    const overlayImageSide = document.querySelector('.overlay-image-side');
    if (project.images && project.images.length > 1) {
      let currentIdx = 0;
      const images = project.images;

      overlayImageSide.innerHTML = `
        <div class="insta-carousel">
          <div class="insta-carousel-track">
            ${images.map((img, idx) => `<img src="${img}" alt="${project.title} ${idx + 1}" class="insta-slide ${idx === 0 ? 'active' : ''}">`).join('')}
          </div>
          <button class="insta-arrow insta-arrow-left" aria-label="Vorige">&#8249;</button>
          <button class="insta-arrow insta-arrow-right" aria-label="Volgende">&#8250;</button>
          <div class="insta-dots">
            ${images.map((_, idx) => `<span class="insta-dot ${idx === 0 ? 'active' : ''}" data-idx="${idx}"></span>`).join('')}
          </div>
        </div>
      `;

      const track = overlayImageSide.querySelector('.insta-carousel-track');
      const dots = overlayImageSide.querySelectorAll('.insta-dot');
      const slides = overlayImageSide.querySelectorAll('.insta-slide');
      const leftArrow = overlayImageSide.querySelector('.insta-arrow-left');
      const rightArrow = overlayImageSide.querySelector('.insta-arrow-right');

      const goTo = (idx) => {
        currentIdx = idx;
        track.style.transform = `translateX(-${currentIdx * 100}%)`;
        slides.forEach((s, i) => s.classList.toggle('active', i === currentIdx));
        dots.forEach((d, i) => d.classList.toggle('active', i === currentIdx));
        leftArrow.style.display = currentIdx === 0 ? 'none' : 'flex';
        rightArrow.style.display = currentIdx === images.length - 1 ? 'none' : 'flex';
      };

      leftArrow.addEventListener('click', () => { if (currentIdx > 0) goTo(currentIdx - 1); });
      rightArrow.addEventListener('click', () => { if (currentIdx < images.length - 1) goTo(currentIdx + 1); });
      dots.forEach(dot => dot.addEventListener('click', () => goTo(parseInt(dot.dataset.idx))));
      goTo(0);
    } else {
      overlayImageSide.innerHTML = `<img id="overlayImage" src="${project.image || project.images[0]}" alt="Project" style="width:100%;height:100%;object-fit:cover;">`;
    }

    // Populate text info
    document.getElementById('overlayYear').textContent = project.year;
    document.getElementById('overlayTitle').textContent = project.title.toUpperCase();
    document.getElementById('overlayDescription').textContent = project.description;
    document.getElementById('overlayInput').textContent = project.input;
    
    // Hide like count (privacy - only show own count)
    const likeCountEl = document.getElementById('overlayLikeCount');
    if (likeCountEl) likeCountEl.style.display = 'none';

    // Techniques
    const techniquesGrid = document.getElementById('overlayTechniques');
    techniquesGrid.innerHTML = project.techniques.map((tech, idx) => `
      <div class="tech-chip ${idx < 2 ? 'highlight' : ''}">${tech}</div>
    `).join('');

    // Set "Lees meer" link to project page
    const readMoreLink = document.getElementById('readMoreLink');
    if (readMoreLink) {
      // Map project titles to their page files
      const projectPages = {
        'Startpunt': 'project-startpunt.html',
        '1Veen': 'project-1veen.html',
        'Tripje met de trein': 'project-tripje-met-trein.html',
        'Website redesign': 'project-website-redesign.html',
        'CHECK!': 'project-check.html',
        'ICDC': 'project-icdc.html'
      };
      
      const pageFile = projectPages[project.title] || 'index.html';
      readMoreLink.href = pageFile;
    }

    // Show overlay
    this.overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeDetail() {
    this.overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  openLikedProjectsModal() {
    const modal = document.getElementById('likedProjectsModal');
    const list = document.getElementById('likedProjectsList');
    
    const likedProjectIds = Object.keys(this.likeManager.likes)
      .filter(key => this.likeManager.likes[key] === true)
      .map(id => parseInt(id));
    
    if (likedProjectIds.length === 0) {
      list.innerHTML = '<p class="empty-state">Je hebt nog geen projecten geliked</p>';
    } else {
      const likedProjects = FEED_PROJECTS.filter(p => likedProjectIds.includes(p.id));
      const projectItems = likedProjects.map(project => `
        <div class="modal-project-item" data-project-id="${project.id}">
          <img src="${project.image}" alt="${project.title}" class="modal-project-image">
          <div class="modal-project-info">
            <h3>${project.title}</h3>
            <p>${project.year} • ${project.tags.slice(0, 2).join(', ')}</p>
          </div>
          <span class="modal-project-arrow">→</span>
        </div>
      `).join('');

      const likedNames = likedProjects.map(project => project.title);
      const contactNote = `Deze projecten vind ik vet: ${likedNames.join(', ')}`;

      list.innerHTML = `
        ${projectItems}
        <div class="liked-contact-cta-wrap">
          <p class="liked-contact-note">${contactNote}</p>
          <button class="liked-contact-btn" id="likedContactBtn">Neem contact op via het contactformulier</button>
        </div>
      `;

      // Add click handlers to open project details
      list.querySelectorAll('.modal-project-item').forEach(item => {
        item.addEventListener('click', () => {
          const projectId = parseInt(item.dataset.projectId);
          this.closeLikedProjectsModal();
          this.openDetail(projectId);
        });
      });

      const likedContactBtn = document.getElementById('likedContactBtn');
      likedContactBtn?.addEventListener('click', () => {
        this.openContactWithLikedProjects(likedProjects);
      });
    }
    
    modal.classList.add('active');
  }

  closeLikedProjectsModal() {
    const modal = document.getElementById('likedProjectsModal');
    modal.classList.remove('active');
  }

  openContactWithLikedProjects(likedProjects) {
    if (!likedProjects || likedProjects.length === 0) return;

    const likedNames = likedProjects.map(project => project.title).join(', ');
    const prefillMessage = `Hey Jesse, ik vind deze projecten vet: ${likedNames}. Ik wil graag contact opnemen over een samenwerking.`;

    try {
      localStorage.setItem('contact-prefill-message', prefillMessage);
      localStorage.setItem('contact-prefill-subject', 'Interesse in gelikete projecten');
    } catch (e) {
      console.warn('Could not store contact prefill context');
    }

    const params = new URLSearchParams({
      subject: 'Interesse in gelikete projecten',
      message: prefillMessage
    });

    window.location.href = `contact.html?${params.toString()}`;
  }
}

// === INITIALIZATION ===
document.addEventListener('DOMContentLoaded', () => {
  new FeedSystem();
});
