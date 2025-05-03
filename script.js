// Ambient animated background: dots and lines (complete graph)
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

const DOTS = 18;
const DOT_RADIUS = 4;
const LINE_WIDTH = 1.1;
const DOT_COLOR = '#3e4639'; // dark green
const LINE_COLOR = '#4c3b26'; // dark brown
const BG_COLOR = '#f9f7f3'; // cream
const DOT_SPEED = 0.35;

let width, height, dots;

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
}

function randomDot() {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * DOT_SPEED,
    vy: (Math.random() - 0.5) * DOT_SPEED,
  };
}

function initDots() {
  dots = [];
  for (let i = 0; i < DOTS; i++) {
    dots.push(randomDot());
  }
}

function updateDots() {
  for (const dot of dots) {
    dot.x += dot.vx;
    dot.y += dot.vy;
    if (dot.x < 0 || dot.x > width) dot.vx *= -1;
    if (dot.y < 0 || dot.y > height) dot.vy *= -1;
    dot.x = Math.max(0, Math.min(dot.x, width));
    dot.y = Math.max(0, Math.min(dot.y, height));
  }
}

function draw() {
  ctx.clearRect(0, 0, width, height);
  // Draw lines between every pair
  ctx.save();
  ctx.globalAlpha = 0.16;
  ctx.strokeStyle = LINE_COLOR;
  ctx.lineWidth = LINE_WIDTH;
  for (let i = 0; i < dots.length; i++) {
    for (let j = i + 1; j < dots.length; j++) {
      ctx.beginPath();
      ctx.moveTo(dots[i].x, dots[i].y);
      ctx.lineTo(dots[j].x, dots[j].y);
      ctx.stroke();
    }
  }
  ctx.restore();
  // Draw dots
  ctx.fillStyle = DOT_COLOR;
  for (const dot of dots) {
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, DOT_RADIUS, 0, 2 * Math.PI);
    ctx.fill();
  }
}

function animate() {
  updateDots();
  draw();
  requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
  resize();
  initDots();
});

resize();
initDots();
animate();

// Markdown rendering
fetch('content.md')
  .then(resp => resp.text())
  .then(md => {
    document.getElementById('markdown-content').innerHTML = marked.parse(md);
  });
