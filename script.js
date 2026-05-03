// ========================= script.js =========================

const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const themeToggle = document.getElementById('themeToggle');
const themeToggleMobile = document.getElementById('themeToggleMobile');
const colorThemeToggle = document.getElementById('colorThemeToggle');
const colorThemeToggleMobile = document.getElementById('colorThemeToggleMobile');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const REVEAL_SELECTOR = '.fade-up, [data-reveal], main > section:not(#hero), main > aside, footer#footer';
let revealOrder = 0;
let revealRaf = null;
const pendingRevealTargets = new Set();

function revealImmediately(element) {
  element.classList.add('show', 'is-visible');
}

function shouldRevealOnScroll(element) {
  const rect = element.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
  if (!viewportHeight) return false;
  return rect.top <= viewportHeight * 0.88 && rect.bottom >= viewportHeight * 0.08;
}

function revealVisibleTargets() {
  pendingRevealTargets.forEach((element) => {
    if (shouldRevealOnScroll(element)) {
      revealImmediately(element);
      pendingRevealTargets.delete(element);
    }
  });
}

function queueRevealVisibleTargets() {
  if (revealRaf !== null) return;
  revealRaf = window.requestAnimationFrame(() => {
    revealRaf = null;
    revealVisibleTargets();
  });
}

function observeRevealTarget(element) {
  if (!element) return;
  if (element.dataset.revealBound === '1') return;

  if (!element.style.getPropertyValue('--reveal-delay')) {
    const delay = Math.min((revealOrder % 6) * 70, 350);
    element.style.setProperty('--reveal-delay', `${delay}ms`);
    revealOrder += 1;
  }

  element.dataset.revealBound = '1';
  element.classList.add('reveal-ready');

  if (prefersReducedMotion.matches) {
    revealImmediately(element);
    return;
  }

  if (shouldRevealOnScroll(element)) {
    revealImmediately(element);
    return;
  }

  pendingRevealTargets.add(element);
}

function setupScrollReveal(scope = document) {
  if (!scope) return;

  const targets = new Set();
  const canQuery = typeof scope.querySelectorAll === 'function';
  const canMatch = typeof scope.matches === 'function';

  if (canMatch && scope.matches(REVEAL_SELECTOR)) {
    targets.add(scope);
  }
  if (canQuery) {
    scope.querySelectorAll(REVEAL_SELECTOR).forEach((target) => targets.add(target));
  }

  targets.forEach((target) => observeRevealTarget(target));
  queueRevealVisibleTargets();
}

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
}

function applyTheme(theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  localStorage.setItem('jizana-theme', theme);
  const iconName = theme === 'dark' ? 'sun-fill' : 'moon-fill';
  const label = theme === 'dark' ? 'Light' : 'Dark';
  if (themeToggle) themeToggle.innerHTML = `<i class='bi bi-${iconName}'></i> ${label}`;
  if (themeToggleMobile) themeToggleMobile.textContent = `${label} Mode`;
}

function initTheme() {
  const saved = localStorage.getItem('jizana-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  applyTheme(theme);
}

function applyColorTheme(theme) {
  const normalized = theme === 'ember' ? 'ember' : 'ocean';
  const themeLabel = normalized === 'ember' ? 'Crimson' : 'Ocean';

  document.documentElement.setAttribute('data-color-theme', normalized);
  localStorage.setItem('jizana-color-theme', normalized);

  if (colorThemeToggle) {
    colorThemeToggle.innerHTML = `<i class='bi bi-palette-fill'></i> ${themeLabel}`;
  }
  if (colorThemeToggleMobile) {
    colorThemeToggleMobile.textContent = `Palette: ${themeLabel}`;
  }
}

function initColorTheme() {
  const saved = localStorage.getItem('jizana-color-theme');
  applyColorTheme(saved || 'ember');
}

function toggleColorTheme() {
  const active = document.documentElement.getAttribute('data-color-theme') || 'ember';
  applyColorTheme(active === 'ocean' ? 'ember' : 'ocean');
}

function setupHeaderScrollEffect() {
  const header = document.getElementById('siteHeader');
  if (!header) return;
  const hasImmersiveHero = Boolean(document.getElementById('hero'));

  function updateHeaderState() {
    const isScrolledStyle = hasImmersiveHero ? window.scrollY > 24 : true;
    header.classList.toggle('is-scrolled', isScrolledStyle);
  }

  if (hasImmersiveHero) {
    window.addEventListener('scroll', updateHeaderState, { passive: true });
  }
  updateHeaderState();
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.classList.contains('dark');
    applyTheme(isDark ? 'light' : 'dark');
  });
}

if (themeToggleMobile) {
  themeToggleMobile.addEventListener('click', () => {
    const isDark = document.documentElement.classList.contains('dark');
    applyTheme(isDark ? 'light' : 'dark');
  });
}

if (colorThemeToggle) {
  colorThemeToggle.addEventListener('click', toggleColorTheme);
}

if (colorThemeToggleMobile) {
  colorThemeToggleMobile.addEventListener('click', toggleColorTheme);
}

