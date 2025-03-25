# Personal Website

A minimalist, professional personal website with a japandi-inspired design theme. The content is managed through simple Markdown files that you can easily edit.

## Features

- Minimalist design with japandi color theme
- Content managed through Markdown files
- Responsive layout
- Three main sections: About, Side Quests, and Thoughts

## How to Edit Content

All content is stored in Markdown (.md) files in the `content` directory:

- `content/about/` - Contains your about page content
- `content/side-quests/` - Contains your projects/side quests
- `content/thoughts/` - Contains your blog posts/thoughts

### Editing Markdown Files

1. Navigate to the appropriate directory for the content you want to edit
2. Edit the existing .md files or create new ones
3. Save the file
4. The website will automatically display your updated content

### Markdown Formatting

You can use standard Markdown syntax in your files:

```
# Heading 1
## Heading 2
### Heading 3

**Bold text**
*Italic text*

- Bullet point 1
- Bullet point 2

1. Numbered list item 1
2. Numbered list item 2

[Link text](https://example.com)

![Image alt text](path/to/image.jpg)
```

## Running the Website

1. Install dependencies:
   ```
   npm install
   ```

2. Start the server:
   ```
   npm start
   ```

3. Visit `http://localhost:8000` in your browser

## Project Structure

```
├── content/               # Markdown content
│   ├── about/             # About page content
│   ├── side-quests/       # Projects content
│   └── thoughts/          # Blog posts content
├── public/                # Static files
│   ├── index.html         # Main HTML template
│   ├── styles.css         # CSS styles
│   └── app.js             # Client-side JavaScript
├── server.js              # Express server for rendering content
└── package.json           # Project dependencies
```

## Design Details

- Background: Cream color (#f5f2e9)
- Text: Rich brown color (#3b2a1f)
- Accents: Dark green (#3a5a40)
- Font: Arvo from Google Fonts