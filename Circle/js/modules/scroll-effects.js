/* Circle Pune - Scroll Effects, Lenis Integration & GSAP ScrollTrigger */
document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  // Initialize Lenis Smooth Scroll
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
    infinite: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Synchronize Lenis with GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  window.lenisInstance = lenis;

  // 1. Storytelling Section Pinned Narrative
  const storySection = document.getElementById('storytelling');
  if (storySection) {
    ScrollTrigger.create({
      trigger: storySection,
      start: 'top top',
      end: 'bottom bottom',
      pin: '#story-left-panel',
      pinSpacing: false
    });

    const storyCards = document.querySelectorAll('.story-card');
    storyCards.forEach((card, index) => {
      ScrollTrigger.create({
        trigger: card,
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter: () => updateStoryStep(index),
        onEnterBack: () => updateStoryStep(index)
      });
    });
  }

  function updateStoryStep(stepIndex) {
    const stepIndicators = document.querySelectorAll('.story-indicator-item');
    const stepHeadings = [
      'The Tech Boom of Hinjewadi & Baner',
      'Rooftop Meetups in Koregaon Park',
      'Viman Nagar VC & Startup Incubators',
      'The Ambitious Future of Circle Pune'
    ];
    const stepDescriptions = [
      'Engineers and founders uniting from Hinjewadi Phase 1 to Baner High Street to build global SaaS apps.',
      'Creative designers, marketers, and web3 pioneers meeting weekly over chill evening rooftop mixers.',
      'Venture builders and angel investors gathering to fund the next generation of Pune unicorns.',
      'A thriving ecosystem of 4,500+ builders, creators, and leaders defining the culture of Pune.'
    ];

    stepIndicators.forEach((ind, idx) => {
      if (idx === stepIndex) {
        ind.classList.add('border-indigo-600', 'bg-indigo-50', 'text-indigo-600');
        ind.classList.remove('border-slate-200', 'text-slate-400');
      } else {
        ind.classList.remove('border-indigo-600', 'bg-indigo-50', 'text-indigo-600');
        ind.classList.add('border-slate-200', 'text-slate-400');
      }
    });

    const titleEl = document.getElementById('story-active-title');
    const descEl = document.getElementById('story-active-desc');
    if (titleEl && descEl) {
      gsap.to([titleEl, descEl], {
        opacity: 0,
        y: -10,
        duration: 0.2,
        onComplete: () => {
          titleEl.textContent = stepHeadings[stepIndex] || stepHeadings[0];
          descEl.textContent = stepDescriptions[stepIndex] || stepDescriptions[0];
          gsap.to([titleEl, descEl], { opacity: 1, y: 0, duration: 0.3 });
        }
      });
    }
  }

  // 2. Events Experience - GSAP Horizontal Scroll Pin
  const horizontalSection = document.querySelector('.horizontal-events-container');
  const horizontalTrack = document.querySelector('.horizontal-events-track');

  if (horizontalSection && horizontalTrack) {
    const totalScrollWidth = horizontalTrack.scrollWidth - window.innerWidth + 120;

    gsap.to(horizontalTrack, {
      x: -totalScrollWidth,
      ease: 'none',
      scrollTrigger: {
        trigger: horizontalSection,
        pin: true,
        scrub: 1,
        start: 'top top',
        end: () => `+=${totalScrollWidth}`,
        invalidateOnRefresh: true
      }
    });
  }

  // 3. Pune Community Impact Stats Counter
  const statNumbers = document.querySelectorAll('.count-number');
  statNumbers.forEach((stat) => {
    const targetVal = parseInt(stat.getAttribute('data-count') || '0', 10);
    const prefix = stat.getAttribute('data-prefix') || '';
    const suffix = stat.getAttribute('data-suffix') || '';

    ScrollTrigger.create({
      trigger: stat,
      start: 'top 85%',
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val: targetVal,
          duration: 2,
          ease: 'power2.out',
          onUpdate: function() {
            stat.textContent = `${prefix}${Math.floor(this.targets()[0].val).toLocaleString()}${suffix}`;
          }
        });
      },
      once: true
    });
  });

  // 4. Community Journey Timeline Progress Line
  const timelineProgress = document.getElementById('timeline-progress-bar');
  const timelineSection = document.getElementById('timeline-section');
  if (timelineProgress && timelineSection) {
    gsap.to(timelineProgress, {
      height: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: timelineSection,
        start: 'top 50%',
        end: 'bottom 80%',
        scrub: true
      }
    });
  }

  // 5. 3D Tilt Card Effect Handler
  const tiltCards = document.querySelectorAll('.tilt-card');
  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });

  // 6. GSAP ScrollTrigger Animated Footer Entrance
  const footerElem = document.getElementById('main-footer');
  if (footerElem) {
    gsap.from('.footer-block', {
      scrollTrigger: {
        trigger: footerElem,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 45,
      stagger: 0.12,
      duration: 0.8,
      ease: 'power3.out'
    });

    gsap.from('.social-icon-btn', {
      scrollTrigger: {
        trigger: footerElem,
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      scale: 0.5,
      stagger: 0.08,
      duration: 0.7,
      ease: 'back.out(2)',
      delay: 0.3
    });
  }
});
