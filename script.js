const body = document.body;
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
const yearElement = document.getElementById('year');
const themeToggle = document.querySelector('.theme-toggle');
const revealElements = document.querySelectorAll('.reveal');
const heroSliders = [...document.querySelectorAll('.hero-bg-slider')];
const typedText = document.querySelector('.typed-text');
const typingPhrases = [
  'Playwright',
  'QA Automation',
  'JavaScript',
  'TypeScript',
  'CI/CD Pipelines',
  'Git Repo',
  'Azure DevOps',
  'Jira'
];

if (heroSliders.length) {
  const slideGroups = heroSliders.map((slider) => [...slider.querySelectorAll('.hero-bg-slide')]);
  let activeSlideIndex = 0;

  const showHeroSlide = (nextIndex) => {
    slideGroups.forEach((slides) => {
      slides.forEach((slide, index) => {
        slide.classList.toggle('is-active', index === nextIndex);
      });
    });
  };

  showHeroSlide(activeSlideIndex);
  const slideCount = slideGroups[0]?.length ?? 0;

  if (slideCount > 1) {
    setInterval(() => {
      activeSlideIndex = (activeSlideIndex + 1) % slideCount;
      showHeroSlide(activeSlideIndex);
    }, 5000);
  }
}

const heroFeatureSlider = document.querySelector('.hero-feature-slider');

if (heroFeatureSlider) {
  const featureSlides = [...heroFeatureSlider.querySelectorAll('.hero-feature-slide')];
  const featureButtons = [...heroFeatureSlider.querySelectorAll('.hero-feature-pagination button')];
  let activeFeatureIndex = featureSlides.findIndex((slide) => slide.classList.contains('is-active'));
  activeFeatureIndex = activeFeatureIndex < 0 ? 0 : activeFeatureIndex;

  const showFeatureSlide = (nextIndex) => {
    activeFeatureIndex = nextIndex;
    featureSlides.forEach((slide, index) => {
      const isActive = index === activeFeatureIndex;
      slide.classList.toggle('is-active', isActive);
      slide.setAttribute('aria-hidden', String(!isActive));
    });
    featureButtons.forEach((button, index) => {
      const isActive = index === activeFeatureIndex;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
  };

  featureButtons.forEach((button, index) => {
    button.addEventListener('click', () => showFeatureSlide(index));
  });

  if (featureSlides.length > 1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    setInterval(() => {
      showFeatureSlide((activeFeatureIndex + 1) % featureSlides.length);
    }, 5000);
  }
}

if (typedText && typingPhrases.length) {
  if (window.matchMedia('(max-width: 640px)').matches) {
    typedText.innerHTML = `
      <span class="typed-skill">${typingPhrases[0]}</span>
      <span class="typed-check is-visible" aria-hidden="true">✓</span>
    `;
  } else {
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const typeLoop = () => {
      const phrase = typingPhrases[phraseIndex];

      if (!isDeleting) {
        charIndex += 1;
        typedText.innerHTML = `
          <span class="typed-skill">${phrase.slice(0, charIndex)}</span>
          <span class="typed-check ${charIndex === phrase.length ? 'is-visible' : ''}" aria-hidden="true">✓</span>
        `;

        if (charIndex === phrase.length) {
          isDeleting = true;
          setTimeout(typeLoop, 1200);
          return;
        }
      } else {
        charIndex -= 1;
        typedText.innerHTML = `
          <span class="typed-skill">${phrase.slice(0, charIndex)}</span>
          <span class="typed-check ${charIndex === 0 ? '' : 'is-visible'}" aria-hidden="true">✓</span>
        `;

        if (charIndex === 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % typingPhrases.length;
        }
      }

      const speed = isDeleting ? 60 : 120;
      setTimeout(typeLoop, speed);
    };

    typedText.innerHTML = '';
    typeLoop();
  }
}

const setTheme = (theme) => {
  const isLight = theme === 'light';
  body.classList.toggle('light-theme', isLight);
  localStorage.setItem('theme', theme);

  if (themeToggle) {
    themeToggle.textContent = isLight ? '🌙' : '☀️';
    themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
  }
};

const preferredTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
setTheme(preferredTheme);

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href');
    const targetElement = targetId ? document.querySelector(targetId) : null;

    if (!targetElement) {
      return;
    }

    event.preventDefault();
    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const nextTheme = body.classList.contains('light-theme') ? 'dark' : 'light';
    setTheme(nextTheme);
  });
}