const SITE_DATA_URL = 'site-data.json';
const DEFAULT_SITE_DATA = {
  contact: {
    whatsapp: '+91 98765 43210',
    phone: '+91 98765 43210',
    email: 'support@jizana.com'
  },
  featuredPackages: [
    { id: 1, name: 'Bali Getaway', category: 'beach', rating: 4.8, badge: 'Best Deal', image: 'assets/images/cdn/picsum-id-1018-600x400.jpg', desc: 'Beaches, curated experiences, and a relaxed premium stay.', markerColor: 'cyan', tag: 'Best Deal' },
    { id: 2, name: 'Manali Chill Retreat', category: 'mountain', rating: 4.5, badge: 'Trending', image: 'assets/images/cdn/picsum-id-1029-600x400.jpg', desc: 'Scenic mountain views with adventure-ready guided activities.', markerColor: 'indigo', tag: 'Trending' },
    { id: 3, name: 'Tokyo Highlights', category: 'city', rating: 4.9, badge: 'New', image: 'assets/images/cdn/picsum-id-1042-600x400.jpg', desc: 'Culture-rich city exploration with polished urban comforts.', markerColor: 'rose', tag: 'New' }
  ],
  popularDestinations: [
    { id: 1, name: 'Paris', country: 'France', description: 'City lights, boutique stays, river cruises, and classic café culture.', image: 'assets/images/cdn/picsum-id-1056-1200x800.jpg' },
    { id: 2, name: 'Maldives', country: 'Indian Ocean', description: 'Overwater villas, private beaches, and crystal-clear lagoon escapes.', image: 'assets/images/cdn/picsum-id-1057-1200x800.jpg' },
    { id: 3, name: 'Shimla', country: 'India', description: 'Mountain charm, pine forests, toy train routes, and cozy hillside stays.', image: 'assets/images/cdn/picsum-id-1059-1200x800.jpg' },
    { id: 4, name: 'Kyoto', country: 'Japan', description: 'Temples, seasonal gardens, and refined cultural districts with premium ryokans.', image: 'assets/images/cdn/picsum-id-1040-1200x800.jpg' },
    { id: 5, name: 'Santorini', country: 'Greece', description: 'White cliffside homes, caldera sunsets, and sea-view suites for slow luxury.', image: 'assets/images/cdn/picsum-id-1011-1200x800.jpg' },
    { id: 6, name: 'Cappadocia', country: 'Turkey', description: 'Fairy-chimney valleys, cave hotels, and sunrise hot-air balloon panoramas.', image: 'assets/images/cdn/picsum-id-1002-1200x800.jpg' }
  ],
  packages: [
    { id: 1, name: 'Maldives Paradise', category: 'beach', duration: 7, price: 80000, rating: 4.8, desc: '7 days beach villa luxury.', image: 'assets/images/cdn/picsum-id-1025-700x500.jpg' },
    { id: 2, name: 'Himalaya Trekking', category: 'mountain', duration: 8, price: 72000, rating: 4.9, desc: 'Trek with expert guides.', image: 'assets/images/cdn/picsum-id-1035-700x500.jpg' },
    { id: 3, name: 'NYC Weekender', category: 'city', duration: 4, price: 33000, rating: 4.5, desc: 'City tours plus show.', image: 'assets/images/cdn/picsum-id-1006-700x500.jpg' },
    { id: 4, name: 'Kerala Backwaters', category: 'beach', duration: 5, price: 50000, rating: 4.7, desc: 'Houseboat stay and culture.', image: 'assets/images/cdn/picsum-id-1022-700x500.jpg' },
    { id: 5, name: 'Dubai Luxury Week', category: 'city', duration: 5, price: 75000, rating: 4.8, desc: 'Luxury city and desert safari.', image: 'assets/images/cdn/picsum-id-1041-700x500.jpg' },
    { id: 6, name: 'Andaman Reef Dive', category: 'adventure', duration: 6, price: 69000, rating: 4.9, desc: 'Diving and island hopping.', image: 'assets/images/cdn/picsum-id-1013-700x500.jpg' }
  ]
};

function cloneSiteData(data) {
  return JSON.parse(JSON.stringify(data));
}

let siteData = cloneSiteData(DEFAULT_SITE_DATA);

function digitsOnly(value) {
  return String(value || '').replace(/\D/g, '');
}

function normalizeSiteData(payload) {
  if (!payload || typeof payload !== 'object') {
    return cloneSiteData(DEFAULT_SITE_DATA);
  }

  return {
    contact: {
      ...DEFAULT_SITE_DATA.contact,
      ...(payload.contact || {})
    },
    featuredPackages: Array.isArray(payload.featuredPackages) && payload.featuredPackages.length > 0
      ? payload.featuredPackages
      : DEFAULT_SITE_DATA.featuredPackages,
    popularDestinations: Array.isArray(payload.popularDestinations) && payload.popularDestinations.length > 0
      ? payload.popularDestinations
      : DEFAULT_SITE_DATA.popularDestinations,
    packages: Array.isArray(payload.packages) && payload.packages.length > 0
      ? payload.packages
      : DEFAULT_SITE_DATA.packages
  };
}

