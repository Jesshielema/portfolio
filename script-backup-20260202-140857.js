/* ===========================
   script.js — Patched Version
   =========================== */

/* ---------- INIT GUARD (voorkomt dubbele init bij HMR/partials) ---------- */
if (window.__APP_INITIALIZED__) {
  console.debug('App already initialized, skipping…');
  throw new Error('INIT_GUARD');
}
window.__APP_INITIALIZED__ = true;

/* ---------- ANALYTICS & TRACKING ---------- */

function trackFormSubmission() {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'form_submit', { event_category: 'Contact', event_label: 'Contact Form Submission' });
  }
}

function trackProjectView(projectName) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'view_item', { event_category: 'Portfolio', event_label: projectName });
  }
}

/* ---------- GLOBAL STATE & DEBOUNCED RERENDER ---------- */

let posts = [
  { id: 1, title: "Character Design Project", image: "images/characters.jpg", type: "Design", date: "2024-01-15", featured: true, description: "Een uitgebreide character design studie voor een nieuwe animatieserie.", client: "Animation Studio XYZ", purpose: "Character ontwikkeling voor nieuwe serie", tools: "Photoshop, Illustrator, Procreate" },
  { id: 2, title: "Brand Identity", image: "images/project2.jpg", type: "Branding", date: "2024-01-10", featured: false, description: "Complete merkidentiteit voor een tech startup.", client: "TechStart BV", purpose: "Volledige rebranding voor marktlancering", tools: "Illustrator, InDesign, Figma" },
  { id: 3, title: "Mobile App Design", image: "images/project3.jpg", type: "UI/UX", date: "2024-01-08", featured: false, description: "Gebruiksvriendelijke mobile app voor fitness tracking.", client: "FitLife App", purpose: "Intuïtieve fitness tracking experience", tools: "Figma, Principle, After Effects" },
  { id: 4, title: "Logo Animation", image: "images/project4.jpg", type: "Motion", date: "2024-01-05", featured: true, description: "Dynamische logo animatie voor branding purposes.", client: "Dynamic Brands", purpose: "Levendige merkidentiteit voor video content", tools: "After Effects, Cinema 4D, Illustrator" },
  { id: 5, title: "Website Redesign", image: "images/project5.png", type: "Web", date: "2024-01-03", featured: false, description: "Moderne website redesign met focus op UX.", client: "E-commerce Plus", purpose: "Verbetering van conversie en gebruikerservaring", tools: "Figma, HTML/CSS, JavaScript" },
  { id: 6, title: "Packaging Design", image: "images/project6.png", type: "Design", date: "2024-01-01", featured: false, description: "Duurzame packaging oplossing voor cosmetica merk.", client: "Natural Beauty Co", purpose: "Eco-vriendelijke verpakking met premium uitstraling", tools: "Illustrator, Photoshop, KeyShot" },
  { id: 7, title: "Streetwear Collection", image: "images/project7.png", type: "Design", date: "2024-01-20", featured: false, description: "Urban streetwear collectie met focus op duurzaamheid.", client: "Urban Culture Brand", purpose: "Duurzame streetwear lijn voor jonge doelgroep", tools: "Illustrator, Photoshop, CLO 3D" },
  { id: 8, title: "Digital Campaign", image: "images/project8.png", type: "Design", date: "2024-01-18", featured: false, description: "Digitale campagne voor nieuwe productlancering.", client: "Innovation Labs", purpose: "Aandacht genereren voor product lancering", tools: "Photoshop, After Effects, Premiere Pro" },
  { id: 9, title: "E-commerce Platform", image: "images/project9.png", type: "Web", date: "2024-01-16", featured: false, description: "Moderne e-commerce platform met seamless UX.", client: "ShopEasy BV", purpose: "Verhogen van online verkoop en klanttevredenheid", tools: "Figma, React, Node.js" },
  { id: 10, title: "Motion Graphics Reel", image: "images/project10.png", type: "Motion", date: "2024-01-14", featured: false, description: "Showcase van motion graphics projecten.", client: "Portfolio showcase", purpose: "Demonstratie van motion design vaardigheden", tools: "After Effects, Cinema 4D, Premiere Pro" },
  { id: 11, title: "Corporate Identity", image: "images/project11.png", type: "Branding", date: "2024-01-12", featured: false, description: "Complete corporate identity voor financiële instelling.", client: "SecureBank NL", purpose: "Professionele en betrouwbare uitstraling", tools: "Illustrator, InDesign, Photoshop" },
  { id: 12, title: "Product Photography", image: "images/project12.png", type: "Photography", date: "2024-01-09", featured: false, description: "High-end product fotografie voor luxe merk.", client: "Luxury Goods Inc", purpose: "Premium productpresentatie voor e-commerce", tools: "Canon 5D, Lightroom, Photoshop" }
];

