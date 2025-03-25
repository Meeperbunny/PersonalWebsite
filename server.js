const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const marked = require('marked');
const matter = require('gray-matter');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up static files directory
app.use(express.static(path.join(__dirname, 'public')));

// Function to read and parse markdown files
async function getMarkdownFiles(directory) {
  const files = await fs.readdir(directory);
  const markdownFiles = files.filter(file => file.endsWith('.md'));
  
  const contents = await Promise.all(
    markdownFiles.map(async file => {
      const fullPath = path.join(directory, file);
      const fileContent = await fs.readFile(fullPath, 'utf-8');
      const { content, data } = matter(fileContent);
      const html = marked.parse(content);
      return {
        slug: path.basename(file, '.md'),
        content: html,
        ...data
      };
    })
  );
  
  return contents;
}

// Routes
app.get('/', async (req, res) => {
  try {
    const aboutContent = await getMarkdownFiles(path.join(__dirname, 'content', 'about'));
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/about', async (req, res) => {
  try {
    const aboutContent = await getMarkdownFiles(path.join(__dirname, 'content', 'about'));
    res.json(aboutContent);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/side-quests', async (req, res) => {
  try {
    const sideQuestsContent = await getMarkdownFiles(path.join(__dirname, 'content', 'side-quests'));
    res.json(sideQuestsContent);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/thoughts', async (req, res) => {
  try {
    const thoughtsContent = await getMarkdownFiles(path.join(__dirname, 'content', 'thoughts'));
    res.json(thoughtsContent);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Serve HTML files for all routes
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/side-quests', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/thoughts', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
