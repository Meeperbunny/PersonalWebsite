// src/main.js

import Matter from 'matter-js';
import { marked } from 'marked';

const {
  Engine,
  World,
  Bodies,
  Body,
  Runner,
  Mouse,
  MouseConstraint,
  Events
} = Matter;

// -------------------- Custom Link Renderer --------------------
// This forces all markdown links to open in a new tab.
const renderer = new marked.Renderer();
renderer.link = function (href, title, text) {
  return `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`;
};

// -------------------- Helper Functions --------------------

// Extract an optional RADIUS parameter from the top of the markdown.
// e.g., "RADIUS: 150" or "RADIUS: 20%"
function extractRadius(markdown) {
  const regex = /^RADIUS:\s*([\d.]+%?)(?:px)?\s*\n/i;
  const match = markdown.match(regex);
  if (match) {
    const radiusSpec = match[1];
    return { radiusSpec, markdown: markdown.replace(regex, '') };
  }
  return { radiusSpec: null, markdown };
}

// Put this near the top of main.js, outside of any function
const pastelColors = [
"#FF204E",
"#A0153E",
"#5D0E41",
"#00224D",
  ];

// Extract an optional POSITION parameter from the top of the markdown.
// e.g., "POSITION: 50% 40%" or "POSITION: 200 150"
function extractPosition(markdown) {
  const regex = /^POSITION:\s*([\d.]+%?)\s+([\d.]+%?)(?:px)?\s*\n/i;
  const match = markdown.match(regex);
  if (match) {
    const positionSpec = [match[1], match[2]];
    return { positionSpec, markdown: markdown.replace(regex, '') };
  }
  return { positionSpec: null, markdown };
}

// Compute a radius (in pixels) given a radiusSpec.
// For percent-based values, we interpret the spec as the bubble’s diameter is that percentage of the window width.
function computeRadius(radiusSpec, w, h, defaultPx = 100) {
  if (!radiusSpec) return defaultPx;
  if (radiusSpec.endsWith('%')) {
    const percentVal = parseFloat(radiusSpec);
    const diameter = (percentVal / 100) * w;
    return diameter / 2;
  }
  return parseFloat(radiusSpec);
}

// Parse a positionSpec (array of two strings) into absolute x,y coordinates.
function parsePosition(positionSpec, w, h) {
  let [xStr, yStr] = positionSpec;
  let x = xStr.endsWith('%') ? (parseFloat(xStr) / 100) * w : parseFloat(xStr);
  let y = yStr.endsWith('%') ? (parseFloat(yStr) / 100) * h : parseFloat(yStr);
  return { x, y };
}

// Returns a random non-colliding position for a new bubble with the given radius.
function getRandomNonCollidingPosition(newRadius) {
  const maxAttempts = 100;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const x = Math.random() * (window.innerWidth - newRadius * 2);
    const y = Math.random() * (window.innerHeight - newRadius * 2);
    let collides = false;
    for (const bp of bubblesPositions) {
      const dx = (x + newRadius) - bp.x;
      const dy = (y + newRadius) - bp.y;
      if (Math.sqrt(dx * dx + dy * dy) < (newRadius + bp.radius)) {
        collides = true;
        break;
      }
    }
    if (!collides) return { x, y };
  }
  return { x: Math.random() * (window.innerWidth - newRadius * 2), y: Math.random() * (window.innerHeight - newRadius * 2) };
}

// -------------------- Global Storage --------------------

const bubblesData = [];      // Array of { body, elem, radiusSpec, currentRadius, fractionX, fractionY }
const bubblesPositions = []; // Array of { x, y, radius } for collision checking

// -------------------- Engine & Runner Setup --------------------

const engine = Engine.create();
engine.world.gravity.x = 0;
engine.world.gravity.y = 0;
const runner = Runner.create();
Runner.run(runner, engine);

// -------------------- Mouse Constraint Setup --------------------

