/* Circle Pune - Main Application Initializer, Live Clock & Canvas Particle Engine */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Live Pune Time (IST) Clock
  function updatePuneClock() {
    const clockElements = document.querySelectorAll('.pune-live-clock');
    const now = new Date();
    const options = {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    const timeStr = now.toLocaleTimeString('en-US', options);

    clockElements.forEach((el) => {
      el.textContent = `📍 Pune, IN (${timeStr} IST)`;
    });
  }
  updatePuneClock();
  setInterval(updatePuneClock, 1000);

  // 2. Swiper Testimonials Initialization
  if (typeof Swiper !== 'undefined') {
    new Swiper('.testimonials-swiper', {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      autoplay: {
        delay: 4500,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next-custom',
        prevEl: '.swiper-button-prev-custom',
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
          spaceBetween: 24
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 32
        }
      }
    });
  }

  // 3. Member Gallery Category Filter
  const memberFilterBtns = document.querySelectorAll('.member-filter-btn');
  const memberCards = document.querySelectorAll('.member-card');

  memberFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-filter');

      memberFilterBtns.forEach((b) => {
        b.classList.remove('bg-purple-500', 'text-white', 'shadow-lg');
        b.classList.add('bg-white/5', 'text-gray-400');
      });
      btn.classList.add('bg-purple-500', 'text-white', 'shadow-lg');
      btn.classList.remove('bg-white/5', 'text-gray-400');

      memberCards.forEach((card) => {
        const cardCat = card.getAttribute('data-category');
        if (category === 'all' || cardCat === category) {
          gsap.to(card, { opacity: 1, scale: 1, duration: 0.4, display: 'block' });
        } else {
          gsap.to(card, { opacity: 0, scale: 0.9, duration: 0.3, display: 'none' });
        }
      });
    });
  });

  // 4. Web Audio API Ambient Sound Toggle
  let audioCtx = null;
  let oscillator = null;
  let gainNode = null;
  let isSoundOn = false;
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  const soundIcon = document.getElementById('sound-icon');
  const soundText = document.getElementById('sound-text');

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      if (!isSoundOn) {
        startAmbientSound();
        isSoundOn = true;
        if (soundIcon) soundIcon.className = 'fa-solid fa-volume-high text-purple-400';
        if (soundText) soundText.textContent = 'Sound ON';
      } else {
        stopAmbientSound();
        isSoundOn = false;
        if (soundIcon) soundIcon.className = 'fa-solid fa-volume-xmark text-gray-500';
        if (soundText) soundText.textContent = 'Sound OFF';
      }
    });
  }

  function startAmbientSound() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();

      oscillator = audioCtx.createOscillator();
      gainNode = audioCtx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(146.83, audioCtx.currentTime);

      gainNode.gain.setValueAtTime(0.001, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.04, audioCtx.currentTime + 2);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.start();
    } catch (e) {
      console.warn('AudioContext not supported', e);
    }
  }

  function stopAmbientSound() {
    if (gainNode && audioCtx) {
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1);
      setTimeout(() => {
        if (oscillator) oscillator.stop();
        if (audioCtx) audioCtx.close();
      }, 1000);
    }
  }

  // 5. Canvas Ambient Floating Bubble Engine
  const canvas = document.getElementById('hero-particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const numParticles = Math.min(width > 768 ? 55 : 25, 70);
    const bubbleColors = [
      'rgba(99, 102, 241, ',  // Indigo
      'rgba(236, 72, 153, ',  // Pink
      'rgba(255, 94, 98, ',   // Coral
      'rgba(245, 158, 11, ',  // Gold
      'rgba(6, 182, 212, '    // Cyan
    ];

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 3 + 1.5,
        alpha: Math.random() * 0.45 + 0.25,
        colorBase: bubbleColors[Math.floor(Math.random() * bubbleColors.length)]
      });
    }

    function renderParticles() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.colorBase}${p.alpha})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `${p.colorBase}${0.12 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(renderParticles);
    }
    renderParticles();
  }

  // 6. Footer Newsletter Form Handler & Confetti Trigger
  const footerNewsletterForm = document.getElementById('footer-newsletter-form');
  const footerStatusMsg = document.getElementById('footer-newsletter-status');

  if (footerNewsletterForm) {
    footerNewsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (footerStatusMsg) {
        footerStatusMsg.classList.remove('hidden');
      }

      if (typeof confetti === 'function') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.85 }
        });
      }

      footerNewsletterForm.reset();
      setTimeout(() => {
        if (footerStatusMsg) footerStatusMsg.classList.add('hidden');
      }, 5000);
    });
  }
});
