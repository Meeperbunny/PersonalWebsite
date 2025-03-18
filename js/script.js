document.addEventListener('DOMContentLoaded', function() {
    // Navigation
    const navLinks = document.querySelectorAll('nav ul li a');
    const sections = document.querySelectorAll('main section');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and sections
            navLinks.forEach(link => link.parentElement.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked link and corresponding section
            const targetId = this.getAttribute('href').substring(1);
            this.parentElement.classList.add('active');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // Canvas animation - simple circle for now
    const canvas = document.getElementById('animationCanvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    canvas.width = 400;
    canvas.height = 400;
    
    function drawCircle() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw a simple circle
        ctx.beginPath();
        ctx.arc(200, 200, 50, 0, Math.PI * 2);
        ctx.fillStyle = '#61dafb';
        ctx.fill();
        ctx.closePath();
        
        requestAnimationFrame(drawCircle);
    }
    
    drawCircle();

    // Load and render blog posts
    loadBlogPosts();
});

// Function to load blog posts
async function loadBlogPosts() {
    try {
        const response = await fetch('blogs/index.json');
        const posts = await response.json();
        
        const blogPostsContainer = document.getElementById('blog-posts');
        
        posts.forEach(async post => {
            const postElement = document.createElement('div');
            postElement.className = 'blog-post';
            
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
        });
    } catch (error) {
        console.error('Error loading blog posts:', error);
        document.getElementById('blog-posts').innerHTML = '<p>Failed to load blog posts.</p>';
    }
}

// Sample projects (can be replaced with dynamic loading later)
document.addEventListener('DOMContentLoaded', function() {
    const projects = [
        {
            title: 'Sample Project 1',
            description: 'This is a sample project description.',
            link: '#'
        },
        {
            title: 'Sample Project 2',
            description: 'Another sample project description.',
            link: '#'
        }
    ];
    
    const projectsContainer = document.getElementById('projects-list');
    
    projects.forEach(project => {
        const projectElement = document.createElement('div');
        projectElement.className = 'project-card';
        
        projectElement.innerHTML = `
            <h2>${project.title}</h2>
            <p>${project.description}</p>
            <a href="${project.link}" target="_blank">View Project</a>
        `;
        
        projectsContainer.appendChild(projectElement);
    });
});
