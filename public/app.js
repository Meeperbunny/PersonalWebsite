document.addEventListener('DOMContentLoaded', () => {
    // Set up navigation
    const aboutLink = document.getElementById('about-link');
    const sideQuestsLink = document.getElementById('side-quests-link');
    const thoughtsLink = document.getElementById('thoughts-link');
    const contentDiv = document.getElementById('content');

    // Create footer with social icons on page load
    createFooterWithSocialIcons();

    // Set active nav link based on current path
    function setActiveLink() {
        const path = window.location.pathname;
        
        // Remove active class from all links
        aboutLink.classList.remove('active');
        sideQuestsLink.classList.remove('active');
        thoughtsLink.classList.remove('active');
        
        // Set active class based on path
        if (path === '/' || path === '/about') {
            aboutLink.classList.add('active');
            loadContent('about');
        } else if (path === '/side-quests') {
            sideQuestsLink.classList.add('active');
            loadContent('side-quests');
        } else if (path === '/thoughts') {
            thoughtsLink.classList.add('active');
            loadContent('thoughts');
        } else {
            // Default to about
            aboutLink.classList.add('active');
            loadContent('about');
        }
    }

    // Load content based on section
    async function loadContent(section) {
        try {
            contentDiv.innerHTML = '<div class="loader">Loading...</div>';
            
            const response = await fetch(`/api/${section}`);
            if (!response.ok) {
                throw new Error('Failed to fetch content');
            }
            
            const data = await response.json();
            
            // Clear the content
            contentDiv.innerHTML = '';
            
            if (data.length === 0) {
                contentDiv.innerHTML = `<h1>${formatTitle(section)}</h1><p>No content available yet.</p>`;
                return;
            }
            
            // Create a wrapper for the markdown content
            const wrapper = document.createElement('div');
            wrapper.className = 'markdown-content';
            
            // Add each markdown item to the page
            data.forEach(item => {
                const article = document.createElement('article');
                article.className = 'post-item';
                article.innerHTML = item.content;
                wrapper.appendChild(article);
            });
            
            contentDiv.appendChild(wrapper);
            
            // Make all external links open in new tab
            makeExternalLinksOpenInNewTab();
        } catch (error) {
            console.error('Error loading content:', error);
            contentDiv.innerHTML = `<h1>Error</h1><p>Failed to load content. Please try again later.</p>`;
        }
    }
    
    // Function to make all external links open in a new tab
    function makeExternalLinksOpenInNewTab() {
        const links = document.querySelectorAll('a');
        
        links.forEach(link => {
            const href = link.getAttribute('href');
            
            // Check if it's an external link (starts with http or https)
            if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
            }
        });
    }
    
    // Create footer with social icons for every page
    function createFooterWithSocialIcons() {
        // Check if footer already exists
        let footer = document.querySelector('footer');
        if (footer) {
            return; // Footer already exists, don't create a duplicate
        }
        
        // Create footer element
        footer = document.createElement('footer');
        footer.className = 'site-footer';
        
        // Create social icons container
        const socialIconsDiv = document.createElement('div');
        socialIconsDiv.className = 'social-icons';
        
        // X (Twitter) link
        const twitterLink = document.createElement('a');
        twitterLink.href = 'https://x.com/ian_mckibben';
        twitterLink.target = '_blank';
        twitterLink.rel = 'noopener noreferrer';
        twitterLink.className = 'social-icon';
        twitterLink.textContent = 'X';
        twitterLink.setAttribute('aria-label', 'X (Twitter)');
        
        // LinkedIn link
        const linkedinLink = document.createElement('a');
        linkedinLink.href = 'https://www.linkedin.com/in/ian-mckibben/';
        linkedinLink.target = '_blank';
        linkedinLink.rel = 'noopener noreferrer';
        linkedinLink.className = 'social-icon';
        linkedinLink.textContent = 'LinkedIn';
        linkedinLink.setAttribute('aria-label', 'LinkedIn');
        
        // Calendar/Talk with me link
        const talkLink = document.createElement('a');
        talkLink.href = 'https://calendly.com/mckibbenian/15-minute-chat';
        talkLink.target = '_blank';
        talkLink.rel = 'noopener noreferrer';
        talkLink.className = 'social-icon';
        talkLink.textContent = 'Chat';
        talkLink.setAttribute('aria-label', 'Schedule a Chat');
        
        // Email link
        const emailLink = document.createElement('a');
        emailLink.href = 'mailto:mckibb.ian@gmail.com';
        emailLink.className = 'social-icon';
        emailLink.textContent = 'Email';
        emailLink.setAttribute('aria-label', 'Email');
        
        // Append all icons to the container
        socialIconsDiv.appendChild(twitterLink);
        socialIconsDiv.appendChild(linkedinLink);
        socialIconsDiv.appendChild(talkLink);
        socialIconsDiv.appendChild(emailLink);
        
        // Create a wrapper to center the icons
        const centerWrapper = document.createElement('div');
        centerWrapper.className = 'center-wrapper';
        centerWrapper.appendChild(socialIconsDiv);
        
        // Append the center wrapper to the footer
        footer.appendChild(centerWrapper);
        
        // Add copyright text
        const copyrightDiv = document.createElement('div');
        copyrightDiv.className = 'copyright';
        const currentYear = new Date().getFullYear();
        copyrightDiv.textContent = ' ' + currentYear + ' Ian McKibben';
        footer.appendChild(copyrightDiv);
        
        // Append footer to the document
        document.body.appendChild(footer);
    }

    // Format section title
    function formatTitle(section) {
        return section.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    // Handle navigation without page refresh
    function handleNavigation() {
        const links = [aboutLink, sideQuestsLink, thoughtsLink];
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                
                // Update URL without reloading page
                window.history.pushState({}, '', href);
                
                // Update content based on new URL
                setActiveLink();
            });
        });
    }

    // Initialize
    setActiveLink();
    handleNavigation();

    // Handle back/forward browser buttons
    window.addEventListener('popstate', setActiveLink);
});
