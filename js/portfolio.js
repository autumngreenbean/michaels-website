let portfolioItems = [];
let discographyItems = [];

const canvas = document.getElementById('cdCanvas');
const ctx = canvas.getContext('2d');
const thumbnailImg = document.getElementById('thumbnailImg');
const videoContainer = document.getElementById('videoContainer');
const youtubeModal = document.getElementById('youtubeModal');
const youtubePlayer = document.getElementById('youtubePlayer');
const modalClose = document.getElementById('modalClose');
const mobileSelectorList = document.getElementById('mobileSelectorList');
const mobilePrevBtn = document.getElementById('mobilePrevBtn');
const mobileNextBtn = document.getElementById('mobileNextBtn');

let targetRotation = 0;
let currentRotation = 0;
let animationId;
let activeIndex = 0;
let swipeStartX = null;
let thumbnailRequestToken = 0;

const thumbnailCache = new Map();

const selectionAngle = Math.PI * 1.25;
const mobileSwipeThreshold = 45;
const thumbnailQualities = ['maxresdefault', 'sddefault', 'hqdefault', 'mqdefault', 'default'];

// Setup canvas
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Draw CD using styles from HTML
function drawCD(x, y, radius, isActive, opacity) {
  const styles = window.cdStyles;
  ctx.save();
  ctx.globalAlpha = opacity;

  // Modern solid transparent disc with blur
  ctx.filter = 'blur(1px)';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.29)';
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.filter = 'none';

  // Outer rim
  ctx.strokeStyle = isActive ? styles.rimActive : styles.rimNormal;
  ctx.lineWidth = isActive ? styles.rimWidthActive : styles.rimWidthNormal;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();

  // Center hole with depth
  ctx.beginPath();
  ctx.arc(x, y, radius * styles.holeSize, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
  ctx.fill();

  // Center hole rim
  ctx.strokeStyle = 'rgba(100, 100, 100, 0.5)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Subtle highlight
  ctx.globalAlpha = opacity * 0.3;
  const highlight = ctx.createRadialGradient(
    x - radius * 0.3, y - radius * 0.3, 0,
    x, y, radius * 0.6
  );
  highlight.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
  highlight.addColorStop(1, 'rgba(255, 255, 255, 0)');
  
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = highlight;
  ctx.fill();

  // Glow for active CD
  if (isActive) {
    ctx.globalAlpha = opacity;
    ctx.shadowBlur = styles.shadowBlur;
    ctx.shadowColor = styles.glowOuter;
    ctx.beginPath();
    ctx.arc(x, y, radius + 5, 0, Math.PI * 2);
    ctx.strokeStyle = styles.rimActive;
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  ctx.restore();
}

function getAngleStep() {
  return portfolioItems.length ? (Math.PI * 2) / portfolioItems.length : 0;
}

function normalizeIndex(index) {
  if (!portfolioItems.length) {
    return 0;
  }

  return (index % portfolioItems.length + portfolioItems.length) % portfolioItems.length;
}

function getRotationForIndex(index) {
  return selectionAngle - (normalizeIndex(index) * getAngleStep());
}

function extractYouTubeVideoId(input) {
  if (!input) {
    return '';
  }

  const rawValue = input.toString().trim();

  if (!rawValue) {
    return '';
  }

  const bareIdMatch = rawValue.match(/^[A-Za-z0-9_-]{11}/);
  if (bareIdMatch) {
    return bareIdMatch[0];
  }

  try {
    const normalizedUrl = rawValue.startsWith('http') ? rawValue : `https://${rawValue}`;
    const url = new URL(normalizedUrl);
    const host = url.hostname.replace(/^www\./, '');

    if (host === 'youtu.be') {
      return url.pathname.split('/').filter(Boolean)[0] || '';
    }

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      const queryId = url.searchParams.get('v');
      if (queryId) {
        return queryId;
      }

      const pathSegments = url.pathname.split('/').filter(Boolean);
      const shortsIndex = pathSegments.indexOf('shorts');
      if (shortsIndex >= 0 && pathSegments[shortsIndex + 1]) {
        return pathSegments[shortsIndex + 1];
      }

      const embedIndex = pathSegments.indexOf('embed');
      if (embedIndex >= 0 && pathSegments[embedIndex + 1]) {
        return pathSegments[embedIndex + 1];
      }
    }
  } catch (error) {
    console.warn('Unable to parse YouTube video input:', rawValue, error);
  }

  return rawValue.split('?')[0].split('&')[0].trim();
}