async function loadSiteData() {
  try {
    const response = await fetch(SITE_DATA_URL, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Failed to load ${SITE_DATA_URL}: ${response.status}`);
    const payload = await response.json();
    siteData = normalizeSiteData(payload);
  } catch (error) {
    console.warn('Using fallback site data:', error);
    siteData = cloneSiteData(DEFAULT_SITE_DATA);
  }
}

function applySiteContactData() {
  const contact = siteData.contact || {};
  const formattedPhone = contact.phone || DEFAULT_SITE_DATA.contact.phone;
  const email = contact.email || DEFAULT_SITE_DATA.contact.email;
  const whatsapp = contact.whatsapp || formattedPhone || DEFAULT_SITE_DATA.contact.whatsapp;

  const whatsappButton = document.getElementById('customPlanWhatsappBtn');
  if (whatsappButton) {
    whatsappButton.dataset.whatsapp = whatsapp;
  }

  const phoneLink = digitsOnly(formattedPhone);
  document.querySelectorAll('[data-contact-phone]').forEach((element) => {
    element.textContent = formattedPhone;
    if (element.tagName.toLowerCase() === 'a' && phoneLink) {
      element.href = `tel:+${phoneLink}`;
    }
  });

  document.querySelectorAll('[data-contact-email]').forEach((element) => {
    element.textContent = email;
    if (element.tagName.toLowerCase() === 'a' && email) {
      element.href = `mailto:${email}`;
    }
  });
}

function renderFeaturedPackages() {
  const grid = document.getElementById('featuredPackagesGrid');
  if (!grid) return;
  const featuredPackagesData = siteData.featuredPackages || [];
  const markerColorClassMap = {
    cyan: 'bg-cyan-500',
    indigo: 'bg-indigo-500',
    rose: 'bg-rose-500',
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500',
    amber: 'bg-amber-500'
  };

  grid.innerHTML = featuredPackagesData.map((pkg) => {
    const cleanDescription = String(pkg.desc || '')
      .replace(/\b\d+\s*days?\s*\/\s*\d+\s*nights?,?\s*/i, '')
      .replace(/\b\d+\s*days?,?\s*/i, '')
      .trim();
    const category = pkg.category ? pkg.category.charAt(0).toUpperCase() + pkg.category.slice(1) : 'Curated';

    return `
      <article class="card group fade-up overflow-hidden rounded-[26px] border border-slate-200/80 bg-white/90 shadow-[0_14px_35px_rgba(15,23,42,0.12)] transition hover:-translate-y-1 hover:shadow-[0_24px_45px_rgba(14,116,144,0.2)] dark:border-slate-700 dark:bg-slate-900/85">
        <div class="relative overflow-hidden">
          <img src="${pkg.image}" alt="${pkg.name}" class="h-56 w-full object-cover transition duration-500 group-hover:scale-105" />
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-900/10 to-transparent"></div>

          <div class="absolute left-4 top-4 ${markerColorClassMap[pkg.markerColor] || 'bg-cyan-500'} rounded-full px-3 py-1 text-xs font-bold text-white shadow">
            ${pkg.tag || 'Featured'}
          </div>

          <div class="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-800 backdrop-blur dark:bg-slate-900/90 dark:text-slate-100">
            ${pkg.rating} ★
          </div>
        </div>

        <div class="p-5">
          <div class="flex items-start justify-between gap-3">
            <h4 class="text-xl font-bold text-slate-900 dark:text-slate-100">${pkg.name}</h4>
            <span class="shrink-0 rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-[11px] font-semibold text-cyan-700 dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-300">${category}</span>
          </div>
          <p class="mt-2 min-h-[3rem] text-sm leading-relaxed text-slate-600 dark:text-slate-300">${cleanDescription}</p>

          <div class="mt-5 flex items-center justify-between">
            <span class="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-300">
              <i class="bi bi-shield-check text-cyan-500"></i>
              Verified Itinerary
            </span>
            <a href="package-details.html?id=${encodeURIComponent(pkg.id)}" class="inline-flex items-center gap-1 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-95">
              View Package <i class="bi bi-arrow-right-short text-base"></i>
            </a>
          </div>
        </div>
      </article>
    `;
  }).join('');
  setupScrollReveal(grid);
}

function renderDestinations() {
  const grid = document.getElementById('destinationsGrid');
  if (!grid) return;
  const destinationsData = siteData.popularDestinations || [];

  if (destinationsData.length === 0) {
    grid.innerHTML = `
      <article class="rounded-3xl border border-slate-200 bg-white/80 p-8 text-center dark:border-slate-700 dark:bg-slate-900/70">
        <h4 class="text-xl font-bold text-slate-900 dark:text-slate-100">Destinations Coming Soon</h4>
        <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">We are refreshing our destination lineup. Check back shortly.</p>
      </article>
    `;
    setupScrollReveal(grid);
    return;
  }

  grid.innerHTML = destinationsData.map((dest, index) => {
    const country = dest.country || 'Signature Destination';
    const cardNumber = String(index + 1).padStart(2, '0');
    return `
      <article class="group fade-up">
        <div class="relative">
          <div class="overflow-hidden rounded-2xl bg-slate-200 dark:bg-slate-800">
            <img src="${dest.image}" alt="${dest.name}" class="h-72 w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
          </div>

          <div class="relative mx-4 -mt-10 rounded-xl border border-slate-200 bg-white/95 p-5 shadow-[0_12px_28px_rgba(15,23,42,0.1)] backdrop-blur transition group-hover:-translate-y-1 dark:border-slate-700 dark:bg-slate-900/95 dark:shadow-[0_14px_28px_rgba(2,6,23,0.42)]">
            <div class="flex items-center justify-between gap-3">
              <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">${country}</p>
              <span class="text-xs font-semibold text-slate-400 dark:text-slate-500">${cardNumber}</span>
            </div>

            <h4 class="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">${dest.name}</h4>
            <p class="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">${dest.description}</p>

            <div class="mt-4 flex items-center justify-between">
              <span class="text-xs text-slate-500 dark:text-slate-400">Minimal curated route</span>
              <a href="packages.html" class="inline-flex items-center gap-1 text-sm font-semibold text-cyan-600 transition hover:gap-1.5 hover:text-cyan-500 dark:text-cyan-300">
                View <i class="bi bi-arrow-right text-sm"></i>
              </a>
            </div>
          </div>
        </div>
      </article>
    `;
  }).join('');
  setupScrollReveal(grid);
}

function formatPriceInr(value) {
  const numeric = Number(value || 0);
  return `₹${numeric.toLocaleString('en-IN')}`;
}

function getPackageTypeKey(pkg) {
  return String(pkg.packageType || pkg.category || 'other').trim().toLowerCase();
}

function getPackageTypeLabel(pkg) {
  if (pkg.packageTypeLabel) return String(pkg.packageTypeLabel);
  const key = getPackageTypeKey(pkg);
  return key.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

function getPackageScopeKey(pkg) {
  return String(pkg.scope || 'domestic').trim().toLowerCase();
}

function getPackageScopeLabel(scopeKey) {
  const scopeLabels = {
    domestic: 'Domestic Routes',
    'north-train': 'North Indian Train',
    international: 'International',
    cruise: 'Luxury Cruise'
  };
  return scopeLabels[scopeKey] || 'Domestic Routes';
}

const PRIORITY_SCOPES = ['north-train', 'international', 'cruise'];

function isPriorityScope(scopeKey) {
  return PRIORITY_SCOPES.includes(String(scopeKey || '').toLowerCase());
}

function getPackageItinerary(pkg) {
  if (Array.isArray(pkg.itinerary) && pkg.itinerary.length > 0) {
    return pkg.itinerary.map((stop) => String(stop).trim()).filter(Boolean);
  }

  return String(pkg.name || '')
    .split(/\s*[–-]\s*|\s*\/\s*/)
    .map((stop) => stop.trim())
    .filter(Boolean);
}

function renderPackagePageList() {
  const container = document.getElementById('packageList');
  if (!container) return;
  const packagePageData = siteData.packages || [];

  const typeFilterRoot = document.getElementById('packageTypeFilters');
  const priceRange = document.getElementById('priceRange');
  const scopeFilter = document.getElementById('scopeFilter');
  const sortOptions = document.getElementById('sortOptions');
  const currentType = typeFilterRoot?.querySelector('.filter-chip.bg-cyan-500')?.dataset.filter || 'all';

  const maxPrice = priceRange ? Number(priceRange.value) : Number.MAX_SAFE_INTEGER;
  const scopeFilterValue = scopeFilter ? scopeFilter.value : 'all';
  const sortValue = sortOptions ? sortOptions.value : 'rating';

  const filtered = packagePageData
    .filter((pkg) => (currentType === 'all' || getPackageTypeKey(pkg) === currentType))
    .filter((pkg) => {
      const scopeKey = getPackageScopeKey(pkg);
      if (scopeFilterValue === 'all') return true;
      if (scopeFilterValue === 'priority') return isPriorityScope(scopeKey);
      return scopeKey === scopeFilterValue;
    })
    .filter((pkg) => Number(pkg.price || 0) <= maxPrice)
    .slice();

  filtered.sort((a, b) => {
    const aScope = getPackageScopeKey(a);
    const bScope = getPackageScopeKey(b);
    const aPriorityWeight = isPriorityScope(aScope) ? 1 : 0;
    const bPriorityWeight = isPriorityScope(bScope) ? 1 : 0;
    if (aPriorityWeight !== bPriorityWeight) return bPriorityWeight - aPriorityWeight;

    if (sortValue === 'name') return String(a.name || '').localeCompare(String(b.name || ''));
    if (sortValue === 'price') return a.price - b.price;
    return b.rating - a.rating;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <article class="glass rounded-2xl p-6 text-center">
        <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">No routes match the current filters</h3>
        <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">Try selecting a different package category, family, or budget range.</p>
      </article>
    `;
    setupScrollReveal(container);
    return;
  }

  container.innerHTML = filtered.map((pkg) => {
    const scopeKey = getPackageScopeKey(pkg);
    const scopeLabel = getPackageScopeLabel(scopeKey);
    const priority = isPriorityScope(scopeKey);
    const cardClass = priority
      ? 'card glass fade-up package-card-signature p-4 rounded-2xl flex gap-4 items-center'
      : 'card glass fade-up p-4 rounded-2xl flex gap-4 items-center';
    const badgeClass = priority
      ? 'scope-pill scope-pill-signature'
      : 'scope-pill';

    return `
    <div class="${cardClass}">
      <img src="${pkg.image}" alt="${pkg.name}" class="w-28 h-20 rounded-xl object-cover" />
      <div class="flex-1">
        <h3 class="text-lg font-semibold">${pkg.name}</h3>
        <p class="text-xs text-slate-500">${pkg.durationLabel || 'Route Package'} • ${getPackageTypeLabel(pkg)}</p>
        <p class="mt-1 text-xs text-slate-500 dark:text-slate-300">${getPackageItinerary(pkg).join(' → ')}</p>
        <div class="mt-2 flex items-center gap-2 text-sm">
          <span class="text-amber-400">★ ${pkg.rating}</span>
          <span class="${badgeClass}">${scopeLabel}</span>
          
        </div>
      </div>
      <div class="text-right">
        <p class="line-through text-xs text-slate-400">${formatPriceInr(Math.ceil(Number(pkg.price || 0) * 1.12))}</p>
        <p class="text-2xl font-bold">${formatPriceInr(pkg.price)}</p>
        <a href="package-details.html?id=${encodeURIComponent(pkg.id)}" class="mt-2 inline-flex px-3 py-1.5 bg-cyan-500 text-white rounded-md text-xs">View Details</a>
      </div>
    </div>
  `;
  }).join('');
  setupScrollReveal(container);
}

function setupPackageFilters() {
  const packageList = document.getElementById('packageList');
  if (!packageList) return;
  const packagePageData = siteData.packages || [];

  const priceRange = document.getElementById('priceRange');
  const priceValue = document.getElementById('priceValue');
  const typeFilterRoot = document.getElementById('packageTypeFilters');
  const scopeFilter = document.getElementById('scopeFilter');
  const signatureFilterRoot = document.getElementById('signatureFamilyFilters');
  const sortOptions = document.getElementById('sortOptions');

  if (typeFilterRoot) {
    const uniqueTypes = new Map();
    packagePageData.forEach((pkg) => {
      if (isPriorityScope(getPackageScopeKey(pkg))) return;
      const key = getPackageTypeKey(pkg);
      if (!uniqueTypes.has(key)) uniqueTypes.set(key, getPackageTypeLabel(pkg));
    });

    const chipsMarkup = [
      `<button class="filter-chip px-3 py-1 rounded-full border text-xs bg-cyan-500 text-white" data-filter="all">All</button>`,
      ...Array.from(uniqueTypes.entries()).map(([key, label]) => (
        `<button class="filter-chip px-3 py-1 rounded-full border text-xs" data-filter="${key}">${label}</button>`
      ))
    ];

    typeFilterRoot.innerHTML = chipsMarkup.join('');
    typeFilterRoot.querySelectorAll('.filter-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        typeFilterRoot.querySelectorAll('.filter-chip').forEach((current) => current.classList.remove('bg-cyan-500', 'text-white'));
        chip.classList.add('bg-cyan-500', 'text-white');
        renderPackagePageList();
      });
    });
  }

  if (priceRange && priceValue) {
    priceValue.textContent = Number(priceRange.value).toLocaleString('en-IN');
    priceRange.addEventListener('input', () => {
      priceValue.textContent = Number(priceRange.value).toLocaleString('en-IN');
      renderPackagePageList();
    });
  }

  if (scopeFilter) {
    scopeFilter.addEventListener('change', () => renderPackagePageList());
  }

  if (signatureFilterRoot && scopeFilter) {
    const signatureButtons = Array.from(signatureFilterRoot.querySelectorAll('[data-scope]'));
    const syncSignatureButtons = () => {
      const activeScope = scopeFilter.value;
      signatureButtons.forEach((button) => {
        button.classList.toggle('is-active', button.dataset.scope === activeScope);
      });
    };

    signatureButtons.forEach((button) => {
      button.addEventListener('click', () => {
        scopeFilter.value = button.dataset.scope || 'all';
        syncSignatureButtons();
        renderPackagePageList();
      });
    });

    scopeFilter.addEventListener('change', syncSignatureButtons);
    syncSignatureButtons();
  }

  if (sortOptions) {
    sortOptions.addEventListener('change', () => renderPackagePageList());
  }

  renderPackagePageList();
}

