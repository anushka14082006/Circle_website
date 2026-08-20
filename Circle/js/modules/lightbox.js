/* Circle Pune - Image Click Lightbox / Zoom Popup Modal */
document.addEventListener('DOMContentLoaded', () => {
  // Inject Lightbox Modal Markup if not present in DOM
  let lightboxModal = document.getElementById('image-lightbox-modal');
  
  if (!lightboxModal) {
    const modalHTML = `
      <div id="image-lightbox-modal" class="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 lg:p-8 opacity-0 pointer-events-none transition-opacity duration-300 ease-out" role="dialog" aria-modal="true" aria-label="Image Preview">
        <div id="lightbox-backdrop" class="absolute inset-0 bg-slate-950/85 backdrop-blur-xl transition-opacity duration-300"></div>
        <div class="relative z-10 max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center pointer-events-auto">
          <button id="lightbox-close-btn" class="absolute -top-12 right-0 sm:-top-4 sm:-right-4 w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 border border-white/20 text-white flex items-center justify-center text-lg transition-all shadow-xl hover:scale-110 group cursor-pointer focus:outline-none z-20" aria-label="Close Lightbox">
            <i class="fa-solid fa-xmark group-hover:rotate-90 transition-transform duration-300"></i>
          </button>
          <div id="lightbox-image-wrapper" class="relative rounded-2xl overflow-hidden shadow-2xl border border-white/15 bg-slate-900/60 max-h-[85vh] max-w-full transform scale-90 opacity-0 transition-all duration-300 ease-out flex items-center justify-center">
            <img id="lightbox-image" src="" alt="Enlarged Preview" class="max-h-[80vh] max-w-[88vw] sm:max-w-[80vw] object-contain rounded-xl select-none" />
            <div id="lightbox-caption" class="absolute bottom-0 inset-x-0 p-3 sm:p-4 bg-gradient-to-t from-slate-950/95 via-slate-950/70 to-transparent text-white font-poppins text-xs sm:text-sm font-semibold text-center tracking-wide backdrop-blur-xs"></div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    lightboxModal = document.getElementById('image-lightbox-modal');
  }

  const lightboxBackdrop = document.getElementById('lightbox-backdrop');
  const lightboxCloseBtn = document.getElementById('lightbox-close-btn');
  const lightboxImgWrapper = document.getElementById('lightbox-image-wrapper');
  const lightboxImg = document.getElementById('lightbox-image');
  const lightboxCaption = document.getElementById('lightbox-caption');

  let isOpen = false;

  function openLightbox(src, alt, captionText) {
    if (!src || isOpen) return;
    isOpen = true;

    lightboxImg.src = src;
    lightboxImg.alt = alt || 'Enlarged Image';
    
    if (captionText && captionText.trim()) {
      lightboxCaption.textContent = captionText.trim();
      lightboxCaption.classList.remove('hidden');
    } else {
      lightboxCaption.textContent = '';
      lightboxCaption.classList.add('hidden');
    }

    // Lock body scrolling
    document.body.style.overflow = 'hidden';

    // Show modal container
    lightboxModal.classList.remove('opacity-0', 'pointer-events-none');
    lightboxModal.classList.add('opacity-100', 'pointer-events-auto');

    // Trigger scale-in transition
    requestAnimationFrame(() => {
      lightboxImgWrapper.classList.remove('scale-90', 'opacity-0');
      lightboxImgWrapper.classList.add('scale-100', 'opacity-100');
    });
  }

  function closeLightbox() {
    if (!isOpen) return;
    isOpen = false;

    // Scale out and fade out wrapper
    lightboxImgWrapper.classList.remove('scale-100', 'opacity-100');
    lightboxImgWrapper.classList.add('scale-90', 'opacity-0');

    setTimeout(() => {
      lightboxModal.classList.remove('opacity-100', 'pointer-events-auto');
      lightboxModal.classList.add('opacity-0', 'pointer-events-none');
      document.body.style.overflow = '';
      lightboxImg.src = '';
    }, 280);
  }

  // Event Listeners for closing modal
  if (lightboxCloseBtn) {
    lightboxCloseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeLightbox();
    });
  }

  if (lightboxBackdrop) {
    lightboxBackdrop.addEventListener('click', closeLightbox);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
      closeLightbox();
    }
  });

  // Global event delegation to handle clicks on images and image cards across the entire website
  document.addEventListener('click', (e) => {
    // Check if user clicked an interactive action button or form control
    if (e.target.closest('button, input, select, textarea, a:not([data-lightbox])')) return;

    const clickedImg = e.target.closest('img');
    const clickedCard = e.target.closest('.hero-img-card, .member-card, .tilt-card, .event-card, .category-card, .story-card, [data-lightbox], .lightbox-trigger');

    if (clickedImg && (clickedCard || clickedImg.classList.contains('lightbox-trigger') || clickedImg.hasAttribute('data-lightbox'))) {
      const imgSrc = clickedImg.getAttribute('src');
      if (!imgSrc) return;

      const imgAlt = clickedImg.getAttribute('alt') || '';
      
      // Determine caption text from badge or header inside card if available
      let captionText = imgAlt;
      if (clickedCard) {
        const badgeOrTitle = clickedCard.querySelector('span.font-mono, h3, h4, .font-bold');
        if (badgeOrTitle && badgeOrTitle.textContent) {
          captionText = badgeOrTitle.textContent.trim();
        }
      }

      openLightbox(imgSrc, imgAlt, captionText);
    }
  });

  // Expose methods globally
  window.openLightbox = openLightbox;
  window.closeLightbox = closeLightbox;
});
