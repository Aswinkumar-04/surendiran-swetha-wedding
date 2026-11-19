(function () {
  "use strict";

  /* ---------------------------------------------------------
     1. GOLDEN DUST & SPARKLES CANVAS ANIMATION FOR INTRO
  --------------------------------------------------------- */
  var canvas = document.getElementById('introCanvas');
  var ctx = canvas ? canvas.getContext('2d') : null;
  var particles = [];
  var animFrameId = null;
  var isDoorOpened = false;

  function resizeCanvas() {
    if (!canvas) return;
    var dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    if (ctx) ctx.scale(dpr, dpr);
  }

  function createParticles() {
    if (!canvas) return;
    particles = [];
    var count = Math.min(window.innerWidth < 600 ? 35 : 65, 80);
    var colors = [
      'rgba(255, 238, 185, ',
      'rgba(255, 215, 125, ',
      'rgba(245, 186, 75, ',
      'rgba(255, 248, 220, '
    ];

    for (var i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 2.2 + 0.8,
        colorBase: colors[Math.floor(Math.random() * colors.length)],
        baseAlpha: Math.random() * 0.6 + 0.3,
        pulseSpeed: Math.random() * 0.03 + 0.01,
        pulseOffset: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -(Math.random() * 0.6 + 0.2), // slow upward drift
        swaySpeed: Math.random() * 0.02 + 0.01,
        swayRange: Math.random() * 1.2 + 0.5
      });
    }
  }

  var tick = 0;
  function renderParticles() {
    if (!ctx || !canvas || isDoorOpened) return;
    tick++;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];

      // Update position
      p.y += p.vy;
      p.x += Math.sin(tick * p.swaySpeed + p.pulseOffset) * p.swayRange * 0.3 + p.vx;

      // Wrap around bounds
      if (p.y < -10) p.y = window.innerHeight + 10;
      if (p.x < -10) p.x = window.innerWidth + 10;
      if (p.x > window.innerWidth + 10) p.x = -10;

      // Opacity pulsation (shimmering sparkle effect)
      var currentAlpha = p.baseAlpha + Math.sin(tick * p.pulseSpeed + p.pulseOffset) * 0.3;
      if (currentAlpha < 0.05) currentAlpha = 0.05;
      if (currentAlpha > 1) currentAlpha = 1;

      // Draw particle with soft halo
      ctx.beginPath();
      var gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3.2);
      gradient.addColorStop(0, p.colorBase + currentAlpha + ')');
      gradient.addColorStop(0.5, p.colorBase + (currentAlpha * 0.4) + ')');
      gradient.addColorStop(1, p.colorBase + '0)');

      ctx.fillStyle = gradient;
      ctx.arc(p.x, p.y, p.radius * 3.2, 0, Math.PI * 2);
      ctx.fill();

      // Sharp central spark
      ctx.beginPath();
      ctx.fillStyle = p.colorBase + currentAlpha + ')';
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    animFrameId = requestAnimationFrame(renderParticles);
  }

  if (canvas) {
    resizeCanvas();
    createParticles();
    renderParticles();
    window.addEventListener('resize', function () {
      resizeCanvas();
      createParticles();
    }, { passive: true });
  }

  /* ---------------------------------------------------------
     2. TEMPLE DOOR OPENING ANIMATION
  --------------------------------------------------------- */
  var intro = document.getElementById('intro');
  var openInvite = document.getElementById('openInvite');
  var bgMusic = document.getElementById('bgMusic');
  var musicBtn = document.getElementById('musicBtn');

  function openDoors() {
    if (isDoorOpened) return;
    isDoorOpened = true;

    if (intro) {
      intro.classList.add('open');
    }

    // Start background music
    playMusic();

    // Clean up canvas loop after doors complete swing
    setTimeout(function () {
      if (animFrameId) cancelAnimationFrame(animFrameId);
      if (intro) {
        intro.classList.add('done');
      }
    }, 1500);
  }

  if (openInvite) {
    openInvite.addEventListener('click', openDoors);
  }

  // Also allow pressing Enter or Space or Escape to open
  document.addEventListener('keydown', function (e) {
    if (!isDoorOpened && (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape')) {
      openDoors();
    }
  });

  /* ---------------------------------------------------------
     3. FLOATING MUSIC FAB CONTROLLER
  --------------------------------------------------------- */
  function playMusic() {
    if (!bgMusic) return;
    bgMusic.play().then(function () {
      if (musicBtn) musicBtn.classList.add('playing');
    }).catch(function (e) {
      console.log('Audio autoplay blocked, tap music button to start:', e);
    });
  }

  function pauseMusic() {
    if (!bgMusic) return;
    bgMusic.pause();
    if (musicBtn) musicBtn.classList.remove('playing');
  }

  if (musicBtn && bgMusic) {
    musicBtn.addEventListener('click', function () {
      if (bgMusic.paused) {
        playMusic();
      } else {
        pauseMusic();
      }
    });
  }

  /* ---------------------------------------------------------
     4. WEDDING COUNTDOWN (22 November 2026, 07:30 AM IST)
  --------------------------------------------------------- */
  var targetDate = new Date('2026-11-22T07:30:00+05:30').getTime();
  var daysEl = document.getElementById('days');
  var hoursEl = document.getElementById('hours');
  var minsEl = document.getElementById('mins');
  var secsEl = document.getElementById('secs');

  function pad(n) {
    return String(Math.max(0, n)).padStart(2, '0');
  }

  function updateCountdown() {
    var now = Date.now();
    var diff = targetDate - now;
    if (diff < 0) diff = 0;

    var d = Math.floor(diff / (1000 * 60 * 60 * 24));
    var h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    var s = Math.floor((diff % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = pad(d);
    if (hoursEl) hoursEl.textContent = pad(h);
    if (minsEl) minsEl.textContent = pad(m);
    if (secsEl) secsEl.textContent = pad(s);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ---------------------------------------------------------
     5. PHOTO GALLERY CAROUSEL
  --------------------------------------------------------- */
  var track = document.getElementById('galleryTrack');
  var prevBtn = document.getElementById('galleryPrev');
  var nextBtn = document.getElementById('galleryNext');
  var dotsContainer = document.getElementById('galleryDots');
  var figures = track ? track.querySelectorAll('figure') : [];
  var totalSlides = figures.length;
  var currentSlide = 0;
  var slideTimer = null;

  // Create pagination dots
  if (dotsContainer && totalSlides > 0) {
    dotsContainer.innerHTML = '';
    for (var i = 0; i < totalSlides; i++) {
      var dot = document.createElement('button');
      dot.setAttribute('aria-label', 'Go to photo ' + (i + 1));
      if (i === 0) dot.classList.add('active');
      (function (idx) {
        dot.addEventListener('click', function () {
          goToSlide(idx);
          resetAutoSlide();
        });
      })(i);
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    if (!dotsContainer) return;
    var dots = dotsContainer.querySelectorAll('button');
    dots.forEach(function (d, idx) {
      if (idx === currentSlide) {
        d.classList.add('active');
      } else {
        d.classList.remove('active');
      }
    });
  }

  function goToSlide(index) {
    if (!track || totalSlides === 0) return;
    currentSlide = (index + totalSlides) % totalSlides;
    track.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
    updateDots();
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      goToSlide(currentSlide - 1);
      resetAutoSlide();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      goToSlide(currentSlide + 1);
      resetAutoSlide();
    });
  }

  function autoSlide() {
    goToSlide(currentSlide + 1);
  }

  function startAutoSlide() {
    if (slideTimer) clearInterval(slideTimer);
    slideTimer = setInterval(autoSlide, 5000);
  }

  function resetAutoSlide() {
    startAutoSlide();
  }

  startAutoSlide();

  // Touch swipe support for gallery carousel
  var galleryViewport = document.getElementById('galleryViewport');
  var touchStartX = 0;
  var touchEndX = 0;

  if (galleryViewport) {
    galleryViewport.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
      if (slideTimer) clearInterval(slideTimer);
    }, { passive: true });

    galleryViewport.addEventListener('touchend', function (e) {
      touchEndX = e.changedTouches[0].screenX;
      var threshold = 40;
      if (touchEndX < touchStartX - threshold) {
        goToSlide(currentSlide + 1);
      } else if (touchEndX > touchStartX + threshold) {
        goToSlide(currentSlide - 1);
      }
      resetAutoSlide();
    }, { passive: true });
  }

  /* ---------------------------------------------------------
     6. FULLSCREEN LIGHTBOX
  --------------------------------------------------------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxCaption = document.getElementById('lightboxCaption');
  var lightboxCounter = document.getElementById('lightboxCounter');
  var lightboxClose = document.getElementById('lightboxClose');
  var lightboxPrev = document.getElementById('lightboxPrev');
  var lightboxNext = document.getElementById('lightboxNext');
  var currentLightboxIndex = 0;

  var galleryData = [];
  figures.forEach(function (fig, idx) {
    var img = fig.querySelector('img');
    var cap = fig.querySelector('figcaption');
    var src = fig.getAttribute('data-src') || (img ? img.src : '');
    var caption = fig.getAttribute('data-caption') || (cap ? cap.textContent : '');
    galleryData.push({ src: src, caption: caption });

    if (img) {
      img.style.cursor = 'pointer';
      img.addEventListener('click', function () {
        openLightbox(idx);
      });
    }
  });

  function openLightbox(idx) {
    if (!lightbox || !galleryData.length) return;
    currentLightboxIndex = (idx + galleryData.length) % galleryData.length;
    var item = galleryData[currentLightboxIndex];

    lightboxImg.src = item.src;
    lightboxCaption.textContent = item.caption;
    lightboxCounter.textContent = (currentLightboxIndex + 1) + ' of ' + galleryData.length;

    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', function (e) {
    e.stopPropagation();
    openLightbox(currentLightboxIndex - 1);
  });
  if (lightboxNext) lightboxNext.addEventListener('click', function (e) {
    e.stopPropagation();
    openLightbox(currentLightboxIndex + 1);
  });

  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox || e.target.classList.contains('lightbox-content') || e.target.classList.contains('lightbox-img-wrap')) {
        closeLightbox();
      }
    });
  }

  document.addEventListener('keydown', function (e) {
    if (!lightbox || !lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') openLightbox(currentLightboxIndex - 1);
    if (e.key === 'ArrowRight') openLightbox(currentLightboxIndex + 1);
  });

  /* ---------------------------------------------------------
     7. SCROLL REVEAL OBSERVER
  --------------------------------------------------------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add('show');
    });
  }

  /* ---------------------------------------------------------
     8. SUV PHOTOGRAPHY LOGO REDIRECTS
  --------------------------------------------------------- */
  var suvLinks = document.querySelectorAll('.hero-logo-link, .footer-logo-link');
  suvLinks.forEach(function (el) {
    el.addEventListener('click', function (e) {
      window.open('https://www.suvphotography.com/', '_blank');
    });
  });

})();
