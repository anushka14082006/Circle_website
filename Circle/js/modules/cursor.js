/* Circle Pune - Magnetic Custom Cursor */
document.addEventListener('DOMContentLoaded', () => {
  const dot = document.querySelector('.cursor-dot');
  const follower = document.querySelector('.cursor-follower');

  if (!dot || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Instant dot movement
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });

  // Smooth lerp follower loop
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;

    follower.style.left = `${followerX}px`;
    follower.style.top = `${followerY}px`;

    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover states on interactive elements
  const hoverTargets = document.querySelectorAll('a, button, input, select, textarea, .interactive-hover, [data-tilt]');

  hoverTargets.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover');
    });
  });

  // Magnetic Button Effect
  const magneticBtns = document.querySelectorAll('.magnetic-btn');

  magneticBtns.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const btnX = e.clientX - rect.left - rect.width / 2;
      const btnY = e.clientY - rect.top - rect.height / 2;

      gsap.to(btn, {
        x: btnX * 0.35,
        y: btnY * 0.35,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.4)'
      });
    });
  });
});
