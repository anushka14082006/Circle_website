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

  // 2. Events Section Entrance Animations (Heading Right-to-Left + Image Train Left-to-Right)
  const eventsSection = document.getElementById('events');
  const eventsHeadingBlock = document.getElementById('events-heading-block');
  const eventsDescription = document.getElementById('events-description');
  const eventCards = document.querySelectorAll('.event-card');

  if (eventsSection && eventsHeadingBlock && eventsDescription && eventCards.length > 0) {
    const eventsTl = gsap.timeline({
      paused: true,
      scrollTrigger: {
        trigger: eventsSection,
        start: 'top 80%',
        end: 'bottom 10%',
        onEnter: () => eventsTl.restart(),
        onEnterBack: () => eventsTl.restart(),
        onLeave: () => eventsTl.pause(0),
        onLeaveBack: () => eventsTl.pause(0)
      }
    });

    // Step A: Heading + Description slide in from RIGHT -> LEFT (original position)
    eventsTl.from([eventsHeadingBlock, eventsDescription], {
      x: 80,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'cubic-bezier(0.22, 1, 0.36, 1)'
    });

    // Step B: Event Cards enter sequentially like a train from LEFT -> RIGHT (original position)
    eventsTl.from(eventCards, {
      x: -120,
      opacity: 0,
      duration: 0.75,
      stagger: 0.15, // Train delay: Card 1 (0ms), Card 2 (+150ms), Card 3 (+300ms), Card 4 (+450ms)
      ease: 'cubic-bezier(0.22, 1, 0.36, 1)'
    }, '-=0.4');
  }

  // Events Experience - GSAP Horizontal Scroll Pin
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

  // 7. Member Testimonials - Living Testimonial Premium Animation System
  const testimonialsSection = document.getElementById('testimonials');
  const testLabel = document.getElementById('testimonials-label');
  const testHeading = document.getElementById('testimonials-heading');
  const testDesc = document.getElementById('testimonials-desc');
  const testCards = document.querySelectorAll('.testimonial-card');

  if (testimonialsSection && testLabel && testHeading && testDesc && testCards.length > 0) {
    const testTl = gsap.timeline({
      paused: true,
      scrollTrigger: {
        trigger: testimonialsSection,
        start: 'top 80%',
        end: 'bottom 10%',
        onEnter: () => testTl.restart(),
        onEnterBack: () => testTl.restart(),
        onLeave: () => testTl.pause(0),
        onLeaveBack: () => testTl.pause(0)
      }
    });

    // Step A: Signal Reveal (Label -> Heading -> Description)
    testTl.from([testLabel, testHeading, testDesc], {
      y: 30,
      opacity: 0,
      duration: 0.7,
      stagger: 0.14,
      ease: 'cubic-bezier(0.22, 1, 0.36, 1)'
    });

    // Step B: Signal Pulse (Testimonial Cards enter y: 35, opacity: 0, scale: 0.97 -> 1)
    testTl.from(testCards, {
      y: 35,
      opacity: 0,
      scale: 0.97,
      duration: 0.75,
      stagger: 0.15,
      ease: 'cubic-bezier(0.22, 1, 0.36, 1)'
    }, '-=0.3');

    // Step C: Star Rating Animation (Sequential ★ -> ★★ -> ★★★ -> ★★★★ -> ★★★★★)
    testCards.forEach((card, cardIdx) => {
      const stars = card.querySelectorAll('.star-icon');
      if (stars.length > 0) {
        testTl.from(stars, {
          scale: 0,
          opacity: 0,
          duration: 0.2,
          stagger: 0.04,
          ease: 'back.out(2)'
        }, `-=${0.55 - cardIdx * 0.1}`);
      }
    });
  }

  // Interactive Card Depth Shift, Light Sweep & Card Focus Subduing
  if (testCards.length > 0) {
    testCards.forEach((card) => {
      // 3D Depth Shift + Subtle Cursor Tilt
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform = `perspective(1000px) translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.015)`;
        card.style.boxShadow = '0 20px 40px -10px rgba(15, 23, 42, 0.12), 0 0 20px rgba(99, 102, 241, 0.08)';
      });

      // Light Sweep & Card Focus Subduing on Mouse Enter
      card.addEventListener('mouseenter', () => {
        card.classList.remove('sweep-active');
        void card.offsetWidth; // Force reflow to trigger clean sweep pass
        card.classList.add('sweep-active');

        testCards.forEach((otherCard) => {
          if (otherCard !== card) {
            otherCard.style.opacity = '0.55';
            otherCard.style.transform = 'scale(0.985)';
            otherCard.style.filter = 'brightness(0.97)';
          } else {
            otherCard.style.opacity = '1';
          }
        });
      });

      // Reset Card on Mouse Leave
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) translateY(0px) rotateX(0deg) rotateY(0deg) scale(1)';
        card.style.boxShadow = '';
        card.classList.remove('sweep-active');

        testCards.forEach((otherCard) => {
          otherCard.style.opacity = '1';
          otherCard.style.transform = 'scale(1)';
          otherCard.style.filter = 'none';
        });
      });
    });
  }

  // 8. Community Categories - Heading Power-Up & Cards Gather -> Distribute System
  const categoriesSection = document.getElementById('categories');
  const catLabel = document.getElementById('categories-label');
  const catHeading = document.getElementById('categories-heading');
  const catDesc = document.getElementById('categories-desc');
  const categoryCards = document.querySelectorAll('.category-card');
  const nodeLine = document.getElementById('node-connection-line');

  if (categoriesSection && catHeading && categoryCards.length > 0) {
    const catTl = gsap.timeline({
      paused: true,
      scrollTrigger: {
        trigger: categoriesSection,
        start: 'top 80%',
        end: 'bottom 10%',
        onEnter: () => catTl.restart(),
        onEnterBack: () => catTl.restart(),
        onLeave: () => catTl.pause(0),
        onLeaveBack: () => catTl.pause(0)
      }
    });

    // Step A: Label & Description initial reveal
    catTl.from([catLabel, catDesc], {
      y: 20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power2.out'
    });

    // Step B: HEADING POWER-UP (Normal -> BIG 1.15x + Glowy -> Hold)
    catTl.to(catHeading, {
      scale: 1.15,
      filter: 'drop-shadow(0 0 25px rgba(236, 72, 153, 0.65)) drop-shadow(0 0 45px rgba(99, 102, 241, 0.45))',
      duration: 0.45,
      ease: 'power2.out'
    }, '-=0.3');

    // Hold enlarged glowing state briefly (150ms)
    catTl.to(catHeading, {
      scale: 1.15,
      duration: 0.15
    });

    // Step C: CARDS GATHER -> DISTRIBUTE (Center -> Spread outward -> Original positions)
    categoryCards.forEach((card, idx) => {
      const gatherX = parseInt(card.getAttribute('data-gather-x') || '0', 10);
      const gatherY = parseInt(card.getAttribute('data-gather-y') || '0', 10);

      catTl.fromTo(card,
        {
          x: gatherX,
          y: gatherY,
          scale: 0.94,
          opacity: 0.55
        },
        {
          x: 0,
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: 'cubic-bezier(0.22, 1, 0.36, 1)'
        },
        idx === 0 ? '-=0.15' : '-=0.68'
      );
    });

    // Step D: Heading returns smoothly to exact original size & normal glow state
    catTl.to(catHeading, {
      scale: 1,
      filter: 'drop-shadow(0 0 0px rgba(0, 0, 0, 0))',
      duration: 0.55,
      ease: 'power2.inOut'
    }, '-=0.7');

    // Step E: Member Count Number Counter Animation (0 -> target)
    categoryCards.forEach((card) => {
      const countEl = card.querySelector('.category-count');
      if (countEl) {
        const targetVal = parseInt(countEl.getAttribute('data-count') || '0', 10);
        const suffix = countEl.getAttribute('data-suffix') || '';

        catTl.to({ val: 0 }, {
          val: targetVal,
          duration: 0.8,
          ease: 'power2.out',
          onUpdate: function() {
            countEl.textContent = `${Math.floor(this.targets()[0].val).toLocaleString()}${suffix}`;
          }
        }, '-=0.6');
      }
    });

    // Step F: Connection Pulse Lines Draw Pass
    if (nodeLine) {
      catTl.fromTo(nodeLine, 
        { strokeDashoffset: 600, opacity: 0 },
        { strokeDashoffset: 0, opacity: 0.45, duration: 1.1, ease: 'power2.inOut' },
        '-=0.4'
      ).to(nodeLine, { opacity: 0, duration: 0.5, ease: 'power2.out' });
    }
  }

  // Active Node Card Hover Effects & Card Focus Subduing
  if (categoryCards.length > 0) {
    categoryCards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        card.classList.remove('sweep-active');
        void card.offsetWidth; // Force reflow for sweep pass
        card.classList.add('sweep-active');

        categoryCards.forEach((otherCard) => {
          if (otherCard !== card) {
            otherCard.style.opacity = '0.6';
            otherCard.style.transform = 'scale(0.985)';
            otherCard.style.filter = 'brightness(0.97)';
          } else {
            otherCard.style.opacity = '1';
            otherCard.style.transform = 'translateY(-8px) scale(1.015)';
            otherCard.style.boxShadow = '0 20px 40px -10px rgba(15, 23, 42, 0.12)';
          }
        });
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0px) scale(1)';
        card.style.boxShadow = '';
        card.classList.remove('sweep-active');

        categoryCards.forEach((otherCard) => {
          otherCard.style.opacity = '1';
          otherCard.style.transform = 'translateY(0px) scale(1)';
          otherCard.style.filter = 'none';
        });
      });
    });
  }

  // Image Train Mobile & Tablet Touch Pause Handlers
  const trainContainers = document.querySelectorAll('.image-train-container');
  trainContainers.forEach((container) => {
    const track = container.querySelector('.image-train-track');
    if (!track) return;

    container.addEventListener('touchstart', () => {
      track.classList.add('paused');
    }, { passive: true });

    container.addEventListener('touchend', () => {
      track.classList.remove('paused');
    }, { passive: true });

    container.addEventListener('touchcancel', () => {
      track.classList.remove('paused');
    }, { passive: true });
  });
});