let __rerenderScheduled = false;
function scheduleRerender() {
  if (__rerenderScheduled) return;
  __rerenderScheduled = true;
  requestAnimationFrame(() => {
    loadPosts();
    renderFeed();
    updateHeroSection();
    __rerenderScheduled = false;
  });
}

/* ---------- SAFE ELEMENT REFS ---------- */
const menuBtn = document.getElementById('menuBtn');
const closeMenu = document.getElementById('closeMenu');
const sideMenu = document.getElementById('sideMenu');
const overlay  = document.getElementById('overlay');
const logoContainer = document.querySelector('.logo-container');
const logoVideo = document.querySelector('.logo-video');
const navbar = document.querySelector('.navbar');
const ctaButton = document.getElementById('ctaButton');
const mobileFilterBtn = document.getElementById('mobileFilterBtn');
const mobileFilterMenu = document.getElementById('mobileFilterMenu');
const mobileFilterOptions = document.querySelectorAll('.mobile-filter-option');
const filterText = document.querySelector('.filter-text');
const heroImageEl = document.querySelector('.hero-image img');
const heroImageWrapper = document.querySelector('.hero-image');
const postBadge = document.querySelector('.post-badge');

/* ---------- INTERACTIVE ELEMENTS ---------- */

function initializeInteractiveElements() {
  const projectItems = document.querySelectorAll('.work-item');

  projectItems.forEach(item => {
    item.addEventListener('mouseenter', function () {
      const projectName = this.querySelector('h3')?.textContent || 'Unknown Project';
      if (typeof gtag !== 'undefined') {
        gtag('event', 'project_hover', { event_category: 'Portfolio', event_label: projectName });
      }
    });
    item.addEventListener('click', function () {
      const projectName = this.querySelector('h3')?.textContent || 'Unknown Project';
      trackProjectView(projectName);
    });
  });

  // Smooth scroll - exclude plain "#" anchors
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  const contactForm = document.querySelector('form[name="contact"]');
  if (contactForm) contactForm.addEventListener('submit', trackFormSubmission);
}

/* ---------- LIGHTBOX / MODAL HELPERS ---------- */

function openModal(imageSrc, title, type, date, description, images = []) {
  const modal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalType = document.getElementById('modalType');
  const modalDate = document.getElementById('modalDate');
  const modalDescription = document.getElementById('modalDescription');

  if (!modal || !modalImage || !modalTitle) return;

  modalImage.src = imageSrc;
  modalTitle.textContent = title;
  if (modalType) modalType.textContent = type || '';
  if (modalDate) modalDate.textContent = date || '';
  if (modalDescription) modalDescription.textContent = description || '';

  modalImage.classList.remove('zoomed');
  modalImage.onclick = function () { this.classList.toggle('zoomed'); };

  if (images && images.length > 1) addImageGalleryNavigation(images, imageSrc);

  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';

  if (typeof gtag !== 'undefined') {
    gtag('event', 'modal_open', { event_category: 'Portfolio', event_label: title });
  }
}

function addImageGalleryNavigation(images, currentImage) {
  const container = document.querySelector('.modal-image');
  if (!container) return;

  let currentIndex = images.findIndex(img => img === currentImage);
  const existingNav = container.querySelector('.image-nav');
  if (existingNav) existingNav.remove();

  const nav = document.createElement('div');
  nav.className = 'image-nav';
  nav.innerHTML = `
    <button class="nav-btn prev-btn" ${currentIndex === 0 ? 'disabled' : ''}>❮</button>
    <div class="image-counter">${currentIndex + 1} / ${images.length}</div>
    <button class="nav-btn next-btn" ${currentIndex === images.length - 1 ? 'disabled' : ''}>❯</button>
  `;
  const prevBtn = nav.querySelector('.prev-btn');
  const nextBtn = nav.querySelector('.next-btn');
  const counter = nav.querySelector('.image-counter');
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

  container.appendChild(nav);
}

/* ---------- ADMIN ---------- */

function initializeAdminPanel() {
  if (!window.location.pathname.includes('admin.html')) return;
  loadAdminContent();
  setupAdminEventListeners();
}

function loadAdminContent() {
  const data = getPortfolioData();
  populateAdminForm(data);
}

function getPortfolioData() {
  const items = document.querySelectorAll('.work-item');
  const data = [];
  items.forEach((item, index) => {
    const img = item.querySelector('img');
    const title = item.querySelector('h3')?.textContent;
    const description = item.querySelector('p')?.textContent || '';
    if (img && title) {
      data.push({
        id: index + 1, title, description,
        image: img.src, images: [img.src],
        type: 'Design', date: '2024',
        featured: item.classList.contains('featured') || false
      });
    }
  });
  return data;
}

