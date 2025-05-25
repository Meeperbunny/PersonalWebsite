class BezierCurve {
    constructor(index, total) {
        this.index = index;
        this.total = total;
        this.svg = document.querySelector('svg');
        this.path = null;
        
        // Define two base curves to interpolate between
        this.curveA = this.createBaseCurve(-0.4, 1.0);  // Top curve
        this.curveB = this.createBaseCurve(0.8, -0.1);  // Bottom curve
        
        this.init();
    }
    
    // Create a base curve with given y position multipliers
    createBaseCurve(startYMult, endYMult) {
        return (width, height) => {
            const verticalCenter = height * 0.8;
            const amplitude = height * 0.5;
            
            // Calculate mirrored x positions (flip around the center)
            const flipX = (x) => width - x; // Mirror x-coordinate around center
            
            return {
                start: { x: width * 1.2, y: verticalCenter * startYMult - 200 },
                control1: { 
                    x: flipX(width * 0.3), 
                    y: verticalCenter + amplitude * startYMult * 0.7 - 100
                },
                control2: { 
                    x: flipX(width * 0.4), 
                    y: verticalCenter + amplitude * endYMult * 0.6 + 100
                },
                end: { x: -width * 0.2, y: verticalCenter * endYMult }
            };
        };
    }
    
    // Linear interpolation between two points
    lerpPoint(a, b, t) {
        return {
            x: a.x + (b.x - a.x) * t,
            y: a.y + (b.y - a.y) * t
        };
    }
    
    init() {
        this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        this.path.setAttribute('fill', 'none');
        this.path.classList.add('bezier-curve');
        
        // Calculate color based on position
        const hue = (0 * 360 / this.total) * this.index;
        this.path.setAttribute('stroke', `hsl(${hue}, 80%, 60%)`);
        this.path.setAttribute('stroke-width', '1.5');
        this.path.setAttribute('stroke-linecap', 'round');
        this.path.setAttribute('opacity', '0.8');
        
        this.svg.appendChild(this.path);
        this.updateCurve();
    }
    
    updateCurve() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // Get the two base curves
        const curveA = this.curveA(width, height);
        const curveB = this.curveB(width, height);
        
        // Calculate interpolation factor (0 to 1)
        const t = this.total > 1 ? this.index / (this.total - 1) : 0.5;
        
        // Interpolate between the two curves
        const start = this.lerpPoint(curveA.start, curveB.start, t);
        const control1 = this.lerpPoint(curveA.control1, curveB.control1, t);
        const control2 = this.lerpPoint(curveA.control2, curveB.control2, t);
        const end = this.lerpPoint(curveA.end, curveB.end, t);
        
        // Create the path data
        const pathData = `
            M ${start.x},${start.y}
            C ${control1.x},${control1.y}
              ${control2.x},${control2.y}
              ${end.x},${end.y}
        `;
        
        this.path.setAttribute('d', pathData);
    }
}

// Global variable to track the active cursor
let activeCursor = null;

