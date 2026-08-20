/* Circle Pune - Member Spotlight Interactive Focus Animation Engine */
document.addEventListener('DOMContentLoaded', () => {
  const membersSection = document.getElementById('members');
  if (!membersSection) return;

  const overlay = document.getElementById('member-spotlight-overlay');
  const backdrop = document.getElementById('spotlight-backdrop');
  const spotlightCard = document.getElementById('spotlight-card');
  const spotlightImg = document.getElementById('spotlight-img');
  const spotlightInfo = document.getElementById('spotlight-info');
  const spotlightName = document.getElementById('spotlight-name');
  const spotlightRole = document.getElementById('spotlight-role');
  const spotlightBio = document.getElementById('spotlight-bio');
  const spotlightTags = document.getElementById('spotlight-tags');
  const spotlightFooter = document.getElementById('spotlight-footer');
  const spotlightCloseBtn = document.getElementById('spotlight-close-btn');

  if (!overlay || !spotlightCard || !spotlightImg || !spotlightInfo) return;

  let activeCard = null;
  let isFocused = false;
  let isAnimating = false;
  let parallaxActive = false;
  let sourceRect = null;
  let savedScrollOverflow = '';

  // Query member cards
  function getMemberCards() {
    return document.querySelectorAll('.member-card');
  }

  // Attach click and keyboard listeners to member cards
  function bindCardEvents() {
    const cards = getMemberCards();
    cards.forEach((card) => {
      // Prevent duplicate binding
      if (card.dataset.spotlightBound) return;
      card.dataset.spotlightBound = 'true';

      // Click trigger (Desktop and Mobile touch)
      card.addEventListener('click', (e) => {
        // Allow external links (e.g. social icons) inside the card to function without triggering spotlight
        if (e.target.closest('a')) return;

        e.preventDefault();
        if (isFocused && activeCard === card) {
          closeSpotlight();
        } else {
          openSpotlight(card);
        }
      });

      // Keyboard accessibility trigger (Enter / Space)
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          if (e.target.closest('a')) return;
          e.preventDefault();
          if (isFocused && activeCard === card) {
            closeSpotlight();
          } else {
            openSpotlight(card);
          }
        }
      });
    });
  }

  // Open Spotlight Focus View
  function openSpotlight(card) {
    if (isAnimating) return;
    if (isFocused && activeCard !== card) {
      closeSpotlight();
    }

    activeCard = card;
    isAnimating = true;
    card.setAttribute('aria-expanded', 'true');

    const sourceImg = card.querySelector('img');
    const nameEl = card.querySelector('h4');
    const roleEl = card.querySelector('p.font-mono') || card.querySelector('p.text-xs');
    const bioEl = card.querySelector('p.text-slate-600');
    const tagsEl = card.querySelector('.flex.flex-wrap');
    const footerEl = card.querySelector('.border-t');

    if (!sourceImg || !nameEl) {
      isAnimating = false;
      return;
    }

    // Lock body scrolling
    savedScrollOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Capture source image bounding rectangle
    sourceRect = sourceImg.getBoundingClientRect();

    // Copy border color from source image
    const sourceBorderClass = Array.from(sourceImg.classList).find(c => c.startsWith('border-')) || 'border-indigo-400';
    spotlightImg.className = `object-cover pointer-events-auto border-2 ${sourceBorderClass}`;

    // Populate spotlight layout content
    spotlightImg.src = sourceImg.src;
    spotlightImg.alt = sourceImg.alt || nameEl.textContent;
    spotlightName.textContent = nameEl.textContent;

    if (roleEl) {
      spotlightRole.textContent = roleEl.textContent;
      spotlightRole.className = roleEl.className + ' text-xs sm:text-sm font-semibold tracking-wide';
    }

    if (bioEl) {
      spotlightBio.textContent = bioEl.textContent;
    }

    if (tagsEl) {
      spotlightTags.innerHTML = tagsEl.innerHTML;
    }

    if (footerEl) {
      spotlightFooter.innerHTML = footerEl.innerHTML;
    }

    // Calculate dimensions for FLIP transition & centering
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;
    const isMobile = viewportW < 640;

    const imgTargetSize = isMobile
      ? Math.min(viewportW * 0.68, viewportH * 0.28, 220)
      : Math.min(viewportW * 0.4, viewportH * 0.36, 280);

    const infoWidth = Math.min(viewportW * 0.9, 440);
    const totalContentH = imgTargetSize + 16 + (isMobile ? 190 : 220);

    const targetTop = Math.max(isMobile ? 20 : 28, (viewportH - totalContentH) / 2);
    const targetLeft = (viewportW - imgTargetSize) / 2;
    const infoLeft = (viewportW - infoWidth) / 2;
    const infoTop = targetTop + imgTargetSize + 16;

    // Display overlay container
    gsap.set(overlay, { opacity: 1, pointerEvents: 'auto', display: 'flex' });
    gsap.set(backdrop, { opacity: 0 });

    // Set floating image initial position (exact source bounds)
    gsap.set(spotlightImg, {
      position: 'fixed',
      left: sourceRect.left,
      top: sourceRect.top,
      width: sourceRect.width,
      height: sourceRect.height,
      borderRadius: '16px',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
      zIndex: 9980,
      x: 0,
      y: 0,
      transformOrigin: 'center center'
    });

    // Set info box initial position
    gsap.set(spotlightInfo, {
      position: 'fixed',
      left: infoLeft,
      top: infoTop,
      width: infoWidth,
      opacity: 0,
      y: 35,
      scale: 0.94,
      zIndex: 9970,
      x: 0
    });

    // Position close button near top-right of image
    if (spotlightCloseBtn) {
      gsap.set(spotlightCloseBtn, {
        position: 'fixed',
        left: Math.min(targetLeft + imgTargetSize - 8, viewportW - 48),
        top: Math.max(12, targetTop - 14),
        zIndex: 9995,
        opacity: 0,
        scale: 0.8
      });
      gsap.to(spotlightCloseBtn, { opacity: 1, scale: 1, duration: 0.4, delay: 0.2 });
    }

    // Dim source image in original card
    gsap.to(sourceImg, { opacity: 0.15, duration: 0.3 });

    // Subdue all other member cards
    const allCards = getMemberCards();
    allCards.forEach((c) => {
      if (c !== card) {
        gsap.to(c, { opacity: 0.25, filter: 'blur(4px)', scale: 0.98, duration: 0.4 });
      } else {
        gsap.to(c, { opacity: 0.9, filter: 'none', scale: 1, duration: 0.4 });
      }
    });

    // Animate Backdrop Blur & Tint
    gsap.to(backdrop, {
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out'
    });

    // Animate Floating Image FLIP (Lift out & travel smoothly to center)
    gsap.to(spotlightImg, {
      left: targetLeft,
      top: targetTop,
      width: imgTargetSize,
      height: imgTargetSize,
      borderRadius: '24px',
      boxShadow: '0 25px 60px -12px rgba(99, 102, 241, 0.45), 0 0 35px rgba(236, 72, 153, 0.25)',
      duration: 0.6,
      ease: 'power3.out',
      onComplete: () => {
        isAnimating = false;
        isFocused = true;
        parallaxActive = true;
      }
    });

    // Animate Info Box Entrance
    gsap.to(spotlightInfo, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.5,
      delay: 0.12,
      ease: 'power3.out'
    });
  }

  // Close Spotlight View & Return Image smoothly to Original Card
  function closeSpotlight() {
    if (!isFocused && !isAnimating) return;
    isAnimating = true;
    parallaxActive = false;
    isFocused = false;

    if (activeCard) {
      activeCard.setAttribute('aria-expanded', 'false');
    }

    const sourceImg = activeCard ? activeCard.querySelector('img') : null;

    // Reset subtle parallax offset smoothly
    gsap.to([spotlightImg, spotlightInfo], { x: 0, y: 0, duration: 0.3, ease: 'power2.out' });

    // Fade out info container & close button
    gsap.to(spotlightInfo, { opacity: 0, y: 20, scale: 0.95, duration: 0.3, ease: 'power2.in' });
    if (spotlightCloseBtn) {
      gsap.to(spotlightCloseBtn, { opacity: 0, scale: 0.8, duration: 0.2 });
    }

    // Fade out backdrop
    gsap.to(backdrop, { opacity: 0, duration: 0.4, ease: 'power2.in' });

    // Restore all member cards to original state
    const allCards = getMemberCards();
    allCards.forEach((c) => {
      gsap.to(c, { opacity: 1, filter: 'none', scale: 1, duration: 0.4 });
    });

    if (sourceImg) {
      gsap.to(sourceImg, { opacity: 1, duration: 0.4 });
      sourceRect = sourceImg.getBoundingClientRect();
    }

    // Animate Floating Image back to original position
    if (sourceRect) {
      gsap.to(spotlightImg, {
        left: sourceRect.left,
        top: sourceRect.top,
        width: sourceRect.width,
        height: sourceRect.height,
        borderRadius: '16px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
        duration: 0.5,
        ease: 'power3.inOut',
        onComplete: finishClose
      });
    } else {
      finishClose();
    }

    function finishClose() {
      gsap.set(overlay, { opacity: 0, pointerEvents: 'none', display: 'none' });
      document.body.style.overflow = savedScrollOverflow || '';
      activeCard = null;
      isAnimating = false;
    }
  }

  // Subtle Mouse Parallax Effect ONLY when focused (desktop only)
  window.addEventListener('mousemove', (e) => {
    if (!isFocused || !parallaxActive) return;

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const deltaX = (e.clientX - centerX) / centerX;
    const deltaY = (e.clientY - centerY) / centerY;

    gsap.to(spotlightImg, {
      x: deltaX * 10,
      y: deltaY * 10,
      duration: 0.4,
      ease: 'power2.out'
    });

    gsap.to(spotlightInfo, {
      x: deltaX * 6,
      y: deltaY * 6,
      duration: 0.4,
      ease: 'power2.out'
    });
  });

  // Close button trigger
  if (spotlightCloseBtn) {
    spotlightCloseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeSpotlight();
    });
  }

  // Backdrop / Overlay click trigger
  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      e.stopPropagation();
      closeSpotlight();
    });
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeSpotlight();
    }
  });

  // Keyboard ESC key trigger
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isFocused) {
      closeSpotlight();
    }
  });

  // Initialize binding
  bindCardEvents();

  // Re-bind on window resize
  window.addEventListener('resize', () => {
    if (isFocused) {
      closeSpotlight();
    }
  });

  // Observe filter button clicks to re-bind events after filter animation completes
  const filterBtns = document.querySelectorAll('.member-filter-btn');
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (isFocused) closeSpotlight();
      setTimeout(() => {
        bindCardEvents();
      }, 350);
    });
  });
});
