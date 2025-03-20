// Common utility functions
function renderMarkdown(markdown) {
    return marked.parse(markdown);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Header Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
    // Responsive navigation
    const navLinks = document.querySelector('.nav-links');
    const menuToggle = document.createElement('div');
    menuToggle.classList.add('menu-toggle');
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    
    if (window.innerWidth <= 768) {
        document.querySelector('nav').appendChild(menuToggle);
        
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
});

// Bits section functionality
async function loadBits() {
    try {
        const response = await fetch('src/bits/index.json');
        const data = await response.json();
        const bits = data.bits; // Access the bits array from the wrapped object
        
        const bitsContainer = document.getElementById('bits-container');
        
        if (!bits || bits.length === 0) {
            bitsContainer.innerHTML = '<p class="no-content">No bits available yet. Check back soon!</p>';
            return;
        }
        
        // Sort bits by date (newest first)
        bits.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        bitsContainer.innerHTML = '';
        
        // Create and append each bit card individually
        bits.forEach(bit => {
            const bitCard = document.createElement('div');
            bitCard.className = 'bit-card';
            
            // Make the entire card clickable
            bitCard.addEventListener('click', function() {
                window.location.href = `bit.html?id=${bit.id}`;
            });
            
            bitCard.innerHTML = `
                <div class="card-content">
                    <div class="card-date">${formatDate(bit.date)}</div>
                    <h3 class="card-title">${bit.title}</h3>
                    <div class="card-excerpt">${bit.excerpt}</div>
                </div>
            `;
            
            bitsContainer.appendChild(bitCard);
        });
        
    } catch (error) {
        console.error('Error loading bits:', error);
        const bitsContainer = document.getElementById('bits-container');
        bitsContainer.innerHTML = '<p class="error">Failed to load bits. Please try again later.</p>';
    }
}

// Bytes section functionality
async function loadBytes() {
    try {
        const response = await fetch('src/bytes/index.json');
        const data = await response.json();
        const bytes = data.bytes; // Access the bytes array from the wrapped object
        
        const bytesContainer = document.getElementById('bytes-container');
        
        if (!bytes || bytes.length === 0) {
            bytesContainer.innerHTML = '<p class="no-content">No bytes available yet. Check back soon!</p>';
            return;
        }
        
        // Sort bytes by date (newest first)
        bytes.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        bytesContainer.innerHTML = '';
        
        // Create and append each byte card individually
        bytes.forEach(byte => {
            const byteCard = document.createElement('div');
            byteCard.className = 'byte-card';
            
            // Make the entire card clickable
            byteCard.addEventListener('click', function() {
                window.location.href = `byte.html?id=${byte.id}`;
            });
            
            byteCard.innerHTML = `
                <div class="card-content">
                    <div class="card-date">${formatDate(byte.date)}</div>
                    <h3 class="card-title">${byte.title}</h3>
                    <div class="card-excerpt">${byte.excerpt}</div>
                </div>
            `;
            
            bytesContainer.appendChild(byteCard);
        });
        
    } catch (error) {
        console.error('Error loading bytes:', error);
        const bytesContainer = document.getElementById('bytes-container');
        bytesContainer.innerHTML = '<p class="error">Failed to load bytes. Please try again later.</p>';
    }
}

// Single Bit page functionality
async function loadSingleBit() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const bitId = urlParams.get('id');
        
        if (!bitId) {
            document.getElementById('bit-content').innerHTML = '<p class="error">Bit not found.</p>';
            return;
        }
        
        const response = await fetch('src/bits/index.json');
        const data = await response.json();
        const bits = data.bits; // Access the bits array from the wrapped object
        
        const bit = bits.find(b => b.id === bitId);
        
        if (!bit) {
            document.getElementById('bit-content').innerHTML = '<p class="error">Bit not found.</p>';
            return;
        }
        
        // Fetch the actual content
        const contentResponse = await fetch(`src/bits/${bit.filename}`);
        const content = await contentResponse.text();
        
        // Process the markdown to remove the title if it's the first line
        let processedContent = content;
        const contentLines = content.split('\n');
        // If the first line starts with # and contains the title, remove it
        if (contentLines[0].startsWith('# ') && contentLines[0].includes(bit.title)) {
            processedContent = contentLines.slice(1).join('\n');
        }
        
        document.getElementById('bit-content').innerHTML = `
            <div class="post-header">
                <h1>${bit.title}</h1>
                <p class="post-date">${formatDate(bit.date)}</p>
            </div>
            <div class="post-content">
                ${renderMarkdown(processedContent)}
            </div>
        `;
        
        // Update document title
        document.title = `${bit.title} - Blog24`;
        
    } catch (error) {
        console.error('Error loading bit:', error);
        document.getElementById('bit-content').innerHTML = '<p class="error">Failed to load bit. Please try again later.</p>';
    }
}

// Single Byte page functionality
async function loadSingleByte() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const byteId = urlParams.get('id');
        
        if (!byteId) {
            document.getElementById('byte-content').innerHTML = '<p class="error">Byte not found.</p>';
            return;
        }
        
        const response = await fetch('src/bytes/index.json');
        const data = await response.json();
        const bytes = data.bytes; // Access the bytes array from the wrapped object
        
        const byte = bytes.find(b => b.id === byteId);
        
        if (!byte) {
            document.getElementById('byte-content').innerHTML = '<p class="error">Byte not found.</p>';
            return;
        }
        
        // Fetch the actual content
        const contentResponse = await fetch(`src/bytes/${byte.filename}`);
        const content = await contentResponse.text();
        
        // Process the markdown to remove the title if it's the first line
        let processedContent = content;
        const contentLines = content.split('\n');
        // If the first line starts with # and contains the title, remove it
        if (contentLines[0].startsWith('# ') && contentLines[0].includes(byte.title)) {
            processedContent = contentLines.slice(1).join('\n');
        }
        
        document.getElementById('byte-content').innerHTML = `
            <div class="post-header">
                <h1>${byte.title}</h1>
                <p class="post-date">${formatDate(byte.date)}</p>
            </div>
            <div class="post-content">
                ${renderMarkdown(processedContent)}
            </div>
        `;
        
        // Update document title
        document.title = `${byte.title} - Blog24`;
        
    } catch (error) {
        console.error('Error loading byte:', error);
        document.getElementById('byte-content').innerHTML = '<p class="error">Failed to load byte. Please try again later.</p>';
    }
}