function renderPackageDetailsPage() {
  const titleElement = document.getElementById('detailTitle');
  if (!titleElement) return;

  const packages = siteData.packages || [];
  if (packages.length === 0) return;

  const params = new URLSearchParams(window.location.search);
  const requestedId = params.get('id');
  const selectedPackage = packages.find((pkg) => String(pkg.id) === String(requestedId)) || packages[0];
  const itinerary = getPackageItinerary(selectedPackage);
  const gallery = Array.isArray(selectedPackage.gallery) && selectedPackage.gallery.length > 0
    ? selectedPackage.gallery
    : [selectedPackage.image].filter(Boolean);

  const detailMainImage = document.getElementById('detailMainImage');
  if (detailMainImage && gallery[0]) {
    detailMainImage.src = gallery[0];
    detailMainImage.alt = selectedPackage.name;
  }

  const galleryThumbs = Array.from(document.querySelectorAll('[data-detail-thumb]'));
  galleryThumbs.forEach((thumb, index) => {
    const src = gallery[index + 1] || gallery[index] || selectedPackage.image || gallery[0];
    if (!src) return;
    thumb.src = src;
    thumb.alt = `${selectedPackage.name} view ${index + 1}`;
  });

  titleElement.textContent = selectedPackage.name;
  document.title = `Jizana | ${selectedPackage.name}`;

  const detailRating = document.getElementById('detailRating');
  if (detailRating) detailRating.textContent = `★ ${selectedPackage.rating || 4.8}`;

  const detailReviews = document.getElementById('detailReviews');
  if (detailReviews) detailReviews.textContent = `(${selectedPackage.reviews || 180} reviews)`;

  const detailBadgePrimary = document.getElementById('detailBadgePrimary');
  if (detailBadgePrimary) detailBadgePrimary.textContent = selectedPackage.durationLabel || getPackageTypeLabel(selectedPackage);

  const detailBadgeSecondary = document.getElementById('detailBadgeSecondary');
  if (detailBadgeSecondary) detailBadgeSecondary.textContent = getPackageScopeLabel(getPackageScopeKey(selectedPackage));

  const scopeKey = getPackageScopeKey(selectedPackage);
  const isPriority = isPriorityScope(scopeKey);

  const detailDescription = document.getElementById('detailDescription');
  if (detailDescription) detailDescription.textContent = selectedPackage.desc || `Itinerary route: ${selectedPackage.name}.`;

  const detailCollectionNote = document.getElementById('detailCollectionNote');
  if (detailCollectionNote) {
    if (isPriority) {
      detailCollectionNote.classList.remove('hidden');
      detailCollectionNote.innerHTML = `
        <p class="font-semibold">Signature Collection Route</p>
        <p class="mt-1">This package belongs to our priority collection with premium coordination and elevated experience flow.</p>
      `;
    } else {
      detailCollectionNote.classList.add('hidden');
      detailCollectionNote.innerHTML = '';
    }
  }

  const highlights = Array.isArray(selectedPackage.highlights) && selectedPackage.highlights.length > 0
    ? selectedPackage.highlights
    : [`${itinerary.length} location route coverage`, 'Comfort-first transport planning', 'Travel support throughout the trip'];

  const inclusions = Array.isArray(selectedPackage.includes) && selectedPackage.includes.length > 0
    ? selectedPackage.includes
    : ['Hotel stay', 'Route transfers', 'Sightseeing support', 'Travel coordinator'];

  const detailHighlights = document.getElementById('detailHighlights');
  if (detailHighlights) {
    detailHighlights.innerHTML = highlights.map((point) => `
      <li><i class="bi bi-check2-circle text-cyan-500"></i> ${point}</li>
    `).join('');
  }

  const detailInclusions = document.getElementById('detailInclusions');
  if (detailInclusions) {
    detailInclusions.innerHTML = inclusions.map((point) => `
      <li><i class="bi bi-check2-circle text-cyan-500"></i> ${point}</li>
    `).join('');
  }

  const detailItinerary = document.getElementById('detailItinerary');
  if (detailItinerary) {
    detailItinerary.innerHTML = itinerary.map((location, index) => `
      <div class="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
        <h4 class="font-semibold">Stop ${index + 1}: ${location}</h4>
        <p class="text-sm text-slate-600 dark:text-slate-300">Scenic route progression through ${location}.</p>
      </div>
    `).join('');
  }

  const packagePrice = Number(selectedPackage.price || 0);
  const oldPrice = Math.ceil(packagePrice * 1.15);
  const savings = oldPrice - packagePrice;

  const detailPrice = document.getElementById('detailPrice');
  if (detailPrice) detailPrice.textContent = formatPriceInr(packagePrice);

  const detailOldPrice = document.getElementById('detailOldPrice');
  if (detailOldPrice) detailOldPrice.textContent = formatPriceInr(oldPrice);

  const detailSavings = document.getElementById('detailSavings');
  if (detailSavings) detailSavings.textContent = `Save ${formatPriceInr(savings)} • Limited seats available`;

  const detailIncludesAside = document.getElementById('detailIncludesAside');
  if (detailIncludesAside) {
    detailIncludesAside.innerHTML = inclusions.slice(0, 4).map((point) => `<li>${point}</li>`).join('');
  }

  const detailPriceCard = document.getElementById('detailPriceCard');
  if (detailPriceCard) {
    detailPriceCard.classList.toggle('detail-price-signature', isPriority);
  }

  const detailSignaturePanel = document.getElementById('detailSignaturePanel');
  if (detailSignaturePanel) {
    if (isPriority) {
      detailSignaturePanel.classList.remove('hidden');
      detailSignaturePanel.innerHTML = `
        <p class="text-xs font-semibold uppercase tracking-[0.12em] text-cyan-700 dark:text-cyan-300">Priority Collection</p>
        <p class="mt-1 text-xs text-slate-600 dark:text-slate-300">Enhanced assistance, premium route orchestration, and top-tier support coverage.</p>
      `;
    } else {
      detailSignaturePanel.classList.add('hidden');
      detailSignaturePanel.innerHTML = '';
    }
  }

  const detailBookLink = document.getElementById('detailBookLink');
  if (detailBookLink) {
    const phoneRaw = (siteData.contact && siteData.contact.whatsapp) || DEFAULT_SITE_DATA.contact.whatsapp;
    const phoneDigits = digitsOnly(phoneRaw);
    const message = `Hi Jizana, I want to book this package: ${selectedPackage.name}`;
    if (phoneDigits) {
      detailBookLink.href = `https://wa.me/${phoneDigits}?text=${encodeURIComponent(message)}`;
      detailBookLink.target = '_blank';
      detailBookLink.rel = 'noopener noreferrer';
    }
  }
}