function populateAdminForm(data) {
  const adminContainer = document.getElementById('adminContainer');
  if (!adminContainer) return;
  adminContainer.innerHTML = `
    <div class="admin-header">
      <h1>Portfolio Admin Panel</h1>
      <button class="btn-primary" onclick="addNewProject()">+ Nieuw Project</button>
    </div>
    <div class="projects-grid" id="projectsGrid">
      ${data.map(createProjectCard).join('')}
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

function addNewProject() {
  const grid = document.getElementById('projectsGrid');
  const newId = Date.now();
  const html = createProjectCard({
    id: newId, title: 'Nieuw Project', description: 'Project beschrijving...',
    images: ['images/placeholder.svg'], type: 'Branding',
    date: new Date().getFullYear(), featured: false
  });
  grid?.insertAdjacentHTML('beforeend', html);
}

function addImage(projectId) {
  const fileInput = document.createElement('input');
  fileInput.type = 'file'; fileInput.accept = 'image/*'; fileInput.multiple = true;
  fileInput.onchange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = function (event) {
        const card = document.querySelector(`[data-id="${projectId}"]`);
        const imageCount = card?.querySelector('.image-count');
        const currentCount = parseInt(imageCount?.textContent || '0', 10);
        if (imageCount) imageCount.textContent = `${currentCount + 1} foto('s)`;
        // Upload/opslaan zou hier moeten gebeuren
        console.log(`Adding image to project ${projectId}`, event.target.result);
      };
      reader.readAsDataURL(file);
    });
  };
  fileInput.click();
}

function editProject(projectId) { console.log(`Editing project ${projectId}`); }

function deleteProject(projectId) {
  if (!confirm('Weet je zeker dat je dit project wilt verwijderen?')) return;
  const card = document.querySelector(`[data-id="${projectId}"]`);
  card?.remove();
}

function saveChanges() {
  const cards = document.querySelectorAll('.admin-project-card');
  const data = [];
  cards.forEach(card => {
    data.push({
      id: card.dataset.id,
      title: card.querySelector('.project-title')?.value || '',
      description: card.querySelector('.project-description')?.value || '',
      type: card.querySelector('.project-type')?.value || '',
      date: card.querySelector('.project-date')?.value || '',
      featured: !!card.querySelector('input[type="checkbox"]')?.checked
    });
  });
  console.log('Saving portfolio data:', data);
  alert('Wijzigingen opgeslagen! (Demo versie - geen echte opslag)');
}

function previewSite() { window.open('index.html', '_blank'); }

/* ---------- FEED RENDERING ---------- */

function loadPosts() {
  const storage = window.safeStorage || localStorage;
  let savedPosts = [], deletedPosts = [], overriddenPosts = {}, hiddenHardcodedPosts = [], overriddenHardcodedPosts = {};
  try {
    savedPosts = JSON.parse(storage.getItem('portfolioPosts') || '[]');
    deletedPosts = JSON.parse(storage.getItem('deletedDefaultPosts') || '[]');
    overriddenPosts = JSON.parse(storage.getItem('overriddenDefaultPosts') || '{}');
    hiddenHardcodedPosts = JSON.parse(storage.getItem('hiddenHardcodedPosts') || '[]');
    overriddenHardcodedPosts = JSON.parse(storage.getItem('overriddenHardcodedPosts') || '{}');
  } catch (e) { console.warn('Error loading storage:', e); }

  const visibleDefault = posts
    .filter(p => !deletedPosts.includes(p.id))
    .filter(p => !hiddenHardcodedPosts.includes(p.id))
    .map(p => overriddenHardcodedPosts[p.id] || overriddenPosts[p.id] || p);

  const all = [...visibleDefault, ...savedPosts];
  const unique = [];
  const seen = new Set();
  for (const p of all) { if (!seen.has(p.id)) { unique.push(p); seen.add(p.id); } }
  posts = unique;
}

function renderFeed() {
  const grid = document.getElementById('postsContainer');
  if (!grid) return;
  const sorted = [...posts].sort((a,b)=> new Date(b.date) - new Date(a.date));
  const frag = document.createDocumentFragment();
  sorted.forEach(p => frag.appendChild(createPostElement(p)));
  grid.innerHTML = '';
  grid.appendChild(frag);
}

