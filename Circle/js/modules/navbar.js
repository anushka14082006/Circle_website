/* Circle Pune - Active Navbar Animation & Scroll Tracker */
document.addEventListener('DOMContentLoaded', () => {
  const navContainer = document.getElementById('nav-links-container');
  const navLinks = document.querySelectorAll('.nav-link');
  const activePill = document.getElementById('nav-active-pill');

  if (!navContainer || !navLinks.length || !activePill) return;

  let currentActiveLink = navLinks[0];

  // Function to calculate & animate indicator pill position under target link
  function updatePillPosition(targetLink) {
    if (!targetLink) return;
    const containerRect = navContainer.getBoundingClientRect();
    const linkRect = targetLink.getBoundingClientRect();

    const left = linkRect.left - containerRect.left;
    const width = linkRect.width;

    activePill.style.left = `${left}px`;
    activePill.style.width = `${width}px`;
    activePill.style.opacity = '1';
  }

  // Function to set active nav link
  function setActiveLink(link) {
    if (!link) return;
    navLinks.forEach((l) => {
      l.classList.remove('nav-link-active');
    });
    link.classList.add('nav-link-active');
    currentActiveLink = link;
    updatePillPosition(link);
  }

  // Hover animations: slide indicator smoothly to hovered item, return to active link on mouseleave
  navLinks.forEach((link) => {
    link.addEventListener('mouseenter', () => {
      updatePillPosition(link);
    });

    link.addEventListener('mouseleave', () => {
      updatePillPosition(currentActiveLink);
    });

    link.addEventListener('click', () => {
      setActiveLink(link);
    });
  });

  // Observe section scroll positions to dynamically update active navbar tab
  const sections = [];
  navLinks.forEach((link) => {
    const hash = link.getAttribute('href');
    if (hash && hash.startsWith('#')) {
      const targetSec = document.querySelector(hash);
      if (targetSec) {
        sections.push({ id: hash, element: targetSec, link: link });
      }
    }
  });

  if (sections.length) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -55% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const found = sections.find((s) => s.element === entry.target);
          if (found) {
            setActiveLink(found.link);
          }
        }
      });
    }, observerOptions);

    sections.forEach((sec) => sectionObserver.observe(sec.element));
  }

  // Check URL hash or initial position on page load
  function initNavState() {
    const currentHash = window.location.hash;
    let initialLink = null;

    if (currentHash) {
      initialLink = Array.from(navLinks).find((l) => l.getAttribute('href') === currentHash);
    }
    if (!initialLink && navLinks.length) {
      initialLink = navLinks[0];
    }
    if (initialLink) {
      setActiveLink(initialLink);
    }
  }

  // Delay calculation slightly so fonts and layout bounds are ready
  setTimeout(initNavState, 150);

  window.addEventListener('resize', () => {
    if (currentActiveLink) updatePillPosition(currentActiveLink);
  });
  window.addEventListener('hashchange', initNavState);
});