function setupCustomPlanWhatsapp() {
  const form = document.getElementById('customPlanForm');
  const button = document.getElementById('customPlanWhatsappBtn');
  const destinationInput = document.getElementById('customPlanDestination');
  const monthInput = document.getElementById('customPlanMonth');
  const budgetInput = document.getElementById('customPlanBudget');

  if (!form || !button || !destinationInput) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const destination = destinationInput.value.trim();
    const month = monthInput ? monthInput.value.trim() : '';
    const budget = budgetInput ? budgetInput.value.trim() : '';
    const phoneRaw = button.dataset.whatsapp || siteData.contact.whatsapp || DEFAULT_SITE_DATA.contact.whatsapp;
    const whatsappPhone = phoneRaw.replace(/\D/g, '');

    if (!destination || !whatsappPhone) return;

    const message = [
      'Hi Jizana, I want a custom travel plan.',
      `Destination: ${destination}`,
      `Travel Month: ${month || 'Not specified'}`,
      `Budget/Person: ${budget || 'Not specified'}`,
      'Please share the best available options.'
    ].join('\n');

    const whatsappURL = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`;
    const popup = window.open(whatsappURL, '_blank', 'noopener,noreferrer');
    if (!popup) window.location.href = whatsappURL;
  });
}

function setupTestimonialsSlider() {
  const track = document.getElementById('testimonialTrack');
  if (!track) return;

  const slides = Array.from(track.querySelectorAll('[data-testimonial-slide]'));
  const prevButton = document.getElementById('testimonialPrev');
  const nextButton = document.getElementById('testimonialNext');
  const dots = Array.from(document.querySelectorAll('[data-testimonial-dot]'));
  const sliderViewport = track.parentElement;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (slides.length === 0) return;

  let currentIndex = 0;
  let autoTimer = null;

  function updateDots() {
    dots.forEach((dot, index) => {
      const isActive = index === currentIndex;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-current', isActive ? 'true' : 'false');
    });
  }

  function goToSlide(index) {
    currentIndex = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    updateDots();
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  function stopAuto() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  function startAuto() {
    if (prefersReducedMotion) return;
    stopAuto();
    autoTimer = setInterval(nextSlide, 5000);
  }

  if (prevButton) prevButton.addEventListener('click', prevSlide);
  if (nextButton) nextButton.addEventListener('click', nextSlide);

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const target = Number(dot.dataset.testimonialDot || 0);
      goToSlide(target);
      startAuto();
    });
  });

  if (sliderViewport) {
    sliderViewport.addEventListener('mouseenter', stopAuto);
    sliderViewport.addEventListener('mouseleave', startAuto);
    sliderViewport.addEventListener('focusin', stopAuto);
    sliderViewport.addEventListener('focusout', startAuto);
  }

  goToSlide(0);
  startAuto();
}

const DEFAULT_GALLERY_IMAGES = [
  'assets/gallery/IMG_2266.JPG.jpeg',
  'assets/gallery/IMG_2267.JPG.jpeg',
  'assets/gallery/IMG_1930.JPG.jpeg',
  'assets/gallery/IMG_6922.JPG.jpeg',
  'assets/gallery/IMG_9714.JPG.jpeg',
  'assets/gallery/IMG_1244.JPG.jpeg',
  'assets/gallery/IMG_1651.JPG.jpeg',
  'assets/gallery/IMG_6565.JPG.jpeg',
  'assets/gallery/IMG_4915.JPG.jpeg',
  'assets/gallery/IMG_4914.JPG.jpeg',
  'assets/gallery/IMG_6622.JPG.jpeg',
  'assets/gallery/IMG_2637.JPG.jpeg',
  'assets/gallery/IMG_8786.JPG.jpeg',
  'assets/gallery/IMG_9717.JPG.jpeg',
  'assets/gallery/IMG_2068.JPG.jpeg',
  'assets/gallery/IMG_6915.JPG.jpeg',
  'assets/gallery/IMG_9748.JPG.jpeg',
  'assets/gallery/IMG_1928.JPG.jpeg',
  'assets/gallery/IMG_2072.JPG.jpeg',
  'assets/gallery/IMG_2648.JPG.jpeg',
  'assets/gallery/IMG_6919.JPG.jpeg',
  'assets/gallery/IMG_9612.JPG.jpeg'
];

const GALLERY_DIRECTORY = 'assets/gallery/';
const GALLERY_IMAGE_PATTERN = /\.(?:avif|webp|png|jpe?g|gif)$/i;

async function loadGalleryImages() {
  try {
    const response = await fetch(GALLERY_DIRECTORY, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Unable to read ${GALLERY_DIRECTORY}: ${response.status}`);

    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const galleryBase = new URL(GALLERY_DIRECTORY, window.location.href);
    const paths = Array.from(doc.querySelectorAll('a[href]'))
      .map((link) => link.getAttribute('href') || '')
      .filter((href) => GALLERY_IMAGE_PATTERN.test(href))
      .map((href) => new URL(href, galleryBase).pathname.split('/').pop())
      .filter(Boolean)
      .map((fileName) => `${GALLERY_DIRECTORY}${fileName}`);

    const uniquePaths = Array.from(new Set(paths));
    return uniquePaths.length > 0 ? uniquePaths : DEFAULT_GALLERY_IMAGES;
  } catch (error) {
    console.warn('Using fallback gallery image manifest:', error);
    return DEFAULT_GALLERY_IMAGES;
  }
}