function createPostElement(post) {
  const postDiv = document.createElement('div');
  postDiv.className = `post-card ${post.featured ? 'featured' : ''}`;

  const imgs = post.images || [post.image || post.mainImage];
  const mainImage = imgs[0];

  const imageHTML = imgs.length > 1
    ? `
      <div class="post-image-slider">
        <div class="slider-wrapper">
          ${imgs.map((img,i)=>`
            <div class="slide ${i===0?'active':''}" data-slide="${i}">
              <img src="${img}" alt="${post.title} - Image ${i+1}" loading="lazy" onerror="this.src='images/placeholder.svg'">
            </div>`).join('')}
        </div>
        <div class="slider-controls">
          <button class="slider-btn prev" onclick="changePostSlide(this, -1)">❮</button>
          <button class="slider-btn next" onclick="changePostSlide(this, 1)">❯</button>
        </div>
        <div class="slider-indicators">
          ${imgs.map((_,i)=>`<span class="indicator ${i===0?'active':''}" onclick="goToPostSlide(this, ${i})"></span>`).join('')}
        </div>
        <div class="post-overlay">
          <div class="post-type">${post.type || post.category || 'Design'}</div>
          <div class="image-count">📷 ${imgs.length}</div>
        </div>
      </div>`
    : `
      <div class="post-image">
        <img class="single-image" src="${mainImage}" alt="${post.title}" loading="lazy" onerror="this.src='images/placeholder.svg'">
        <div class="post-overlay"><div class="post-type">${post.type || post.category || 'Design'}</div></div>
      </div>`;

  postDiv.innerHTML = `
    ${imageHTML}
    <div class="post-content">
      <h3 class="post-title">${post.title}</h3>
      <p class="post-date">${formatDate(post.date)}</p>
      ${post.description ? `<p class="post-description">${post.description}</p>` : ''}
    </div>`;

  const postImages = postDiv.querySelectorAll('.slide img, .single-image');
  postImages.forEach((img, index) => {
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      openImageLightbox(imgs, index, post.title);
    });
    img.style.cursor = 'pointer';
  });

  postDiv.addEventListener('click', (e) => {
    if (!e.target.closest('.slider-btn') && !e.target.closest('.indicator') && !e.target.closest('img')) {
      openPostDetail(post);
    }
  }, { passive: true });

  return postDiv;
}

function changePostSlide(button, direction) {
  const slider = button.closest('.post-image-slider');
  const slides = slider.querySelectorAll('.slide');
  const indicators = slider.querySelectorAll('.indicator');

  let currentIndex = Array.from(slides).findIndex(s => s.classList.contains('active'));
  slides[currentIndex].classList.remove('active');
  indicators[currentIndex].classList.remove('active');

  currentIndex += direction;
  if (currentIndex >= slides.length) currentIndex = 0;
  if (currentIndex < 0) currentIndex = slides.length - 1;

  slides[currentIndex].classList.add('active');
  indicators[currentIndex].classList.add('active');
}

function goToPostSlide(indicator, slideIndex) {
  const slider = indicator.closest('.post-image-slider');
  const slides = slider.querySelectorAll('.slide');
  const indicators = slider.querySelectorAll('.indicator');
  slides.forEach(s => s.classList.remove('active'));
  indicators.forEach(i => i.classList.remove('active'));
  slides[slideIndex].classList.add('active');
  indicators[slideIndex].classList.add('active');
}

function formatDate(dateString) {
  const d = new Date(dateString);
  return d.toLocaleDateString('nl-NL', { year:'numeric', month:'long', day:'numeric' });
}

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

  if (!modal || !modalImage || !modalTitle) return;

  const images = post.images || [post.image || post.mainImage];
  const mainImage = images[0];

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

  if (images.length > 1) {
    modal.dataset.images = JSON.stringify(images);
    modal.dataset.currentImage = '0';
    const container = modalImage.parentNode;
    let nav = container.querySelector('.modal-image-nav');
    if (!nav) {
      nav = document.createElement('div');
      nav.className = 'modal-image-nav';
      nav.innerHTML = `
        <button class="modal-nav-btn prev" onclick="changeModalImage(-1)">❮</button>
        <button class="modal-nav-btn next" onclick="changeModalImage(1)">❯</button>`;
      container.appendChild(nav);
    }
    let counter = container.querySelector('.modal-image-counter');
    if (!counter) {
      counter = document.createElement('div');
      counter.className = 'modal-image-counter';
      container.appendChild(counter);
    }
    counter.textContent = `1 / ${images.length}`;
    nav.style.display = 'flex';
    counter.style.display = 'block';
  } else {
    const container = modalImage.parentNode;
    const nav = container.querySelector('.modal-image-nav');
    const counter = container.querySelector('.modal-image-counter');
    if (nav) nav.style.display = 'none';
    if (counter) counter.style.display = 'none';
  }

  // CTA
  let ctaButton = modal.querySelector('.modal-cta-btn');
  if (!ctaButton) {
    ctaButton = document.createElement('button');
    ctaButton.className = 'modal-cta-btn';
    ctaButton.innerHTML = 'Dit wil ik ook!';
    ctaButton.addEventListener('click', () => {
      if (typeof gtag !== 'undefined') gtag('event', 'cta_click', { event_category: 'Contact', event_label: post.title });
      closePostModal();
      const contact = document.getElementById('contact');
      contact ? contact.scrollIntoView({ behavior: 'smooth' }) : (window.location.href = 'contact.html');
    });
    const info = modal.querySelector('.modal-info, .work-info, .lightbox-info');
    if (info) {
      const c = document.createElement('div');
      c.className = 'modal-cta-container';
      c.appendChild(ctaButton);
      info.appendChild(c);
    } else {
      const content = modal.querySelector('.modal-content');
      if (content) {
        const headerDiv = document.createElement('div');
        headerDiv.className = 'modal-header';
        headerDiv.appendChild(ctaButton);
        content.insertBefore(headerDiv, content.firstChild);
      }
    }
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  document.body.classList.add('modal-open');

  trackProjectView(post.title);
}

