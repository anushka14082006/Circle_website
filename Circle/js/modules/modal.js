/* Circle Pune - Interactive Modal & RSVP Controller with Canvas Confetti */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Join Circle Modal Elements
  const joinModal = document.getElementById('join-modal');
  const openJoinBtns = document.querySelectorAll('.open-join-modal');
  const closeJoinBtn = document.getElementById('close-join-modal');
  const joinForm = document.getElementById('join-circle-form');

  // 2. RSVP Event Modal Elements
  const rsvpModal = document.getElementById('rsvp-modal');
  const openRsvpBtns = document.querySelectorAll('.open-rsvp-modal');
  const closeRsvpBtn = document.getElementById('close-rsvp-modal');
  const rsvpForm = document.getElementById('rsvp-form');
  const rsvpEventTitle = document.getElementById('rsvp-event-title');

  // Join Modal Step Controller
  let currentStep = 1;
  const totalSteps = 3;

  function updateFormSteps() {
    for (let i = 1; i <= totalSteps; i++) {
      const stepEl = document.getElementById(`join-step-${i}`);
      const dotEl = document.getElementById(`step-dot-${i}`);

      if (stepEl) {
        if (i === currentStep) {
          stepEl.classList.remove('hidden');
          gsap.fromTo(stepEl, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.3 });
        } else {
          stepEl.classList.add('hidden');
        }
      }

      if (dotEl) {
        if (i <= currentStep) {
          dotEl.classList.add('bg-purple-500', 'text-white');
          dotEl.classList.remove('bg-white/10', 'text-gray-400');
        } else {
          dotEl.classList.remove('bg-purple-500', 'text-white');
          dotEl.classList.add('bg-white/10', 'text-gray-400');
        }
      }
    }

    const prevBtn = document.getElementById('join-prev-btn');
    const nextBtn = document.getElementById('join-next-btn');
    const submitBtn = document.getElementById('join-submit-btn');

    if (prevBtn) prevBtn.style.display = currentStep > 1 ? 'block' : 'none';
    if (nextBtn) nextBtn.style.display = currentStep < totalSteps ? 'block' : 'none';
    if (submitBtn) submitBtn.style.display = currentStep === totalSteps ? 'block' : 'none';
  }

  // Open Join Modal
  openJoinBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (!joinModal) return;
      currentStep = 1;
      updateFormSteps();
      joinModal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      gsap.fromTo('.modal-content', { opacity: 0, scale: 0.9, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.2)' });
    });
  });

  // Close Join Modal
  if (closeJoinBtn) {
    closeJoinBtn.addEventListener('click', () => {
      if (!joinModal) return;
      gsap.to('.modal-content', {
        opacity: 0,
        scale: 0.95,
        duration: 0.2,
        onComplete: () => {
          joinModal.classList.add('hidden');
          document.body.style.overflow = 'auto';
        }
      });
    });
  }

  // Next / Prev Step buttons
  const nextBtn = document.getElementById('join-next-btn');
  const prevBtn = document.getElementById('join-prev-btn');

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentStep < totalSteps) {
        currentStep++;
        updateFormSteps();
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentStep > 1) {
        currentStep--;
        updateFormSteps();
      }
    });
  }

  // Submit Join Application with Confetti
  if (joinForm) {
    joinForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const successBox = document.getElementById('join-success-message');
      const formBox = document.getElementById('join-form-body');

      if (formBox && successBox) {
        gsap.to(formBox, {
          opacity: 0,
          y: -10,
          duration: 0.3,
          onComplete: () => {
            formBox.classList.add('hidden');
            successBox.classList.remove('hidden');
            gsap.fromTo(successBox, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.4 });

            // Launch Canvas Confetti!
            if (typeof confetti === 'function') {
              confetti({
                particleCount: 120,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#8B5CF6', '#EC4899', '#3B82F6', '#10B981']
              });
            }
          }
        });
      }
    });
  }

  // Open Event RSVP Modal
  openRsvpBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const eventName = btn.getAttribute('data-event') || 'Pune Circle Tech Meetup';
      if (rsvpEventTitle) rsvpEventTitle.textContent = eventName;
      if (!rsvpModal) return;

      rsvpModal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      gsap.fromTo('.rsvp-content', { opacity: 0, scale: 0.9, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.2)' });
    });
  });

  // Close RSVP Modal
  if (closeRsvpBtn) {
    closeRsvpBtn.addEventListener('click', () => {
      if (!rsvpModal) return;
      gsap.to('.rsvp-content', {
        opacity: 0,
        scale: 0.95,
        duration: 0.2,
        onComplete: () => {
          rsvpModal.classList.add('hidden');
          document.body.style.overflow = 'auto';
        }
      });
    });
  }

  // RSVP Form Submit
  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const rsvpSuccess = document.getElementById('rsvp-success-message');
      const rsvpBody = document.getElementById('rsvp-form-body');

      if (rsvpBody && rsvpSuccess) {
        gsap.to(rsvpBody, {
          opacity: 0,
          duration: 0.2,
          onComplete: () => {
            rsvpBody.classList.add('hidden');
            rsvpSuccess.classList.remove('hidden');
            gsap.fromTo(rsvpSuccess, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.3 });

            if (typeof confetti === 'function') {
              confetti({
                particleCount: 80,
                spread: 60,
                origin: { y: 0.5 },
                colors: ['#8B5CF6', '#EC4899']
              });
            }
          }
        });
      }
    });
  }
});