function createGalleryAltText(imagePath, index) {
  const fileName = imagePath.split('/').pop() || '';
  const imageId = fileName.replace(/\.[^.]+$/, '').replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ');
  return `Travel gallery moment ${index + 1}${imageId ? ` - ${imageId}` : ''}`;
}

function setupGalleryLightbox(galleryImages) {
  const lightbox = document.getElementById('galleryLightbox');
  const image = document.getElementById('galleryLightboxImage');
  const counter = document.getElementById('galleryLightboxCounter');
  const closeButton = document.getElementById('galleryLightboxClose');
  const prevButton = document.getElementById('galleryLightboxPrev');
  const nextButton = document.getElementById('galleryLightboxNext');
  const closeTargets = Array.from(document.querySelectorAll('[data-gallery-close]'));

  if (!lightbox || !image || galleryImages.length === 0) return;

  let activeIndex = 0;
  let previousFocus = null;

  function updateLightboxImage() {
    const imagePath = galleryImages[activeIndex];
    image.src = imagePath;
    image.alt = createGalleryAltText(imagePath, activeIndex);
    if (counter) counter.textContent = `${activeIndex + 1} / ${galleryImages.length}`;
  }

  function openLightbox(index) {
    activeIndex = (index + galleryImages.length) % galleryImages.length;
    previousFocus = document.activeElement;
    updateLightboxImage();
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('gallery-lightbox-open');
    if (closeButton) closeButton.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('gallery-lightbox-open');
    image.removeAttribute('src');
    if (previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus();
  }

  function showNextImage() {
    activeIndex = (activeIndex + 1) % galleryImages.length;
    updateLightboxImage();
  }

  function showPreviousImage() {
    activeIndex = (activeIndex - 1 + galleryImages.length) % galleryImages.length;
    updateLightboxImage();
  }

  document.querySelectorAll('[data-gallery-lightbox-index]').forEach((button) => {
    button.addEventListener('click', () => {
      const index = Number(button.dataset.galleryLightboxIndex || 0);
      openLightbox(Number.isNaN(index) ? 0 : index);
    });
  });

  if (closeButton) closeButton.addEventListener('click', closeLightbox);
  if (prevButton) prevButton.addEventListener('click', showPreviousImage);
  if (nextButton) nextButton.addEventListener('click', showNextImage);
  closeTargets.forEach((target) => target.addEventListener('click', closeLightbox));

  document.addEventListener('keydown', (event) => {
    if (!lightbox.classList.contains('is-open')) return;

    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowRight') showNextImage();
    if (event.key === 'ArrowLeft') showPreviousImage();
  });
}

async function setupGallerySlider() {
  const track = document.getElementById('galleryTrack');
  const slider = document.querySelector('.gallery-swiper');
  if (!track || !slider) return;

  const galleryImages = await loadGalleryImages();
  if (galleryImages.length === 0) return;

  track.innerHTML = galleryImages.map((imagePath, index) => `
    <article class="swiper-slide gallery-slide">
      <figure class="gallery-card">
        <button type="button" class="gallery-lightbox-trigger" data-gallery-lightbox-index="${index}" aria-label="Open gallery image ${index + 1}">
          <img src="${imagePath}" alt="${createGalleryAltText(imagePath, index)}" loading="lazy" decoding="async">
        </button>
      </figure>
    </article>
  `).join('');

  setupGalleryLightbox(galleryImages);

  if (typeof Swiper !== 'function') {
    slider.classList.add('gallery-swiper-fallback');
    return;
  }

  const shouldReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  new Swiper(slider, {
    effect: 'coverflow',
    centeredSlides: true,
    grabCursor: true,
    initialSlide: Math.min(2, galleryImages.length - 1),
    loop: galleryImages.length > 3,
    speed: 760,
    slidesPerView: 'auto',
    spaceBetween: -44,
    coverflowEffect: {
      rotate: 0,
      stretch: 0,
      depth: 85,
      modifier: 0.9,
      slideShadows: false
    },
    autoplay: shouldReduceMotion ? false : {
      delay: 2700,
      disableOnInteraction: false,
      pauseOnMouseEnter: true
    },
    keyboard: {
      enabled: true
    },
    pagination: {
      el: '.gallery-pagination',
      clickable: true
    },
    navigation: {
      nextEl: '#galleryNext',
      prevEl: '#galleryPrev'
    },
    breakpoints: {
      640: {
        spaceBetween: -52
      },
      1024: {
        spaceBetween: -68
      }
    }
  });
}

function setupBackToTopButton() {
  if (document.getElementById('backToTopButton')) return;

  const button = document.createElement('button');
  button.id = 'backToTopButton';
  button.type = 'button';
  button.className = 'back-to-top-button';
  button.setAttribute('aria-label', 'Back to top');
  button.innerHTML = `
    <span class="back-to-top-ring" aria-hidden="true"></span>
    <span class="back-to-top-inner"><i class="bi bi-airplane-engines-fill back-to-top-icon"></i></span>
  `;

  document.body.appendChild(button);

  let rafId = null;

  function updateProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
    const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);
    const progress = maxScroll > 0 ? Math.min((scrollTop / maxScroll) * 100, 100) : 0;

    button.style.setProperty('--scroll-progress', `${progress}%`);
    button.classList.toggle('is-visible', scrollTop > 280);
    rafId = null;
  }

  function onScroll() {
    if (rafId !== null) return;
    rafId = window.requestAnimationFrame(updateProgress);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  updateProgress();
}

