/* Circle Pune - Cinematic Preloader Sequence */
document.addEventListener('DOMContentLoaded', () => {
  const preloader = document.getElementById('preloader');
  const percentText = document.getElementById('preloader-percent');
  const loaderBar = document.getElementById('preloader-bar');

  if (!preloader || !percentText) return;

  // Prevent scroll during loading
  document.body.style.overflow = 'hidden';

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 12) + 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      finishLoading();
    }
    percentText.textContent = `${progress}%`;
    if (loaderBar) loaderBar.style.width = `${progress}%`;
  }, 70);

  function finishLoading() {
    const tl = gsap.timeline({
      onComplete: () => {
        preloader.style.display = 'none';
        document.body.style.overflow = 'auto';
        initHeroAnimations();
      }
    });

    tl.to('#preloader-content', {
      opacity: 0,
      y: -30,
      duration: 0.6,
      ease: 'power2.inOut'
    })
    .to('#preloader-curtain-left', {
      xPercent: -100,
      duration: 0.8,
      ease: 'power4.inOut'
    }, '-=0.2')
    .to('#preloader-curtain-right', {
      xPercent: 100,
      duration: 0.8,
      ease: 'power4.inOut'
    }, '<');
  }

  function initHeroAnimations() {
    const heroTl = gsap.timeline();

    heroTl.from('.hero-badge', {
      opacity: 0,
      y: -20,
      duration: 0.6,
      ease: 'power3.out'
    })
    .from('.hero-title-char', {
      opacity: 0,
      y: 60,
      rotateX: -45,
      stagger: 0.04,
      duration: 0.8,
      ease: 'back.out(1.7)'
    }, '-=0.3')
    .from('.hero-sub-text', {
      opacity: 0,
      y: 25,
      duration: 0.6,
      ease: 'power3.out'
    }, '-=0.4')
    .from('.hero-cta-group', {
      opacity: 0,
      y: 20,
      scale: 0.95,
      duration: 0.6,
      ease: 'power3.out'
    }, '-=0.3')
    .from('.hero-img-card', {
      opacity: 0,
      y: 40,
      scale: 0.85,
      stagger: 0.1,
      duration: 0.8,
      ease: 'back.out(1.5)'
    }, '-=0.3')
    .from('.hero-stats-bar', {
      opacity: 0,
      y: 30,
      duration: 0.6,
      ease: 'power3.out'
    }, '-=0.3');
  }
});
