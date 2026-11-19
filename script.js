(function () {
  "use strict";

  /* ---------------------------------------------------------
     1. OPEN INVITATION → HERO TRANSITION
  --------------------------------------------------------- */
  var openingEl = document.getElementById('opening');
  var openingCover = document.getElementById('opening-cover');
  var main = document.getElementById('main');
  var skipBtn = document.getElementById('skip-intro');
  var openBtn = document.getElementById('open-invitation-btn');
  var introDone = false;

  function endIntro() {
    if (introDone) return;
    introDone = true;

    // Start background music on user action
    startMusic();

    if (openingEl) {
      openingEl.classList.add('is-fading');
    }
    if (main) {
      main.classList.add('is-visible');
    }
    document.body.classList.remove('intro-active');

    // Trigger hero entrance animations
    playHeroEntrance();

    setTimeout(function () {
      if (openingEl) {
        openingEl.style.display = 'none';
      }
    }, 1200);
  }

  function startInvitation() {
    endIntro();
  }

  if (openBtn) {
    openBtn.addEventListener('click', startInvitation);
  }

  if (skipBtn) {
    skipBtn.addEventListener('click', endIntro);
  }

  // Allow pressing Escape or Enter during intro
  document.addEventListener('keydown', function (e) {
    if (!introDone && (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ')) {
      endIntro();
    }
  });

  /* ---------------------------------------------------------
     2. BACKGROUND WEDDING MUSIC
  --------------------------------------------------------- */
  var bgMusic = document.getElementById('bg-music');
  var musicToggle = document.getElementById('music-toggle');
  var musicStarted = false;

  function startMusic() {
    if (musicStarted || !bgMusic) return;
    musicStarted = true;

    try {
      if (!bgMusic.getAttribute('src') && bgMusic.querySelector('source')) {
        bgMusic.load();
      }
      var attempt = bgMusic.play();
      if (attempt !== undefined) {
        attempt.catch(function () {
          console.log('Audio autoplay prevented by browser. User can tap music button.');
        });
      }
    } catch (err) {}

    if (musicToggle) {
      musicToggle.classList.remove('is-hidden');
      musicToggle.classList.add('is-visible');
    }
  }

  if (musicToggle && bgMusic) {
    musicToggle.addEventListener('click', function () {
      if (!musicStarted) {
        startMusic();
        return;
      }
      if (bgMusic.paused) {
        bgMusic.play().then(function () {
          musicToggle.classList.remove('is-muted');
          musicToggle.setAttribute('aria-pressed', 'true');
        }).catch(function () {});
      } else {
        bgMusic.pause();
        musicToggle.classList.add('is-muted');
        musicToggle.setAttribute('aria-pressed', 'false');
      }
    });
  }

  /* ---------------------------------------------------------
     3. COUNTDOWN TO NOVEMBER 22, 2026 (07:30 AM IST)
  --------------------------------------------------------- */
  // Muhurtham Date: Sunday, 22 November 2026, 07:30 AM IST
  var weddingTarget = new Date('2026-11-22T07:30:00+05:30').getTime();

  function pad(n) {
    return String(Math.max(0, n)).padStart(2, '0');
  }

  var reduceMotionCountdown = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setFlipDigit(el, value) {
    if (!el || el.textContent === value) return;
    el.textContent = value;
    var card = el.closest('.flip-card');
    if (card && !reduceMotionCountdown) {
      card.classList.remove('is-flipping');
      void card.offsetWidth; // force reflow
      card.classList.add('is-flipping');
    }
  }

  function updateCountdown(id, target) {
    var el = document.getElementById(id);
    if (!el) return;
    var now = Date.now();
    var diff = target - now;
    if (diff < 0) diff = 0;

    var d = Math.floor(diff / (1000 * 60 * 60 * 24));
    var h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    var s = Math.floor((diff % (1000 * 60)) / 1000);

    setFlipDigit(el.querySelector('[data-d]'), pad(d));
    setFlipDigit(el.querySelector('[data-h]'), pad(h));
    setFlipDigit(el.querySelector('[data-m]'), pad(m));
    setFlipDigit(el.querySelector('[data-s]'), pad(s));
  }

  function tickCountdowns() {
    updateCountdown('countdown-wedding', weddingTarget);
  }
  tickCountdowns();
  setInterval(tickCountdowns, 1000);

  /* ---------------------------------------------------------
     4. SCROLL REVEAL ANIMATIONS (GSAP & Fallback)
  --------------------------------------------------------- */
  function initAnimations() {
    if (typeof gsap === 'undefined') {
      // Fallback if GSAP is not loaded
      document.querySelectorAll('.reveal, .reveal-scale').forEach(function (el) {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      gsap.set('.reveal, .reveal-scale', { opacity: 1, y: 0, scale: 1 });
      return;
    }

    document.querySelectorAll('.section').forEach(function (section) {
      if (section.id === 'hero') return; // Handled separately on intro end

      var reveals = section.querySelectorAll('.reveal');
      var scales = section.querySelectorAll('.reveal-scale');

      if (reveals.length && typeof ScrollTrigger !== 'undefined') {
        gsap.to(reveals, {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: 'power2.out',
          stagger: 0.12,
          scrollTrigger: { trigger: section, start: 'top 80%', once: true }
        });
      }
      if (scales.length && typeof ScrollTrigger !== 'undefined') {
        gsap.to(scales, {
          opacity: 1,
          scale: 1,
          duration: 1.3,
          ease: 'power2.out',
          scrollTrigger: { trigger: section, start: 'top 75%', once: true }
        });
      }
    });

    var heroReveals = document.querySelectorAll('#hero .reveal');
    var heroScale = document.querySelectorAll('#hero .reveal-scale');
    gsap.set(heroReveals, { opacity: 0, y: 24 });
    gsap.set(heroScale, { opacity: 0, scale: 0.94 });
  }

  function playHeroEntrance() {
    if (typeof gsap === 'undefined') return;
    var tl = gsap.timeline({ delay: 0.2 });
    tl.to('#hero .reveal', { opacity: 1, y: 0, duration: 1.1, ease: 'power2.out', stagger: 0.12 }, 0);
    tl.to('#hero .reveal-scale', { opacity: 1, scale: 1, duration: 1.3, ease: 'power2.out' }, 0.15);
  }

  /* ---------------------------------------------------------
     5. SCROLL PROGRESS BAR & BACK TO TOP
  --------------------------------------------------------- */
  var progressBar = document.getElementById('scroll-progress');
  var backToTop = document.getElementById('back-to-top');

  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var scrolled = max > 0 ? (h.scrollTop / max) * 100 : 0;
    if (progressBar) {
      progressBar.style.width = scrolled + '%';
    }
    if (backToTop) {
      if (window.scrollY > window.innerHeight * 0.7) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------------------------------------------------------
     6. AMBIENT PARTICLES (Golden Dust & Floating Petals)
  --------------------------------------------------------- */
  (function initParticles() {
    if (reduceMotionCountdown) return;
    var canvas = document.getElementById('particles');
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');
    var w, h;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    var COUNT = window.innerWidth < 700 ? 18 : 36;
    function spawn(randomY) {
      var petal = Math.random() > 0.55;
      return {
        x: Math.random() * w,
        y: randomY ? Math.random() * h : -20,
        r: petal ? (3 + Math.random() * 4) : (1.2 + Math.random() * 1.8),
        speedY: 0.22 + Math.random() * 0.45,
        speedX: (Math.random() - 0.5) * 0.5,
        sway: Math.random() * Math.PI * 2,
        swaySpeed: 0.008 + Math.random() * 0.016,
        opacity: 0.2 + Math.random() * 0.4,
        petal: petal
      };
    }

    var particles = [];
    for (var i = 0; i < COUNT; i++) {
      particles.push(spawn(true));
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.sway += p.swaySpeed;
        p.x += p.speedX + Math.sin(p.sway) * 0.4;
        p.y += p.speedY;

        if (p.y > h + 25) {
          particles[i] = spawn(false);
        }
        if (p.x > w + 25) p.x = -20;
        if (p.x < -25) p.x = w + 20;

        ctx.beginPath();
        if (p.petal) {
          ctx.fillStyle = 'rgba(181, 138, 58, ' + p.opacity + ')';
          ctx.ellipse(p.x, p.y, p.r, p.r * 0.6, p.sway, 0, Math.PI * 2);
        } else {
          ctx.fillStyle = 'rgba(255, 248, 232, ' + p.opacity + ')';
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        }
        ctx.fill();
      }
      window.requestAnimationFrame(draw);
    }
    draw();
  })();

  /* ---------------------------------------------------------
     7. PHOTO GALLERY & FULLSCREEN LIGHTBOX
  --------------------------------------------------------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  var lightboxCaption = document.getElementById('lightbox-caption');
  var lightboxCounter = document.getElementById('lightbox-counter');
  var lightboxClose = document.getElementById('lightbox-close');
  var lightboxPrev = document.getElementById('lightbox-prev');
  var lightboxNext = document.getElementById('lightbox-next');

  // Collect all gallery items (photo cards + invitation card)
  var galleryItems = [];
  var currentLightboxIndex = 0;

  var photoElements = document.querySelectorAll('.photo-card, .invitation-preview-card');
  photoElements.forEach(function (el, idx) {
    var src = el.getAttribute('data-src') || (el.querySelector('img') ? el.querySelector('img').src : '');
    var caption = el.getAttribute('data-caption') || '';
    galleryItems.push({
      src: src,
      caption: caption
    });

    el.addEventListener('click', function () {
      openLightbox(idx);
    });
  });

  function openLightbox(index) {
    if (!lightbox || !galleryItems.length) return;
    currentLightboxIndex = (index + galleryItems.length) % galleryItems.length;
    var item = galleryItems[currentLightboxIndex];

    lightboxImg.src = item.src;
    lightboxCaption.textContent = item.caption;
    lightboxCounter.textContent = (currentLightboxIndex + 1) + ' of ' + galleryItems.length;

    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    if (!document.body.classList.contains('intro-active')) {
      document.body.style.overflow = '';
    }
  }

  function prevPhoto() {
    openLightbox(currentLightboxIndex - 1);
  }

  function nextPhoto() {
    openLightbox(currentLightboxIndex + 1);
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', function (e) {
    e.stopPropagation();
    prevPhoto();
  });
  if (lightboxNext) lightboxNext.addEventListener('click', function (e) {
    e.stopPropagation();
    nextPhoto();
  });

  // Close lightbox on clicking backdrop outside image content
  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox || e.target.classList.contains('lightbox-content') || e.target.classList.contains('lightbox-img-wrap')) {
        closeLightbox();
      }
    });
  }

  // Keyboard controls for lightbox
  document.addEventListener('keydown', function (e) {
    if (!lightbox || !lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevPhoto();
    if (e.key === 'ArrowRight') nextPhoto();
  });

  // Touch swipe support for mobile
  var touchStartX = 0;
  var touchEndX = 0;

  if (lightbox) {
    lightbox.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', function (e) {
      touchEndX = e.changedTouches[0].screenX;
      var swipeThreshold = 50;
      if (touchEndX < touchStartX - swipeThreshold) {
        nextPhoto(); // swiped left
      }
      if (touchEndX > touchStartX + swipeThreshold) {
        prevPhoto(); // swiped right
      }
    }, { passive: true });
  }

  /* ---------------------------------------------------------
     8. SUV PHOTOGRAPHY LOGO REDIRECT HANDLER
  --------------------------------------------------------- */
  var suvLinks = document.querySelectorAll('.hero-logo-link, .opening-logo-link, .credit-logo-link');
  suvLinks.forEach(function (el) {
    el.addEventListener('click', function (e) {
      // Ensure click bubbles or opens window immediately
      window.open('https://www.suvphotography.com/', '_blank');
    });
  });

  // Initialize animations
  document.addEventListener('DOMContentLoaded', function () {
    initAnimations();
  });
  window.addEventListener('load', function () {
    initAnimations();
  });

})();