function openImageLightbox(images, startIndex = 0, projectTitle = '') {
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
        <div class="lightbox-info"><span class="lightbox-counter"></span><span class="lightbox-title"></span></div>
        <div class="lightbox-cta">
          <button class="cta-like-btn">❤️ Vind je dit mooi?</button>
          <p>Wil je ook zoiets? Laten we praten!</p>
        </div>
      </div>`;
    document.body.appendChild(lightbox);
    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-backdrop').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-nav.prev').addEventListener('click', () => changeLightboxImage(-1));
    lightbox.querySelector('.lightbox-nav.next').addEventListener('click', () => changeLightboxImage(1));
    lightbox.querySelector('.cta-like-btn').addEventListener('click', handleLikeAction);
    document.addEventListener('keydown', handleLightboxKeydown);
  }

  lightbox.dataset.images = JSON.stringify(images);
  lightbox.dataset.currentIndex = startIndex;
  lightbox.dataset.projectTitle = projectTitle;

  updateLightboxDisplay();
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function updateLightboxDisplay() {
  const lightbox = document.getElementById('imageLightbox');
  if (!lightbox) return;
  const images = JSON.parse(lightbox.dataset.images || '[]');
  let currentIndex = parseInt(lightbox.dataset.currentIndex || '0', 10);
  const title = lightbox.dataset.projectTitle || '';
  const imgEl = lightbox.querySelector('.lightbox-image');
  const counter = lightbox.querySelector('.lightbox-counter');
  const prevBtn = lightbox.querySelector('.lightbox-nav.prev');
  const nextBtn = lightbox.querySelector('.lightbox-nav.next');
  const titleEl = lightbox.querySelector('.lightbox-title');

  imgEl.src = images[currentIndex];
  imgEl.alt = `${title} - Afbeelding ${currentIndex + 1}`;
  counter.textContent = `${currentIndex + 1} / ${images.length}`;
  titleEl.textContent = title;
  const showNav = images.length > 1;
  prevBtn.style.display = showNav ? 'block' : 'none';
  nextBtn.style.display = showNav ? 'block' : 'none';
}

function changeLightboxImage(direction) {
  const lightbox = document.getElementById('imageLightbox');
  const images = JSON.parse(lightbox.dataset.images || '[]');
  let i = parseInt(lightbox.dataset.currentIndex || '0', 10);
  i += direction;
  if (i >= images.length) i = 0;
  if (i < 0) i = images.length - 1;
  lightbox.dataset.currentIndex = i;
  updateLightboxDisplay();
}

function closeLightbox() {
  const lightbox = document.getElementById('imageLightbox');
  if (!lightbox) return;
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
  document.removeEventListener('keydown', handleLightboxKeydown);
}

function handleLightboxKeydown(e) {
  if (e.key === 'Escape') closeLightbox();
  else if (e.key === 'ArrowLeft') changeLightboxImage(-1);
  else if (e.key === 'ArrowRight') changeLightboxImage(1);
}

function handleLikeAction() {
  const lightbox = document.getElementById('imageLightbox');
  const projectTitle = lightbox?.dataset.projectTitle || '';
  if (typeof gtag !== 'undefined') gtag('event', 'like_project', { event_category: 'Engagement', event_label: projectTitle });
  const btn = lightbox.querySelector('.cta-like-btn');
  btn.innerHTML = '✅ Geliked!';
  btn.style.background = '#27ae60';
  setTimeout(() => {
    closeLightbox();
    const contact = document.getElementById('contact');
    contact ? contact.scrollIntoView({ behavior: 'smooth' }) : (window.location.href = 'contact.html');
  }, 1500);
}

function changeModalImage(direction) {
  const modal = document.getElementById('postModal');
  const modalImage = document.getElementById('modalImage');
  if (!modal || !modalImage || !modal.dataset.images) return;
  const images = JSON.parse(modal.dataset.images);
  let i = parseInt(modal.dataset.currentImage || '0', 10);
  i += direction;
  if (i >= images.length) i = 0;
  if (i < 0) i = images.length - 1;
  modalImage.src = images[i];
  modal.dataset.currentImage = i;
  const counter = modalImage.parentNode.querySelector('.modal-image-counter');
  if (counter) counter.textContent = `${i + 1} / ${images.length}`;
}

function closePostModal() {
  const modal = document.getElementById('postModal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
  document.body.classList.remove('modal-open');
}

/* ---------- SCROLL/HEADER/CTA ---------- */

function playStartAnimation() {
  const boldWord = document.querySelector('.bold-word');
  const differenceWord = document.querySelector('.difference-word');
  if (!(boldWord && differenceWord)) return;

  setTimeout(() => {
    boldWord.style.transform = 'scale(1.2) skew(-8deg)';
    boldWord.style.background = 'linear-gradient(45deg, #ffff00, #ffd700, #6ec512, #6fff0f)';
    boldWord.style.backgroundSize = '400% 400%';
    boldWord.style.webkitBackgroundClip = 'text';
    boldWord.style.backgroundClip = 'text';
    boldWord.style.webkitTextFillColor = 'transparent';
    boldWord.style.filter = 'drop-shadow(0 8px 15px rgba(255,215,0,0.6))';
    boldWord.style.animation = 'gradientShift 2s ease infinite';

    differenceWord.style.color = '#6ec512';
    differenceWord.style.fontWeight = '900';
    differenceWord.style.textShadow = '0 0 20px rgba(110, 197, 18, 0.5)';

    setTimeout(() => {
      boldWord.style.transform = '';
      boldWord.style.background = '';
      boldWord.style.webkitBackgroundClip = '';
      boldWord.style.backgroundClip = '';
      boldWord.style.webkitTextFillColor = '';
      boldWord.style.filter = '';
      boldWord.style.animation = '';

      differenceWord.style.color = '';
      differenceWord.style.fontWeight = '';
      differenceWord.style.textShadow = '';
    }, 3000);
  }, 1000);
}

if (ctaButton) {
  ctaButton.addEventListener('click', () => {
    document.querySelector('.feed')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

/* See More (behaviour blijft gelijk, maar zonder extra reloads) */
const seeMoreBtn = document.getElementById('seeMoreBtn');
const seeMoreContainer = document.getElementById('seeMoreContainer');
const feedGridEl = document.querySelector('.feed-grid');

if (seeMoreBtn && feedGridEl) {
  feedGridEl.classList.add('collapsed');
  function checkSeeMoreVisibility() {
    const postsCount = feedGridEl.children.length;
    postsCount <= 8 ? seeMoreContainer?.classList.add('hidden') : seeMoreContainer?.classList.remove('hidden');
  }
  seeMoreBtn.addEventListener('click', () => {
    const isCollapsed = feedGridEl.classList.contains('collapsed');
    if (isCollapsed) {
      feedGridEl.classList.remove('collapsed');
      seeMoreBtn.classList.add('expanded');
      seeMoreBtn.querySelector('.see-more-text').textContent = 'See';
    } else {
      feedGridEl.classList.add('collapsed');
      seeMoreBtn.classList.remove('expanded');
      seeMoreBtn.querySelector('.see-more-text').textContent = 'See more';
      document.querySelector('.feed')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
  checkSeeMoreVisibility();
  const obs = new MutationObserver(checkSeeMoreVisibility);
  obs.observe(feedGridEl, { childList: true });
}

/* Navbar scroll effect */
window.addEventListener('scroll', () => {
  const feedSection = document.querySelector('.feed');
  const scrollY = window.scrollY;
  if (feedSection && navbar) {
    const feedPos = feedSection.offsetTop - 100;
    scrollY >= feedPos ? navbar.classList.add('scrolled') : navbar.classList.remove('scrolled');
  }
});

/* Menu toggles */
menuBtn && menuBtn.addEventListener('click', () => {
  sideMenu?.classList.toggle('active');
  overlay?.classList.toggle('active');
});
closeMenu && closeMenu.addEventListener('click', () => {
  sideMenu?.classList.remove('active');
  overlay?.classList.remove('active');
});
overlay && overlay.addEventListener('click', () => {
  sideMenu?.classList.remove('active');
  overlay?.classList.remove('active');
});

/* Mobile Filter Dropdown */
if (mobileFilterBtn && mobileFilterMenu) {
  mobileFilterBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    mobileFilterMenu.classList.toggle('open');
    mobileFilterBtn.classList.toggle('active');
  });
  document.addEventListener('click', (e) => {
    if (!mobileFilterBtn.contains(e.target) && !mobileFilterMenu.contains(e.target)) {
      mobileFilterMenu.classList.remove('open');
      mobileFilterBtn.classList.remove('active');
    }
  });
  mobileFilterOptions.forEach(option => {
    option.addEventListener('click', (e) => {
      e.preventDefault();
      mobileFilterOptions.forEach(o => o.classList.remove('active'));
      option.classList.add('active');
      if (filterText) filterText.textContent = option.textContent;
      mobileFilterMenu.classList.remove('open');
      mobileFilterBtn.classList.remove('active');

      const filter = option.dataset.filter;
      filterPosts(filter);

      const desktopFilterBtns = document.querySelectorAll('.filter-btn');
      desktopFilterBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.filter === filter));
    });
  });
}

/* Logo hover video */
if (logoContainer && logoVideo) {
  let t;
  logoContainer.addEventListener('mouseenter', () => {
    clearTimeout(t);
    logoVideo.play().catch(()=>{});
  }, { passive: true });
  logoContainer.addEventListener('mouseleave', () => {
    t = setTimeout(() => { logoVideo.pause(); logoVideo.currentTime = 0; }, 100);
  }, { passive: true });
}

/* ---------- TIMELINE (zonder <style> spammen) ---------- */

function initTimelineAnimations() {
  const timeline = document.querySelector('.timeline');
  const items = document.querySelectorAll('.timeline-item');
  if (!timeline || items.length === 0) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        updateTimelineHeight();
      }
    });
  }, { threshold: 0.3, rootMargin: '0px 0px -10% 0px' });

  items.forEach(item => obs.observe(item));

  function updateTimelineHeight() {
    const visible = document.querySelectorAll('.timeline-item.animate');
    if (!visible.length) return;
    const last = visible[visible.length - 1];
    const tlRect = timeline.getBoundingClientRect();
    const lastRect = last.getBoundingClientRect();
    const newH = (lastRect.top + lastRect.height / 2) - tlRect.top;
    timeline.style.setProperty('--timeline-height', Math.max(0, newH) + 'px');
  }

  setTimeout(updateTimelineHeight, 100);
  window.addEventListener('scroll', updateTimelineHeight, { passive: true });
}

/* ---------- FILTERS ---------- */

function initializeFilters() {
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      button.classList.add('active');
      const type = button.getAttribute('data-filter');
      filterPosts(type);
      if (mobileFilterOptions && filterText) {
        mobileFilterOptions.forEach(opt => opt.classList.remove('active'));
        const match = Array.from(mobileFilterOptions).find(opt => opt.dataset.filter === type);
        if (match) { match.classList.add('active'); filterText.textContent = match.textContent; }
      }
    });
  });
}

function filterPosts(type = 'all') {
  const grid = document.getElementById('postsContainer');
  if (!grid) return;
  const list = type === 'all' ? posts : posts.filter(p => p.type === type);
  const frag = document.createDocumentFragment();
  list.forEach(p => frag.appendChild(createPostElement(p)));
  grid.innerHTML = '';
  grid.appendChild(frag);
}

/* ---------- HERO ---------- */

heroImageWrapper && heroImageWrapper.addEventListener('click', () => {
  const latest = [...posts].sort((a,b)=> new Date(b.date)-new Date(a.date))[0];
  if (latest) scrollToPost(latest.id);
  else document.querySelector('.feed')?.scrollIntoView({ behavior: 'smooth' });
});

function updateHeroSection() {
  const sorted = [...posts].sort((a,b)=> new Date(b.date) - new Date(a.date));
  const latest = sorted[0];
  if (!(latest && heroImageEl && postBadge)) return;
  heroImageEl.src = latest.image;
  heroImageEl.alt = latest.title;
  postBadge.innerHTML = `NEW POST: ${latest.title.toUpperCase()} <span class="badge-arrow">→</span>`;
  heroImageEl.onerror = function () {
    this.src = 'images/placeholder.svg';
    this.alt = 'Image not available';
  };
}

function scrollToPost(postId) {
  const feedSection = document.querySelector('.feed');
  const headerHeight = document.querySelector('.navbar')?.offsetHeight || 0;
  if (feedSection) {
    window.scrollTo({ top: feedSection.offsetTop - headerHeight - 20, behavior: 'smooth' });
  }
  setTimeout(() => {
    const postCards = document.querySelectorAll('.post-card');
    postCards.forEach(card => {
      const postTitle = card.querySelector('.post-title')?.textContent || '';
      const current = posts.find(p => p.title === postTitle);
      if (current && current.id === postId) {
        card.style.border = '3px solid #ff4444';
        card.style.transform = 'scale(1.02)';
        setTimeout(() => {
          if (!card.classList.contains('featured')) card.style.border = 'none';
          card.style.transform = 'none';
        }, 3000);
      }
    });
  }, 500);
}

/* ---------- CONTACT FORM ---------- */

function handleContactForm(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const name = formData.get('naam') || event.target.querySelector('input[placeholder="Naam"]')?.value || '';
  const email = formData.get('email') || event.target.querySelector('input[placeholder="Email"]')?.value || '';
  const message = formData.get('bericht') || event.target.querySelector('textarea[placeholder="Bericht"]')?.value || '';
  if (!name || !email || !message) return alert('Vul alle velden in.');

  const subject = encodeURIComponent(`Portfolio Contact: ${name}`);
  const body = encodeURIComponent(`Naam: ${name}\nEmail: ${email}\n\nBericht:\n${message}`);
  window.location.href = `mailto:jesse@example.com?subject=${subject}&body=${body}`;

  event.target.reset();
  const button = event.target.querySelector('button[type="submit"]');
  if (!button) return;
  const original = button.innerHTML;
  button.innerHTML = '✓ Verzonden!';
  button.style.background = '#4CAF50';
  setTimeout(() => { button.innerHTML = original; button.style.background = ''; }, 3000);
}

/* ---------- STORAGE-EVENTGEDREVEN REFRESH (geen 1s poller meer) ---------- */

function refreshFromStorageFlags() {
  try {
    const storage = window.safeStorage || localStorage;
    const lastUpdate = storage.getItem('lastPortfolioUpdate');
    const newPostAdded = storage.getItem('newPostAdded');
    const lastCheck = sessionStorage.getItem('lastPortfolioCheck');
    if ((lastUpdate && lastUpdate !== lastCheck) || newPostAdded === 'true') {
      scheduleRerender();
      if (lastUpdate) sessionStorage.setItem('lastPortfolioCheck', lastUpdate);
      if (newPostAdded === 'true') storage.removeItem('newPostAdded');
    }
  } catch (e) { console.warn(e); }
}

window.addEventListener('focus', refreshFromStorageFlags);
document.addEventListener('visibilitychange', () => { if (!document.hidden) refreshFromStorageFlags(); });
window.addEventListener('storage', (e) => {
  if ([
    'newPostAdded','portfolioPosts','portfolioUpdated','lastPortfolioUpdate',
    'forcePortfolioReload','forceRefresh','deletedDefaultPosts','overriddenDefaultPosts'
  ].includes(e.key)) {
    refreshFromStorageFlags();
  }
});

/* ---------- FALLBACKS / MISC ---------- */

function initializeFallbackPortfolio() {
  console.log('🔄 Initializing fallback portfolio display (CMS niet gevonden)…');
}

/* ---------- DOM READY ---------- */

document.addEventListener('DOMContentLoaded', () => {
  initializeFilters();
  initializeInteractiveElements();
  initializeAdminPanel();
  initTimelineAnimations();

  // Modal close bindings
  const closeModalBtn = document.getElementById('modalClose');
  const modal = document.getElementById('postModal');
  closeModalBtn && closeModalBtn.addEventListener('click', closePostModal);
  modal && modal.addEventListener('click', (e) => { if (e.target === modal) closePostModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal?.classList.contains('active')) closePostModal(); });

  // Netlify CMS detection
  setTimeout(() => {
    if (window.portfolioLoader) {
      console.log('✅ Netlify CMS integration detected and active');
      const old = document.querySelector('[data-old-portfolio]');
      if (old) { old.remove(); console.log('🗑️ Removed old portfolio initialization'); }
    } else {
      console.log('⚠️ Netlify CMS integration not found, using fallback');
      initializeFallbackPortfolio();
    }
  }, 1000);

  // Start
  scheduleRerender();
});

window.addEventListener('load', playStartAnimation);

/* ---------- EXTRA SMALL EFFECTS (veilig gemaakt) ---------- */

(function addSmallEffects() {
  const boldWord = document.querySelector('.bold-word');
  const ordinaryWord = document.querySelector('.ordinary-word');
  if (boldWord && ordinaryWord) {
    boldWord.addEventListener('mouseenter', () => {
      ordinaryWord.style.opacity = '0.2';
      ordinaryWord.style.filter = 'blur(4px)';
      ordinaryWord.style.color = '#bbb';
      // letter-by-letter
      const text = boldWord.textContent;
      boldWord.innerHTML = '';
      [...text].forEach((letter, i) => {
        const span = document.createElement('span');
        span.textContent = letter;
        span.style.opacity = '0';
        span.style.color = '#3498db';
        span.style.transform = 'translateY(20px)';
        span.style.transition = `all 0.1s ease ${i * 0.05}s`;
        boldWord.appendChild(span);
        setTimeout(() => { span.style.opacity = '1'; span.style.transform = 'translateY(0)'; }, i * 50);
      });
    });
    boldWord.addEventListener('mouseleave', () => { setTimeout(() => { boldWord.innerHTML = 'BOLD'; }, 300); });
    boldWord.addEventListener('mouseleave', () => {
      ordinaryWord.style.opacity = '1';
      ordinaryWord.style.filter = 'none';
      ordinaryWord.style.color = '#222';
    });
    const addRipple = (el) => {
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
      el.style.position = 'relative';
      el.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    };
    boldWord.addEventListener('click', () => addRipple(boldWord));
    ordinaryWord.addEventListener('click', () => addRipple(ordinaryWord));
  }

  const style = document.createElement('style');
  style.textContent = `@keyframes ripple{to{transform:scale(4);opacity:0}}`;
  document.head.appendChild(style);
})();

/* ---------- EXPORTS (optioneel voor debugging) ---------- */
window.resetPortfolioData = function resetPortfolioData() {
  localStorage.removeItem('portfolioPosts');
  localStorage.removeItem('deletedDefaultPosts');
  localStorage.removeItem('overriddenDefaultPosts');
  localStorage.removeItem('newPostAdded');
  console.log('Portfolio data reset. Reloading page…');
  location.reload();
};