function normalizePortfolioItem(item) {
  const normalizedId = extractYouTubeVideoId(item.id);
  return {
    ...item,
    id: normalizedId
  };
}

function normalizePortfolioItems(items) {
  return items
    .map(normalizePortfolioItem)
    .filter((item) => item.id);
}

function getThumbnailUrl(videoId, quality) {
  return `https://i.ytimg.com/vi/${videoId}/${quality}.jpg`;
}

function isUsableThumbnail(image, quality) {
  if (!image.naturalWidth || !image.naturalHeight) {
    return false;
  }

  if (quality === 'maxresdefault' || quality === 'sddefault') {
    return image.naturalWidth > 120;
  }

  return true;
}

function probeThumbnail(videoId, quality) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      if (isUsableThumbnail(image, quality)) {
        resolve(getThumbnailUrl(videoId, quality));
        return;
      }

      reject(new Error(`Thumbnail quality unavailable: ${quality}`));
    };
    image.onerror = () => reject(new Error(`Thumbnail failed to load: ${quality}`));
    image.src = getThumbnailUrl(videoId, quality);
  });
}

async function resolveThumbnailUrl(videoId) {
  if (!videoId) {
    return '';
  }

  if (thumbnailCache.has(videoId)) {
    return thumbnailCache.get(videoId);
  }

  for (const quality of thumbnailQualities) {
    try {
      const thumbnailUrl = await probeThumbnail(videoId, quality);
      thumbnailCache.set(videoId, thumbnailUrl);
      return thumbnailUrl;
    } catch (error) {
      continue;
    }
  }

  const fallbackUrl = getThumbnailUrl(videoId, 'default');
  thumbnailCache.set(videoId, fallbackUrl);
  return fallbackUrl;
}

function selectIndex(index, immediate = false) {
  if (!portfolioItems.length) {
    return;
  }

  const normalizedIndex = normalizeIndex(index);
  activeIndex = normalizedIndex;
  targetRotation = getRotationForIndex(normalizedIndex);

  if (immediate) {
    currentRotation = targetRotation;
  }

  updateContent(normalizedIndex);
  updateMobileSelector(normalizedIndex);
}

// Find closest CD to top-left selection point
function findSelectedIndex() {
  if (!portfolioItems.length) {
    return 0;
  }

  const angleStep = getAngleStep();
  
  let minDiff = Infinity;
  let selectedIndex = 0;
  
  portfolioItems.forEach((item, index) => {
    const cdAngle = (index * angleStep) + currentRotation;
    const normalizedCdAngle = ((cdAngle % (Math.PI * 2)) + (Math.PI * 2)) % (Math.PI * 2);
    
    let diff = Math.abs(normalizedCdAngle - selectionAngle);
    if (diff > Math.PI) diff = (Math.PI * 2) - diff;
    
    if (diff < minDiff) {
      minDiff = diff;
      selectedIndex = index;
    }
  });
  
  return selectedIndex;
}

