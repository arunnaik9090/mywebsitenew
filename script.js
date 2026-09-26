const body = document.body;
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
const yearElement = document.getElementById('year');
const themeToggle = document.querySelector('.theme-toggle');
const revealElements = document.querySelectorAll('.reveal');
const heroSlides = [...document.querySelectorAll('.hero-bg-slide')];
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

if (heroSlides.length) {
  let activeSlideIndex = 0;

  const showHeroSlide = (nextIndex) => {
    heroSlides.forEach((slide, index) => {
      slide.classList.toggle('is-active', index === nextIndex);
    });
  };

  showHeroSlide(activeSlideIndex);
  setInterval(() => {
    activeSlideIndex = (activeSlideIndex + 1) % heroSlides.length;
    showHeroSlide(activeSlideIndex);
  }, 5000);
}

if (typedText && typingPhrases.length) {
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


