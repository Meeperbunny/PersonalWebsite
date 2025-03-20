document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Navigation with smooth transitions
    const navLinks = document.querySelectorAll('nav ul li a');
    const sections = document.querySelectorAll('main section');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get current active section and target section
            const currentSection = document.querySelector('section.active');
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            // Only proceed if we're changing to a different section
            if (currentSection.id !== targetId) {
                // Remove active class from all links
                navLinks.forEach(link => link.parentElement.classList.remove('active'));
                
                // Add active class to clicked link
                this.parentElement.classList.add('active');
                
                // Fade out current section
                currentSection.style.opacity = '0';
                currentSection.style.transform = 'translateY(20px)';
                
                // After fade out animation completes, switch sections
                setTimeout(() => {
                    // Hide all sections
                    sections.forEach(section => {
                        section.classList.remove('active');
                        section.style.opacity = '0';
                        section.style.transform = 'translateY(20px)';
                    });
                    
                    // Show target section
                    targetSection.classList.add('active');
                    
                    // Force a reflow before starting the fade in animation
                    void targetSection.offsetWidth;
                    
                    // Fade in target section
                    setTimeout(() => {
                        targetSection.style.opacity = '1';
                        targetSection.style.transform = 'translateY(0)';
                    }, 50);
                }, 300);
            }
        });
    });

    // Advanced canvas animation - neon particle effect
    setupCanvasAnimation();
    
    // Load and render blog posts
    loadBlogPosts();
    
    // Load projects
    loadProjects();
});