// Render CDs in radial pattern
function render() {
  if (!portfolioItems.length) {
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Smooth continuous rotation
  const rotationDiff = targetRotation - currentRotation;
  currentRotation += rotationDiff * 0.15;

  const centerX = canvas.width * 0.7;
  const centerY = canvas.height * 0.5;
  const radius = Math.min(canvas.width, canvas.height) * 0.35;
  const cdRadius = 120;
  const angleStep = getAngleStep();
  
  // Determine which CD is selected (at bottom-left)
  const selectedIndex = findSelectedIndex();

  portfolioItems.forEach((item, index) => {
    const angle = (index * angleStep) + currentRotation;
    
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    
    // Calculate distance from top-left selection point (225 degrees)
    const normalizedAngle = ((angle % (Math.PI * 2)) + (Math.PI * 2)) % (Math.PI * 2);
    let angleDiff = Math.abs(normalizedAngle - selectionAngle);
    if (angleDiff > Math.PI) angleDiff = (Math.PI * 2) - angleDiff;
    const normalizedDistance = angleDiff / Math.PI;
    
    const scale = Math.max(0.4, 1 - (normalizedDistance * 0.6));
    const opacity = Math.max(0.15, 1 - (normalizedDistance * 0.7));
    
    const isActive = index === selectedIndex;
    const adjustedRadius = cdRadius * scale * (isActive ? window.cdStyles.activeScale : 1);

    drawCD(x, y, adjustedRadius, isActive, opacity);

    // Draw label only for selected CD
    if (isActive && normalizedDistance < 0.15) {
      ctx.save();
      
      // Prepare text metrics first
      ctx.font = '16px Poppins';
      ctx.fontWeight = '300';
      const words = item.title.split(' ');
      const lines = [];
      let maxLineWidth = 0;
      let line = '';
      
      for (let word of words) {
        const testLine = line + word + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 300 && line !== '') {
          lines.push(line);
          maxLineWidth = Math.max(maxLineWidth, ctx.measureText(line).width);
          line = word + ' ';
        } else {
          line = testLine;
        }
      }
      lines.push(line);
      maxLineWidth = Math.max(maxLineWidth, ctx.measureText(line).width);
      
      // Calculate background dimensions (exact fit with vertical padding only)
      const lineHeight = 24;
      const paddingY = 12;
      const paddingX = 20; // Minimal horizontal padding
      const bgHeight = lines.length * lineHeight + paddingY * 2;
      const bgWidth = maxLineWidth + paddingX * 2;
      const bgX = x - adjustedRadius - 40 - bgWidth;
      const bgY = y - (bgHeight / 2);
      const borderRadius = 30; // More rounded
      
      // Draw rounded rectangle background with blur
      ctx.globalAlpha = opacity * 0.5;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.filter = 'blur(10px)';
      
      ctx.beginPath();
      ctx.roundRect(bgX, bgY, bgWidth, bgHeight, borderRadius);
      ctx.fill();
      
      // Draw solid background without blur
      ctx.filter = 'none';
      
      ctx.globalAlpha = opacity * 0.5;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      
      ctx.beginPath();
      ctx.roundRect(bgX, bgY, bgWidth, bgHeight, borderRadius);
      ctx.fill();
      
      // Draw text (brighter color)
      ctx.filter = 'none';
      ctx.globalAlpha = opacity;
      ctx.fillStyle = '#ffffffff'; // Brighter than #666
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      
      let lineY = bgY + paddingY;
      lines.forEach(textLine => {
        ctx.fillText(textLine.trim(), bgX + bgWidth / 2, lineY);
        lineY += lineHeight;
      });
      
      ctx.restore();
    }
  });

  // Update content if selection changed
  const currentSelectedIndex = findSelectedIndex();
  if (window.lastSelectedIndex !== currentSelectedIndex) {
    window.lastSelectedIndex = currentSelectedIndex;
    activeIndex = currentSelectedIndex;
    updateContent(currentSelectedIndex);
    updateMobileSelector(currentSelectedIndex);
  }

  animationId = requestAnimationFrame(render);
}

// Update content based on selected CD
async function updateContent(index) {
  if (!portfolioItems.length) {
    return;
  }

  const selectedItem = portfolioItems[index];

  const portfolioTitle = document.getElementById('portfolioTitle');
  if (portfolioTitle) {
    portfolioTitle.textContent = selectedItem.title;
  }

  const requestToken = ++thumbnailRequestToken;
  const thumbnailUrl = await resolveThumbnailUrl(selectedItem.id);

  if (requestToken !== thumbnailRequestToken) {
    return;
  }

  thumbnailImg.src = thumbnailUrl;
}