document.querySelectorAll('video').forEach((video) => {
  video.muted = false;
  video.volume = 1;
  video.defaultMuted = false;
});

const mobileVideoQuery = window.matchMedia('(max-width: 640px) and (pointer: coarse)');
const videoStage = document.querySelector('.video-player-stage');
const mobileVideo = videoStage?.querySelector('video');
const mobileFullscreenOpen = videoStage?.querySelector('.mobile-video-fullscreen-open');
const mobileFullscreenClose = videoStage?.querySelector('.mobile-video-fullscreen-close');

const syncMobileVideoFullscreen = () => {
  if (!mobileVideo) {
    return;
  }

  if (mobileVideoQuery.matches) {
    mobileVideo.controlsList.add('nofullscreen');
  } else {
    mobileVideo.controlsList.remove('nofullscreen');
  }
};

syncMobileVideoFullscreen();
mobileVideoQuery.addEventListener('change', syncMobileVideoFullscreen);

mobileFullscreenOpen?.addEventListener('click', () => {
  if (videoStage?.requestFullscreen) {
    videoStage.requestFullscreen().catch(() => mobileVideo?.webkitEnterFullscreen?.());
  } else {
    mobileVideo?.webkitEnterFullscreen?.();
  }
});

mobileFullscreenClose?.addEventListener('click', () => {
  if (document.fullscreenElement === videoStage) {
    document.exitFullscreen();
  } else {
    mobileVideo?.webkitExitFullscreen?.();
  }
});

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('visible'));
}

const joinGroupForm = document.querySelector('.join-form');

if (joinGroupForm) {
  const whatsappGroupLinks = {
    Female: 'https://chat.whatsapp.com/IpK8H3EYI7aFtRoirf3umk',
    Male: 'https://chat.whatsapp.com/L5uASfiYlz5DB4QQ4iTHEk'
  };

  joinGroupForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const gender = joinGroupForm.querySelector('select[name="gender"]')?.value;
    const whatsappGroupLink = whatsappGroupLinks[gender];

    if (!whatsappGroupLink) {
      console.error(`No WhatsApp group link configured for gender: ${gender || '(not selected)'}`);
      return;
    }

    window.open(whatsappGroupLink, '_blank', 'noopener,noreferrer');
  });
}

const flowChartImage = document.querySelector('.flow-chart-image');
const imageModal = document.getElementById('imageModal');
const imageCloseButton = document.querySelector('.image-close');
const modalImage = imageModal ? imageModal.querySelector('img') : null;

if (flowChartImage && imageModal && imageCloseButton && modalImage) {
  const fallbackImage = flowChartImage.getAttribute('src') || 'flow_chart_agile_PBI.png';

  flowChartImage.setAttribute('src', fallbackImage);
  modalImage.setAttribute('src', fallbackImage);

  const closeModal = () => {
    if (document.activeElement === imageCloseButton) {
      imageCloseButton.blur();
    }
    flowChartImage.focus();
    imageModal.classList.remove('is-open');
    imageModal.setAttribute('aria-hidden', 'true');
    imageModal.setAttribute('inert', '');
    imageModal.hidden = true;
    document.body.style.overflow = '';
  };

  const openModal = () => {
    modalImage.setAttribute('src', flowChartImage.currentSrc || flowChartImage.src || fallbackImage);
    imageModal.hidden = false;
    imageModal.classList.add('is-open');
    imageModal.setAttribute('aria-hidden', 'false');
    imageModal.removeAttribute('inert');
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => imageCloseButton.focus());
  };

  flowChartImage.addEventListener('click', (event) => {
    event.preventDefault();
    openModal();
  });

  imageCloseButton.addEventListener('click', (event) => {
    event.preventDefault();
    closeModal();
  });

  imageModal.addEventListener('click', (event) => {
    if (event.target instanceof HTMLElement && event.target.dataset.closeModal === 'true') {
      closeModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && imageModal.classList.contains('is-open')) {
      closeModal();
    }
  });
}