// Advanced canvas animation
function setupCanvasAnimation() {
    const canvas = document.getElementById('animationCanvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions and make it responsive
    function resizeCanvas() {
        const container = canvas.parentElement;
        canvas.width = container.offsetWidth;
        canvas.height = 400;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Particle system
    const particles = [];
    const particleCount = 100;
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2 + 1,
            color: i % 3 === 0 ? '#0ff' : (i % 3 === 1 ? '#f0f' : '#0f0'),
            speed: Math.random() * 1 + 0.5,
            angle: Math.random() * Math.PI * 2,
            opacity: Math.random() * 0.5 + 0.5
        });
    }
    
    // Main circle properties
    const centerCircle = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 50,
        pulseSpeed: 0.02,
        pulseAmount: 10,
        rotation: 0,
        rotationSpeed: 0.005
    };
    
    // Animation loop
    function animate() {
        // Clear canvas with semi-transparent background for trails
        ctx.fillStyle = 'rgba(10, 10, 10, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw center circle with pulsating effect
        centerCircle.radius = 50 + Math.sin(Date.now() * 0.001) * centerCircle.pulseAmount;
        centerCircle.rotation += centerCircle.rotationSpeed;
        
        // Draw main circle
        ctx.save();
        ctx.translate(centerCircle.x, centerCircle.y);
        ctx.rotate(centerCircle.rotation);
        
        // Draw gradient circle
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, centerCircle.radius);
        gradient.addColorStop(0, 'rgba(0, 255, 255, 0.8)');
        gradient.addColorStop(0.5, 'rgba(255, 0, 255, 0.5)');
        gradient.addColorStop(1, 'rgba(0, 255, 0, 0)');
        
        ctx.beginPath();
        ctx.arc(0, 0, centerCircle.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Draw circle outline
        ctx.strokeStyle = '#0ff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw geometric pattern inside circle
        drawGeometricPattern(ctx, centerCircle.radius);
        
        ctx.restore();
        
        // Update and draw particles
        particles.forEach(particle => {
            // Move particles
            particle.x += Math.cos(particle.angle) * particle.speed;
            particle.y += Math.sin(particle.angle) * particle.speed;
            
            // Wrap particles around canvas edges
            if (particle.x < 0) particle.x = canvas.width;
            if (particle.x > canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = canvas.height;
            if (particle.y > canvas.height) particle.y = 0;
            
            // Calculate distance to center
            const dx = particle.x - centerCircle.x;
            const dy = particle.y - centerCircle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Particles are affected by the center circle's gravity
            if (distance < centerCircle.radius * 3) {
                const angle = Math.atan2(dy, dx);
                const force = 0.2 * (1 - distance / (centerCircle.radius * 3));
                particle.angle = angle + Math.PI + Math.random() * 0.5 - 0.25;
                particle.speed = Math.max(0.5, particle.speed + force);
            }
            
            // Draw particle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.globalAlpha = particle.opacity;
            ctx.fill();
            ctx.globalAlpha = 1;
        });
        
        requestAnimationFrame(animate);
    }
    
    // Function to draw geometric pattern inside the circle
    function drawGeometricPattern(ctx, radius) {
        const time = Date.now() * 0.001;
        
        // Draw hexagon
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = i * Math.PI / 3 + time * 0.1;
            const x = radius * 0.6 * Math.cos(angle);
            const y = radius * 0.6 * Math.sin(angle);
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.strokeStyle = '#f0f';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Draw triangle
        ctx.beginPath();
        for (let i = 0; i < 3; i++) {
            const angle = i * Math.PI * 2 / 3 - time * 0.2;
            const x = radius * 0.3 * Math.cos(angle);
            const y = radius * 0.3 * Math.sin(angle);
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.strokeStyle = '#0f0';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
    
    animate();
}

// Function to load blog posts with transitions
async function loadBlogPosts() {
    try {
        const response = await fetch('blogs/index.json');
        const posts = await response.json();
        
        const blogPostsContainer = document.getElementById('blog-posts');
        blogPostsContainer.innerHTML = '';
        
        // Ensure the marked library is ready
        if (typeof marked !== 'undefined') {
            // Set up markdown renderer options
            marked.setOptions({
                highlight: function(code, lang) {
                    return code;
                },
                breaks: true,
                gfm: true
            });
        }
        
        posts.forEach(async (post, index) => {
            const postElement = document.createElement('div');
            postElement.className = 'blog-post';
            postElement.style.opacity = '0';
            postElement.style.transform = 'translateY(20px)';
            
            try {
                const postResponse = await fetch(`blogs/${post.file}`);
                const postContent = await postResponse.text();
                
                const postHTML = `
                    <h2>${post.title}</h2>
                    <span class="date">${post.date}</span>
                    <div class="post-content">
                        ${marked.parse(postContent)}
                    </div>
                `;
                
                postElement.innerHTML = postHTML;
                blogPostsContainer.appendChild(postElement);
                
                // Animate post entry with delay based on index
                setTimeout(() => {
                    postElement.style.opacity = '1';
                    postElement.style.transform = 'translateY(0)';
                    postElement.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                }, 100 * index);
            } catch (error) {
                console.error(`Error loading blog post ${post.file}:`, error);
                postElement.innerHTML = `<h2>${post.title}</h2><p>Error loading post content.</p>`;
                blogPostsContainer.appendChild(postElement);
            }
        });
    } catch (error) {
        console.error('Error loading blog posts:', error);
        document.getElementById('blog-posts').innerHTML = '<p>Failed to load blog posts.</p>';
    }
}

// Function to load project data
function loadProjects() {
    const projects = [
        {
            title: 'Quantum Computing Simulator',
            description: 'A web-based quantum computing simulator that allows users to create and run quantum circuits in the browser.',
            link: '#',
            tech: ['JavaScript', 'WebGL', 'React']
        },
        {
            title: 'Neural Network Visualization',
            description: 'An interactive visualization of neural networks that helps users understand how deep learning models work.',
            link: '#',
            tech: ['Python', 'TensorFlow', 'D3.js']
        },
        {
            title: 'Decentralized Exchange',
            description: 'A decentralized cryptocurrency exchange built on blockchain technology with advanced security features.',
            link: '#',
            tech: ['Solidity', 'Web3.js', 'React']
        }
    ];
    
    const projectsContainer = document.getElementById('projects-list');
    projectsContainer.innerHTML = '';
    
    projects.forEach((project, index) => {
        const projectElement = document.createElement('div');
        projectElement.className = 'project-card';
        projectElement.style.opacity = '0';
        projectElement.style.transform = 'translateY(20px)';
        
        const techBadges = project.tech.map(tech => 
            `<span class="tech-badge">${tech}</span>`
        ).join('');
        
        projectElement.innerHTML = `
            <h2>${project.title}</h2>
            <p>${project.description}</p>
            <div class="tech-stack">
                ${techBadges}
            </div>
            <a href="${project.link}" target="_blank">View Project</a>
        `;
        
        projectsContainer.appendChild(projectElement);
        
        // Animate project entry with delay based on index
        setTimeout(() => {
            projectElement.style.opacity = '1';
            projectElement.style.transform = 'translateY(0)';
            projectElement.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        }, 100 * index);
    });
}