const mouse = Mouse.create(document.body);
const mouseConstraint = MouseConstraint.create(engine, {
  mouse,
  constraint: {
    stiffness: 0.2,
    render: { visible: false }
    // Allow default attachment so dragging follows the cursor delta.
  }
});
World.add(engine.world, mouseConstraint);

// On startdrag, set the bubble's velocity to zero.
Events.on(mouseConstraint, 'startdrag', (event) => {
  if (event.body) {
    Body.setVelocity(event.body, { x: 0, y: 0 });
  }
});

// -------------------- Update DOM Positions --------------------

Events.on(engine, 'afterUpdate', () => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  bubblesData.forEach((data) => {
    const { body, elem } = data;
    const { x, y } = body.position;
    const rect = elem.getBoundingClientRect();
    elem.style.left = `${x - rect.width / 2}px`;
    elem.style.top = `${y - rect.height / 2}px`;
    data.fractionX = x / w;
    data.fractionY = y / h;
  });
});

// -------------------- Boundary Walls --------------------

function addScreenBoundaries() {
  const thickness = 50;
  const w = window.innerWidth;
  const h = window.innerHeight;
  const opts = { isStatic: true, restitution: 1, friction: 0 };
  const walls = [
    Bodies.rectangle(w / 2, -thickness / 2, w, thickness, opts),
    Bodies.rectangle(w / 2, h + thickness / 2, w, thickness, opts),
    Bodies.rectangle(-thickness / 2, h / 2, thickness, h, opts),
    Bodies.rectangle(w + thickness / 2, h / 2, thickness, h, opts)
  ];
  World.add(engine.world, walls);
}
addScreenBoundaries();

// On window resize, re-scale each bubble accordingly.
window.addEventListener('resize', () => {
  World.clear(engine.world, false);
  World.add(engine.world, mouseConstraint);
  addScreenBoundaries();
  const newW = window.innerWidth;
  const newH = window.innerHeight;
  bubblesData.forEach((data) => {
    const oldRadius = data.currentRadius;
    const newRadius = computeRadius(data.radiusSpec, newW, newH, 100);
    const scaleRatio = newRadius / oldRadius;
    Body.scale(data.body, scaleRatio, scaleRatio);
    data.currentRadius = newRadius;
    const newX = data.fractionX * newW;
    const newY = data.fractionY * newH;
    Body.setPosition(data.body, { x: newX, y: newY });
    const diameter = newRadius * 2;
    data.elem.style.width = `${diameter}px`;
    data.elem.style.height = `${diameter}px`;
  });
});

// -------------------- Bubble Markdown Strings --------------------
// The Markdown strings can have optional RADIUS and POSITION parameters.
// The LinkedIn bubble now renders an icon with a non-transparent border.
const bubbleMarkdowns = [
  `RADIUS: 14%
POSITION: 40% 40%
# Welcome to my website!`,

  `RADIUS: 130
POSITION: 200 150
## Competitive Programming
### [Codeforces Profile](https://codeforces.com/profile/Meeperbunny)
### [LeetCode Profile](https://leetcode.com/u/iamc7054/)`,

`RADIUS: 75
POSITION: 25% 75%
## <a href="https://www.linkedin.com/in/ian-mckibben/" target="_blank" rel="noopener noreferrer" style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%;">
  <div style="border: 1px solid #000; border-radius: 6px; padding: 8px; margin-top: -35px;">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"
         style="width: 32px; height: 32px; fill: #000000;">
      <path d="M100.28 448H7.4V148.9h92.88zm-46.44-338a53.7 53.7 0 1 1 53.7-53.7 53.7 53.7 0 0 1-53.7 53.7zm394.14 338h-92.68V302.4c0-34.7-12.45-58.4-43.51-58.4-23.7 0-37.8 16-44 31.4-2.3 5.5-2.8 13.2-2.8 21v151.6h-92.7s1.24-246 0-271.1h92.7v38.4c-.19.3-.44.6-.63.9h.63v-.9c12.3-18.8 34.3-45.7 83.4-45.7 60.9 0 106.6 39.8 106.6 125.4z"/>
    </svg>
  </div>
</a>`

,


`RADIUS: 140
POSITION: 75% 60%

## Favorite Stationary
### Notebook: [Kokuyo 8S5-D](https://www.kokuyo-st.co.jp/en/search/m_detail.php?seihin_sikibetu=1&ss1=07&ss2=07A0&sid=100120530&pgmax=20)
### Pens: [Kokuyo 8S5-D](https://www.monotaro.com/p/5533/0267/?cq_med=pla&cq_plt=gp&utm_medium=cpc&utm_source=google&utm_campaign=246-833-4061_6466659573_shopping&utm_content=96539050923&utm_term=_419857551521_x_pla-879055535975&utm_id=55330267&gad_source=1&gbraid=0AAAAADNqOHAhxAkL3XU5RmCODbXscg5ZI&gclid=Cj0KCQjwh_i_BhCzARIsANimeoHAmBzL0Q6T__1Lh5RPvP4suOKTIJ1cYH0Dcn00xy2Cj5iHCvwiJ4AaAmUXEALw_wcB)`,
`RADIUS: 125
POSITION: 55% 22%

# Top Artists
### Bon Iver
### Hippo Campus
### The 1975
`,
];