async function typeText(element, text, speed = 30, linkPhrases = []) {
    return new Promise((resolve) => {
        let i = 0;
        const cursor = document.createElement('span');
        cursor.className = 'typing-cursor';
        cursor.textContent = '|';
        
        // Remove any existing cursors from all lines
        const removeAllCursors = () => {
            const allCursors = document.querySelectorAll('.typing-cursor');
            allCursors.forEach(c => c.remove());
            activeCursor = null;
        };
        
        const type = () => {
            // Remove all cursors first
            removeAllCursors();
            
            if (i < text.length) {
                const currentText = text.substring(0, i + 1);
                
                // Apply special formatting for link phrases
                if (linkPhrases.length > 0) {
                    let formattedText = currentText;
                    
                    linkPhrases.forEach(phrase => {
                        const index = text.indexOf(phrase);
                        if (index > -1 && i >= index) {
                            const phraseEnd = Math.min(i + 1, index + phrase.length);
                            const visiblePhrase = text.substring(index, phraseEnd);
                            
                            formattedText = formattedText.replace(
                                visiblePhrase,
                                `<span style="color: #64b5f6;">${visiblePhrase}</span>`
                            );
                        }
                    });
                    
                    element.innerHTML = formattedText;
                } else {
                    element.textContent = currentText;
                }
                
                // Add cursor at the end of current line
                element.appendChild(cursor);
                activeCursor = cursor;
                
                i++;
                setTimeout(type, speed);
            } else {
                // Keep cursor at the end when done typing
                element.appendChild(cursor);
                activeCursor = cursor;
                resolve();
            }
        };
        type();
    });
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize bezier curves first
    const svg = document.querySelector('svg');
    const numberOfCurves = 18;
    const curves = [];
    
    for (let i = 0; i < numberOfCurves; i++) {
        curves.push(new BezierCurve(i, numberOfCurves));
    }

    // Start the animation loop
    let time = 0;
    let resizeTimeout;
    
    function handleResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
        
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            curves.forEach(curve => curve.updateCurve());
        }, 1000);
    }
    
    // Start the animation loop
    function animate() {
        time += 0.003;
        
        curves.forEach((curve, index) => {
            const phase = (index / curves.length) * Math.PI * 2;
            const waveOffset = Math.sin(time + phase) * 0.8 + 0.5;
            const t = (index + waveOffset) / curves.length;
            
            const curveA = curve.curveA(window.innerWidth, window.innerHeight);
            const curveB = curve.curveB(window.innerWidth, window.innerHeight);
            
            const start = curve.lerpPoint(curveA.start, curveB.start, t);
            const control1 = curve.lerpPoint(curveA.control1, curveB.control1, t);
            const control2 = curve.lerpPoint(curveA.control2, curveB.control2, t);
            const end = curve.lerpPoint(curveA.end, curveB.end, t);
            
            const pathData = `
                M ${start.x},${start.y}
                C ${control1.x},${control1.y}
                  ${control2.x},${control2.y}
                  ${end.x},${end.y}
            `;
            
            curve.path.setAttribute('d', pathData);
            const hue = (80 * t + index * 5) % 360;
            curve.path.setAttribute('stroke', `hsl(${hue}, 80%, 60%)`);
        });
        
        requestAnimationFrame(animate);
    }
    
    // Set up event listeners
    window.addEventListener('resize', handleResize);
    handleResize();
    animate();
    
    // Typing animation
    const nameLine = document.getElementById('name-line');
    const titleLine = document.getElementById('title-line');
    const interestsLine = document.getElementById('interests-line');
    
    // Text to type (without HTML for typing, we'll add it after)
    const nameText = 'ian mckibben.';
    const titleText = 'software engineer based in the san francisco bay area.';
    const interestsText = 'i enjoy competitive programming and writing.';
    
    // Start typing animation with faster speeds (about half the time)
    await typeText(nameLine, nameText, 30);  // Faster for name
    await new Promise(resolve => setTimeout(resolve, 120));  // Shorter pause
    await typeText(titleLine, titleText, 14);  // Faster for title
    await new Promise(resolve => setTimeout(resolve, 120));  // Shorter pause
    
    // Type the interests line with blue link text
    const interestsTextWithLinks = 'i enjoy competitive programming and writing.';
    const linkPhrases = ['competitive programming', 'writing'];
    
    await typeText(interestsLine, interestsTextWithLinks, 14, linkPhrases);  // Faster for interests
    
    // Remove all cursors first
    const allCursors = document.querySelectorAll('.typing-cursor');
    allCursors.forEach(c => c.remove());
    
    // Add the actual links after typing is done
    interestsLine.innerHTML = 'i enjoy <a href="https://codeforces.com/profile/Meeperbunny" target="_blank" rel="noopener noreferrer" class="link">competitive programming</a> and <a href="/blog" class="link">writing</a>.';
    
    // Add cursor at the end of the last line
    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    cursor.textContent = '|';
    interestsLine.appendChild(cursor);
    activeCursor = cursor;
});