function updateMobileSelector(index) {
  if (!mobileSelectorList) {
    return;
  }

  const buttons = mobileSelectorList.querySelectorAll('.mobile-selector-item');
  buttons.forEach((button, buttonIndex) => {
    const isActive = buttonIndex === index;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', isActive ? 'true' : 'false');

    if (isActive) {
      button.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  });
}

function buildMobileSelector() {
  if (!mobileSelectorList) {
    return;
  }

  mobileSelectorList.innerHTML = '';

  portfolioItems.forEach((item, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'mobile-selector-item';
    button.textContent = item.title;
    button.setAttribute('aria-label', `Select video ${index + 1}: ${item.title}`);
    button.addEventListener('click', () => {
      selectIndex(index, true);
    });
    mobileSelectorList.appendChild(button);
  });

  updateMobileSelector(activeIndex);
}

function selectRelative(offset) {
  selectIndex(activeIndex + offset, true);
}

function handleSwipeStart(clientX) {
  swipeStartX = clientX;
}

function handleSwipeEnd(clientX) {
  if (swipeStartX === null) {
    return;
  }

  const deltaX = clientX - swipeStartX;
  swipeStartX = null;

  if (Math.abs(deltaX) < mobileSwipeThreshold) {
    return;
  }

  if (deltaX < 0) {
    selectRelative(1);
    return;
  }

  selectRelative(-1);
}

// Scroll handling with freeform rotation - only on right side
const cdZone = document.getElementById('cdZone');

cdZone.addEventListener('wheel', (e) => {
  e.preventDefault();
  targetRotation += (e.deltaY * 0.002);
}, { passive: false });

videoContainer.addEventListener('touchstart', (e) => {
  if (!e.touches.length) {
    return;
  }

  handleSwipeStart(e.touches[0].clientX);
}, { passive: true });

videoContainer.addEventListener('touchend', (e) => {
  if (!e.changedTouches.length) {
    return;
  }

  handleSwipeEnd(e.changedTouches[0].clientX);
}, { passive: true });

if (mobilePrevBtn) {
  mobilePrevBtn.addEventListener('click', () => {
    selectRelative(-1);
  });
}

if (mobileNextBtn) {
  mobileNextBtn.addEventListener('click', () => {
    selectRelative(1);
  });
}

// Video click
videoContainer.addEventListener('click', () => {
  const selectedIndex = findSelectedIndex();
  youtubeModal.classList.add('active');
  youtubePlayer.src = `https://www.youtube.com/embed/${portfolioItems[selectedIndex].id}?autoplay=1`;
});

// Modal close
function closeModal() {
  youtubeModal.classList.remove('active');
  youtubePlayer.src = '';
}

modalClose.addEventListener('click', closeModal);
youtubeModal.addEventListener('click', (e) => {
  if (e.target === youtubeModal) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// Initialize and load data
async function initializePortfolio() {
  try {
    const data = await window.dataService.getAllData();
    
    // Load videos
    if (data.videos && data.videos.length > 0) {
      portfolioItems = normalizePortfolioItems(data.videos);
    } else {
      // Fallback to default videos
      portfolioItems = normalizePortfolioItems(window.dataService.getDefaultData().videos);
    }
    
    // Load discography
    if (data.discography && data.discography.length > 0) {
      discographyItems = data.discography;
      updateDiscography();
    }

    buildMobileSelector();
    
    // Start rendering
    window.lastSelectedIndex = -1;
    selectIndex(0, true);
    render();
  } catch (error) {
    console.error('Error initializing portfolio:', error);
    // Use default data on error
    const defaultData = window.dataService.getDefaultData();
    portfolioItems = normalizePortfolioItems(defaultData.videos);
    discographyItems = defaultData.discography;
    updateDiscography();
    buildMobileSelector();
    window.lastSelectedIndex = -1;
    selectIndex(0, true);
    render();
  }
}

// Update discography section with data from Google Sheets
function updateDiscography() {
  const discographyList = document.querySelector('.discography-list');
  if (!discographyList || !discographyItems.length) return;
  
  discographyList.innerHTML = '';
  
  discographyItems.forEach(album => {
    const albumItem = document.createElement('div');
    albumItem.className = 'album-item';
    
    const title = document.createElement('div');
    title.className = 'album-title';
    title.textContent = album.title;
    
    const artist = document.createElement('div');
    artist.className = 'album-artist';
    artist.textContent = album.association || album.artist || '';
    
    const year = document.createElement('div');
    year.className = 'album-year';
    year.textContent = album.year;
    
    albumItem.appendChild(title);
    if (album.association || album.artist) {
      albumItem.appendChild(artist);
    }
    albumItem.appendChild(year);
    
    discographyList.appendChild(albumItem);
  });
}

// Initialize when page loads
initializePortfolio();
