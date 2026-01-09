let portfolioItems = [];
let discographyItems = [];

const canvas = document.getElementById('cdCanvas');
const ctx = canvas.getContext('2d');
const thumbnailImg = document.getElementById('thumbnailImg');
const videoContainer = document.getElementById('videoContainer');
const youtubeModal = document.getElementById('youtubeModal');
const youtubePlayer = document.getElementById('youtubePlayer');
const modalClose = document.getElementById('modalClose');

let targetRotation = 0;
let currentRotation = 0;
let animationId;

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

// Find closest CD to top-left selection point
function findSelectedIndex() {
  const selectionAngle = Math.PI * 1.25; // Top-left (225 degrees + 180 = 405 degrees = 45 degrees from right or 1.25π)
  const angleStep = (Math.PI * 2) / portfolioItems.length;
  
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
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Smooth continuous rotation
  const rotationDiff = targetRotation - currentRotation;
  currentRotation += rotationDiff * 0.15;

  const centerX = canvas.width * 0.7;
  const centerY = canvas.height * 0.5;
  const radius = Math.min(canvas.width, canvas.height) * 0.35;
  const cdRadius = 120;
  const angleStep = (Math.PI * 2) / portfolioItems.length;
  
  // Determine which CD is selected (at bottom-left)
  const selectedIndex = findSelectedIndex();

  portfolioItems.forEach((item, index) => {
    const angle = (index * angleStep) + currentRotation;
    
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    
    // Calculate distance from top-left selection point (225 degrees)
    const selectionAngle = Math.PI * 1.25;
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
    updateContent(currentSelectedIndex);
  }

  animationId = requestAnimationFrame(render);
}

// Update content based on selected CD
function updateContent(index) {
  const portfolioTitle = document.getElementById('portfolioTitle');
  if (portfolioTitle) {
    portfolioTitle.textContent = portfolioItems[index].title;
  }
  thumbnailImg.src = `https://img.youtube.com/vi/${portfolioItems[index].id}/maxresdefault.jpg`;
}

// Scroll handling with freeform rotation - only on right side
const cdZone = document.getElementById('cdZone');

cdZone.addEventListener('wheel', (e) => {
  e.preventDefault();
  targetRotation += (e.deltaY * 0.002);
}, { passive: false });

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
      portfolioItems = data.videos;
    } else {
      // Fallback to default videos
      portfolioItems = window.dataService.getDefaultData().videos;
    }
    
    // Load discography
    if (data.discography && data.discography.length > 0) {
      discographyItems = data.discography;
      updateDiscography();
    }
    
    // Start rendering
    window.lastSelectedIndex = -1;
    updateContent(0);
    render();
  } catch (error) {
    console.error('Error initializing portfolio:', error);
    // Use default data on error
    const defaultData = window.dataService.getDefaultData();
    portfolioItems = defaultData.videos;
    discographyItems = defaultData.discography;
    updateDiscography();
    window.lastSelectedIndex = -1;
    updateContent(0);
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
