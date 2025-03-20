# Blog24

A personal website featuring an About page, short-form "bits" content, and long-form "bytes" articles.

## Structure
- **About Page**: Home page with personal information and project portfolio
- **Bits**: Short, digestible pieces of information in markdown format
- **Bytes**: Longer-form content in markdown format

## Technologies
- HTML5, CSS3, JavaScript
- Markdown rendering using Marked.js
- Font Awesome for icons

## Running the Website

### Local Development
1. Clone or download this repository to your local machine.
2. To run the website locally, you can use any simple web server. Here are a few options:

#### Option 1: Using Python
If you have Python installed, navigate to the project directory in your terminal and run:

```bash
# Python 3
python -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080
```

#### Option 2: Using Node.js
If you have Node.js installed, you can use packages like `http-server`:

```bash
# Install http-server globally (if not already installed)
npm install -g http-server

# Run server
http-server -p 8080
```

#### Option 3: Using Visual Studio Code
If you're using Visual Studio Code, you can use the "Live Server" extension:
1. Install the "Live Server" extension from the Extensions marketplace
2. Right-click on `index.html` and select "Open with Live Server"

3. After starting the server, open your browser and navigate to:
   - http://localhost:8080

## Adding Content

### Adding a new Bit
1. Create a new markdown file in the `src/bits/` directory
2. Add the entry to `src/bits/index.json` with the appropriate metadata

### Adding a new Byte
1. Create a new markdown file in the `src/bytes/` directory
2. Add the entry to `src/bytes/index.json` with the appropriate metadata