// -------------------- Bubble Creation --------------------

function createBubble(markdownText, x, y) {
  // Extract the optional RADIUS parameter.
  let res = extractRadius(markdownText);
  let radiusSpec = res.radiusSpec;
  let mdAfterRadius = res.markdown;
  // Extract the optional POSITION parameter.
  let posRes = extractPosition(mdAfterRadius);
  let positionSpec = posRes.positionSpec;
  let finalMarkdown = posRes.markdown;
  
  const htmlContent = marked(finalMarkdown, { renderer: renderer });
  
  const bubbleElem = document.createElement('div');
  bubbleElem.classList.add('bubble');
  
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const computedRadius = computeRadius(radiusSpec, windowWidth, windowHeight, 100);
  const diameter = computedRadius * 2;
  bubbleElem.style.width = `${diameter}px`;
  bubbleElem.style.height = `${diameter}px`;
  
  // Set a pastel radial gradient background with a thin border.
  const pastel = pastelColors[Math.floor(Math.random() * pastelColors.length)];
  bubbleElem.style.background = `radial-gradient(circle, rgba(255,255,255,0.85) 30%, ${pastel} 140%)`;

  const contentContainer = document.createElement('div');
  contentContainer.classList.add('bubble-content');
  contentContainer.innerHTML = htmlContent;
  bubbleElem.appendChild(contentContainer);
  document.body.appendChild(bubbleElem);
  
  requestAnimationFrame(() => {
    const finalSize = computedRadius * 2;
    const finalRadius = finalSize / 2;
    let pos;
    if (positionSpec) {
      pos = parsePosition(positionSpec, windowWidth, windowHeight);
    } else {
      pos = getRandomNonCollidingPosition(finalRadius);
    }
    
    const body = Bodies.circle(
      pos.x + finalRadius,
      pos.y + finalRadius,
      finalRadius,
      {
        restitution: 0.8,
        friction: 0.01,
        frictionAir: 0.005
      }
    );
    World.add(engine.world, body);
    Body.setVelocity(body, {
      x: (Math.random() - 0.5) * 2,
      y: (Math.random() - 0.5) * 2
    });
    
    bubblesData.push({
      body,
      elem: bubbleElem,
      radiusSpec,
      currentRadius: finalRadius,
      fractionX: body.position.x / windowWidth,
      fractionY: body.position.y / windowHeight
    });
    bubblesPositions.push({ x: pos.x + finalRadius, y: pos.y + finalRadius, radius: finalRadius });
  });
}

bubbleMarkdowns.forEach((md) => {
  createBubble(md, 0, 0);
});
