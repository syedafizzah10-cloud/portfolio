/* 
   Fizzah Ehtisham - Portfolio JavaScript
   Interactive Features: Teleprompter, Strategy Modals, Journey Filter, Scroll Effects
*/

document.addEventListener('DOMContentLoaded', () => {
  
  // =========================================================================
  // 1. SCROLL EVENTS & NAVBAR STYLING
  // =========================================================================
  const navbar = document.getElementById('navbar');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // =========================================================================
  // 2. MOBILE NAVIGATION MENU
  // =========================================================================
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link, .nav-cta');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      mobileToggle.classList.toggle('active');
      
      const spans = mobileToggle.querySelectorAll('span');
      if (mobileToggle.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(4px, -4px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
        const spans = mobileToggle.querySelectorAll('span');
        spans.forEach(span => span.style.transform = 'none');
        spans[1].style.opacity = '1';
      });
    });
  }

  // =========================================================================
  // 3. ENTRANCE ANIMATIONS (Intersection Observer)
  // =========================================================================
  const animateItems = document.querySelectorAll('.animate-on-scroll');
  
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('appear');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animateItems.forEach(item => observer.observe(item));
  } else {
    animateItems.forEach(item => item.classList.add('appear'));
  }

  // =========================================================================
  // 4. INTERACTIVE SCRIPT READER / TELEPROMPTER
  // =========================================================================
  const teleprompterCard = document.getElementById('teleprompter-widget');
  const btnTeleOff = document.getElementById('btn-tele-off');
  const btnTeleOn = document.getElementById('btn-tele-on');
  const teleScreen = document.getElementById('tele-screen');
  const scriptFlow = document.getElementById('script-flow');
  const btnPlayPause = document.getElementById('btn-play-pause');
  const playIcon = document.getElementById('play-icon');
  const pauseIcon = document.getElementById('pause-icon');
  const teleSpeedInput = document.getElementById('tele-speed');
  const speedVal = document.getElementById('speed-val');
  const btnResetTele = document.getElementById('btn-reset-tele');
  const teleStatus = document.getElementById('tele-status');
  const blinkDot = document.getElementById('blink-dot');
  
  let isTeleprompterMode = false;
  let isPlaying = false;
  let scrollSpeed = 5;
  let scrollInterval = null;
  let currentChunkIndex = 0;
  const chunks = document.querySelectorAll('.script-chunk');

  if (btnTeleOn && btnTeleOff && teleprompterCard) {
    btnTeleOn.addEventListener('click', () => {
      isTeleprompterMode = true;
      btnTeleOn.classList.add('active');
      btnTeleOff.classList.remove('active');
      teleprompterCard.classList.add('teleprompter-active');
      teleStatus.textContent = 'Ready to Play';
      resetTeleprompter();
    });

    btnTeleOff.addEventListener('click', () => {
      isTeleprompterMode = false;
      btnTeleOff.classList.add('active');
      btnTeleOn.classList.remove('active');
      teleprompterCard.classList.remove('teleprompter-active');
      teleStatus.textContent = 'Teleprompter Off';
      resetTeleprompter();
    });
  }

  if (btnPlayPause) {
    btnPlayPause.addEventListener('click', () => {
      if (isPlaying) {
        pauseTeleprompter();
      } else {
        playTeleprompter();
      }
    });
  }

  if (teleSpeedInput && speedVal) {
    teleSpeedInput.addEventListener('input', (e) => {
      scrollSpeed = parseInt(e.target.value);
      speedVal.textContent = `${scrollSpeed}x`;
      if (isPlaying) {
        pauseTeleprompter();
        playTeleprompter();
      }
    });
  }

  if (btnResetTele) {
    btnResetTele.addEventListener('click', resetTeleprompter);
  }

  function playTeleprompter() {
    if (!isTeleprompterMode) {
      btnTeleOn.click();
    }
    
    isPlaying = true;
    playIcon.style.display = 'none';
    pauseIcon.style.display = 'block';
    teleStatus.textContent = 'Scrolling...';
    blinkDot.style.backgroundColor = '#10B981';
    blinkDot.style.animation = 'pulse 1s infinite';

    const intervalMs = Math.max(12, 100 - (scrollSpeed * 9));

    scrollInterval = setInterval(() => {
      teleScreen.scrollTop += 1;
      updateActiveChunkHighlight();

      if (teleScreen.scrollTop + teleScreen.clientHeight >= teleScreen.scrollHeight - 10) {
        pauseTeleprompter();
        teleStatus.textContent = 'Finished';
      }
    }, intervalMs);
  }

  function pauseTeleprompter() {
    isPlaying = false;
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
    if (isTeleprompterMode) {
      teleStatus.textContent = 'Paused';
    }
    blinkDot.style.backgroundColor = '#D4AF37';
    blinkDot.style.animation = 'none';
    clearInterval(scrollInterval);
  }

  function resetTeleprompter() {
    pauseTeleprompter();
    teleScreen.scrollTop = 0;
    currentChunkIndex = 0;
    
    chunks.forEach((chunk, index) => {
      if (index === 0) {
        chunk.classList.add('current-chunk');
      } else {
        chunk.classList.remove('current-chunk');
      }
    });

    if (isTeleprompterMode) {
      teleStatus.textContent = 'Ready to Play';
    } else {
      teleStatus.textContent = 'Teleprompter Off';
    }
  }

  function updateActiveChunkHighlight() {
    const screenCenter = teleScreen.scrollTop + (teleScreen.clientHeight / 2);
    
    let activeIndex = 0;
    chunks.forEach((chunk, index) => {
      const chunkTop = chunk.offsetTop;
      const chunkHeight = chunk.clientHeight;
      
      if (screenCenter >= chunkTop && screenCenter <= (chunkTop + chunkHeight + 40)) {
        activeIndex = index;
      }
    });

    if (activeIndex !== currentChunkIndex) {
      chunks[currentChunkIndex].classList.remove('current-chunk');
      chunks[activeIndex].classList.add('current-chunk');
      currentChunkIndex = activeIndex;
    }
  }

  // =========================================================================
  // 5. SOCIAL CONTENT IDEAS TAB FILTERING
  // =========================================================================
  const tabButtons = document.querySelectorAll('.idea-tab-btn');
  const ideaCards = document.querySelectorAll('.idea-card');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const category = button.getAttribute('data-category');
      
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      ideaCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (cardCategory === category) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // =========================================================================
  // 6. DYNAMIC STRATEGY BLUEPRINT DRAWER (MODAL)
  // =========================================================================
  const strategyOverlay = document.getElementById('strategy-drawer');
  const btnCloseStrategy = document.getElementById('btn-close-strategy');
  const modalLabel = document.getElementById('modal-label');
  const modalTitle = document.getElementById('modal-title');
  const modalBodyContent = document.getElementById('modal-body-content');

  const strategyDatabase = {
    'mistakes': {
      label: 'Real Estate Strategy',
      title: '5 Biggest Mistakes First-Time Home Buyers Make',
      blueprint: [
        {
          title: 'Target Audience Profile',
          content: 'Millennials and Gen Z home buyers in the US who are actively searching but overwhelmed by options and complex finances.'
        },
        {
          title: 'Pacing & Hooks (The Blueprint)',
          content: '<b>The Hook (0-3s)</b>: "The biggest homebuying mistake isn\'t buying the wrong house. It\'s talking to the wrong bank first." <br><b>Body (3-45s)</b>: Break down 5 mistakes rapidly with on-screen text checklist. Mistake 5 (hidden fees) is teased early and shown at the very end to sustain retention.'
        },
        {
          title: 'Direct Response Call to Action',
          content: 'Low-friction text: "Comment CHECKLIST below, and I\'ll send you our simple Homebuyer Prep Checklist directly to your inbox."'
        }
      ]
    },
    'rent-vs-buy': {
      label: 'Real Estate Strategy',
      title: 'Renting vs Buying in 2026',
      blueprint: [
        {
          title: 'Target Audience Profile',
          content: 'Middle-income earners renting in metropolitan suburbs, feeling locked out by high prices and fluctuating mortgage rates.'
        },
        {
          title: 'Pacing & Hooks (The Blueprint)',
          content: '<b>The Hook (0-3s)</b>: "If you\'re still renting because you\'re waiting for interest rates to drop... you might be losing money."<br><b>Body (3-45s)</b>: Visual split screen. Show rent receipts compounding into $0 equity vs principal amortization building real assets over 5 years.'
        },
        {
          title: 'Direct Response Call to Action',
          content: '"Click the link in my bio to calculate your local renting break-even point with our free interactive sheets."'
        }
      ]
    },
    'buy-power': {
      label: 'Real Estate Strategy',
      title: 'What $500,000 Buys Across Different States',
      blueprint: [
        {
          title: 'Target Audience Profile',
          content: 'Remote workers, families looking to relocate, and out-of-state property investors seeking maximum square footage for their budget.'
        },
        {
          title: 'Pacing & Hooks (The Blueprint)',
          content: '<b>The Hook (0-3s)</b>: "Here is what half a million dollars actually gets you in Texas vs California vs Florida."<br><b>Body (3-45s)</b>: 15 seconds per property listing. High-speed tours focusing on unique features (pool in Florida, acreage in Texas, smart condo in CA).'
        },
        {
          title: 'Direct Response Call to Action',
          content: '"Which state would you live in? Drop a comment and tell me why."'
        }
      ]
    },
    'did-you-know': {
      label: 'Short Form Content',
      title: '"Did You Know?" Surprising Real Estate Facts',
      blueprint: [
        {
          title: 'Target Audience Profile',
          content: 'Broad, curiosity-driven social media users. High top-of-funnel reach to build organic brand familiarity.'
        },
        {
          title: 'Pacing & Hooks (The Blueprint)',
          content: '<b>The Hook (0-3s)</b>: "Did you know that painting your front door this specific color can add $6,000 to your home\'s value?"<br><b>Body (3-45s)</b>: Share the statistics behind Zillow door-color research. Walk through paint costs ($100) vs return on investment.'
        },
        {
          title: 'Direct Response Call to Action',
          content: '"What color is your front door? Tell me below!"'
        }
      ]
    },
    'myth-vs-reality': {
      label: 'Short Form Content',
      title: 'Investment Myths vs Reality',
      blueprint: [
        {
          title: 'Target Audience Profile',
          content: 'Expats in the US, Canada, and UK interested in safe, passive wealth generation through international investments.'
        },
        {
          title: 'Pacing & Hooks (The Blueprint)',
          content: '<b>The Hook (0-3s)</b>: "Myth: Investing in Pakistan from abroad is too risky. Reality: The safest deals never hit the public market."<br><b>Body (3-45s)</b>: De-risk the process. Show how online registries, biometric verifications, and escrow protects expat buyers.'
        },
        {
          title: 'Direct Response Call to Action',
          content: '"Send a DM with the word VERIFY, and I\'ll send you our legal checklist for overseas land purchases."'
        }
      ]
    },
    'tour-60s': {
      label: 'Short Form Content',
      title: 'Luxury Property Tours in 60 Seconds',
      blueprint: [
        {
          title: 'Target Audience Profile',
          content: 'Aspirational luxury buyers, high-net-worth real estate scouts.'
        },
        {
          title: 'Pacing & Hooks (The Blueprint)',
          content: '<b>The Hook (0-3s)</b>: "Step inside this $2.5 Million Farmhouse in Karachi\'s premium sector—in just 60 seconds."<br><b>Body (3-45s)</b>: ASMR-style fast cuts. Focus on sensory highlights: marble texture, water features, lighting designs. Very brief voiceover.'
        },
        {
          title: 'Direct Response Call to Action',
          content: '"Comment TOUR to receive the private listing dossier and full length high-definition walkthrough link."'
        }
      ]
    }
  };

  ideaCards.forEach(card => {
    card.addEventListener('click', () => {
      const slug = card.getAttribute('data-slug');
      const data = strategyDatabase[slug];
      
      if (data) {
        modalLabel.textContent = data.label;
        modalTitle.textContent = data.title;
        
        let html = '';
        data.blueprint.forEach(part => {
          html += `
            <div class="blueprint-section">
              <h4 class="blueprint-title">${part.title}</h4>
              <p class="blueprint-content">${part.content}</p>
            </div>
          `;
        });
        
        modalBodyContent.innerHTML = html;
        strategyOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (btnCloseStrategy && strategyOverlay) {
    btnCloseStrategy.addEventListener('click', closeStrategyModal);
    
    strategyOverlay.addEventListener('click', (e) => {
      if (e.target === strategyOverlay) {
        closeStrategyModal();
      }
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && strategyOverlay.classList.contains('active')) {
        closeStrategyModal();
      }
    });
  }

  function closeStrategyModal() {
    strategyOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  // =========================================================================
  // 7. CAREER TIMELINE CATEGORY FILTERING
  // =========================================================================
  const timelineFilterButtons = document.querySelectorAll('.filter-btn');
  const timelineItems = document.querySelectorAll('.timeline-item');

  timelineFilterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.getAttribute('data-filter');
      
      timelineFilterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      timelineItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        
        if (filter === 'all' || itemCategory === filter) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

});