async function initApp() {
  initColorTheme();
  initTheme();
  setupHeaderScrollEffect();
  setupBackToTopButton();
  await loadSiteData();
  applySiteContactData();
  renderFeaturedPackages();
  renderDestinations();
  setupPackageFilters();
  renderPackageDetailsPage();
  setupCustomPlanWhatsapp();
  setupTestimonialsSlider();
  await setupGallerySlider();
  setupScrollReveal(document);
  window.addEventListener('scroll', queueRevealVisibleTargets, { passive: true });
  window.addEventListener('resize', queueRevealVisibleTargets, { passive: true });
  window.addEventListener('orientationchange', queueRevealVisibleTargets, { passive: true });
}

void initApp();

// Hero carousel
let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');
const heroDots = Array.from(document.querySelectorAll('[data-hero-dot]'));
const prevHero = document.getElementById('prevHero');
const nextHero = document.getElementById('nextHero');

function showSlide(index) {
  if (slides.length === 0) return;
  slides.forEach(slide => slide.classList.remove('active'));
  slides[index].classList.add('active');
  heroDots.forEach((dot, dotIndex) => {
    dot.classList.toggle('is-active', dotIndex === index);
  });
  currentSlide = index;
}

function nextSlide() {
  if (slides.length === 0) return;
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

function prevSlide() {
  if (slides.length === 0) return;
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(currentSlide);
}

if (prevHero && nextHero) {
  prevHero.addEventListener('click', prevSlide);
  nextHero.addEventListener('click', nextSlide);
}

heroDots.forEach((dot) => {
  dot.addEventListener('click', () => {
    const index = Number(dot.dataset.heroDot || 0);
    if (Number.isNaN(index)) return;
    showSlide((index + slides.length) % slides.length);
    startCarousel();
  });
});

// Auto cycle every 5 seconds with pause on hover
let carouselInterval = null;

function startCarousel() {
  if (slides.length < 2) return;
  if (carouselInterval) clearInterval(carouselInterval);
  carouselInterval = setInterval(nextSlide, 5000);
}

function stopCarousel() {
  if (carouselInterval) {
    clearInterval(carouselInterval);
    carouselInterval = null;
  }
}

const heroCarousel = document.getElementById('heroCarousel');
if (heroCarousel) {
  heroCarousel.addEventListener('mouseenter', stopCarousel);
  heroCarousel.addEventListener('mouseleave', startCarousel);
  heroCarousel.addEventListener('focusin', stopCarousel);
  heroCarousel.addEventListener('focusout', startCarousel);
}

// Initialize
if (slides.length > 0) {
  showSlide(0);
  startCarousel();
}

// Service Filter
const filterPills = document.querySelectorAll('.service-filter-pill');
const serviceCards = document.querySelectorAll('.service-card');

filterPills.forEach(pill => {
  pill.addEventListener('click', () => {
    const filter = pill.dataset.filter;

    // Update active pill
    filterPills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');

    // Filter cards
    serviceCards.forEach(card => {
      if (card.dataset.category === filter) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// Initialize with first filter active (transport)
const firstPill = filterPills[0];
if (firstPill) {
  const initialFilter = firstPill.dataset.filter;
  serviceCards.forEach(card => {
    if (card.dataset.category === initialFilter) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });
}
