// Simpele Image Optimization - Alleen Lazy Loading
document.addEventListener('DOMContentLoaded', function() {
  
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
  
  console.log('✅ Image Optimization geladen - Snellere laadtijden!');
});
