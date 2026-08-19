/* Circle Pune - Interactive Pune Tech Map Controller */
document.addEventListener('DOMContentLoaded', () => {
  const puneHubData = {
    baner: {
      name: "Baner High Street Hub",
      tagline: "The SaaS & Product Heart of Pune",
      members: "1,240+",
      topMeetups: "Weekly SaaS Founders Breakfast & Tech Demos",
      vibe: "High Energy, Upscale Cafes, SaaS Founders",
      popularVenues: "Balewadi High Street, Tosca, Sublime Lounge",
      accent: "from-purple-500 to-indigo-600"
    },
    hinjewadi: {
      name: "Hinjewadi Tech Quad",
      tagline: "Global Enterprise & Engineering Giants",
      members: "1,480+",
      topMeetups: "Late Night 24h Hackathons & AI Engineering Labs",
      vibe: "Hardcore Developers, Full-Stack Engineers, AI Devs",
      popularVenues: "Phase 1 Quad, Grand Tamanna Tech Arena",
      accent: "from-blue-500 to-cyan-500"
    },
    koregaonpark: {
      name: "Koregaon Park Creative Lounge",
      tagline: "Designers, Creators & Web3 Pioneers",
      members: "890+",
      topMeetups: "Design & Beer Nights, Web3 Mixer, Creator Jam",
      vibe: "Rooftop Lounges, Aesthetics, Product Designers",
      popularVenues: "Lane 6 Rooftops, Effingut, High Spirits",
      accent: "from-pink-500 to-purple-600"
    },
    kharadi: {
      name: "Kharadi EON Tech Corridor",
      tagline: "Enterprise Cloud & AI Innovation Labs",
      members: "620+",
      topMeetups: "Cloud Architecture Summit & FinTech Roundtables",
      vibe: "Enterprise Tech, System Architects, FinTech",
      popularVenues: "EON IT Park Cluster, World Trade Center Pune",
      accent: "from-emerald-400 to-teal-600"
    },
    vimannagar: {
      name: "Viman Nagar Startup Incubator",
      tagline: "Seed Stage Founders & Venture Capitalists",
      members: "570+",
      topMeetups: "Pitch-to-VC Pitch Nights & Angel Coffee Hours",
      vibe: "Early-Stage Founders, Incubators, Angel Investors",
      popularVenues: "Phoenix East Wing Hub, WeWork Viman Nagar",
      accent: "from-amber-400 to-orange-500"
    },
    wakad: {
      name: "Wakad Builder Arena",
      tagline: "Student Founders & Open Source Vanguard",
      members: "420+",
      topMeetups: "Open Source Code Sprints & Web Dev Bootcamps",
      vibe: "Gen-Z Engineers, Student Pioneers, Hackers",
      popularVenues: "Datta Mandir Road Hubs, Tech Coworking Space",
      accent: "from-fuchsia-500 to-pink-500"
    }
  };

  const markers = document.querySelectorAll('.map-marker-node');
  const hubNameEl = document.getElementById('map-hub-name');
  const hubTaglineEl = document.getElementById('map-hub-tagline');
  const hubMembersEl = document.getElementById('map-hub-members');
  const hubMeetupsEl = document.getElementById('map-hub-meetups');
  const hubVibeEl = document.getElementById('map-hub-vibe');
  const hubVenuesEl = document.getElementById('map-hub-venues');
  const hubCardEl = document.getElementById('map-info-card');

  if (!markers.length || !hubCardEl) return;

  function setActiveHub(hubKey) {
    const data = puneHubData[hubKey];
    if (!data) return;

    // Update active marker UI state
    markers.forEach((m) => {
      if (m.getAttribute('data-hub') === hubKey) {
        m.classList.add('scale-125', 'ring-4', 'ring-purple-500/50');
      } else {
        m.classList.remove('scale-125', 'ring-4', 'ring-purple-500/50');
      }
    });

    // Animate Card Details Update
    gsap.to(hubCardEl, {
      opacity: 0,
      y: 10,
      duration: 0.2,
      onComplete: () => {
        if (hubNameEl) hubNameEl.textContent = data.name;
        if (hubTaglineEl) hubTaglineEl.textContent = data.tagline;
        if (hubMembersEl) hubMembersEl.textContent = data.members;
        if (hubMeetupsEl) hubMeetupsEl.textContent = data.topMeetups;
        if (hubVibeEl) hubVibeEl.textContent = data.vibe;
        if (hubVenuesEl) hubVenuesEl.textContent = data.popularVenues;

        gsap.to(hubCardEl, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });
      }
    });
  }

  // Event Listeners on Map Markers
  markers.forEach((marker) => {
    marker.addEventListener('click', () => {
      const hubKey = marker.getAttribute('data-hub');
      setActiveHub(hubKey);
    });

    marker.addEventListener('mouseenter', () => {
      const hubKey = marker.getAttribute('data-hub');
      setActiveHub(hubKey);
    });
  });
});
