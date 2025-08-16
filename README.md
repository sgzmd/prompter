# Prompter

A frontend-only web application that helps users generate structured prompts through a series of questions. Built with Vue.js 3 and Vite.

## Features

- **Real-time prompt generation** - See your XML prompt update as you type
- **Import existing prompts** - Paste and parse existing XML prompts
- **Smart suggestions** - Pre-filled role and constraint suggestions
- **Multiple output formats** - JSON, XML, HTML, Markdown, or Custom
- **Examples management** - Add multiple examples to your prompt
- **Download functionality** - Export your generated prompt as XML
- **Modern UI** - Clean, responsive design with dark theme

## Quick Start

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd prompter
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Development Scripts

The project includes convenient shell scripts for common development tasks:

### Development
```bash
./scripts/dev.sh
```
Starts the Vite development server with hot reload.

### Testing
```bash
./scripts/test.sh
```
Runs Vitest unit tests.

### Linting
```bash
./scripts/lint.sh
```
Runs ESLint to check code quality.

### Formatting
```bash
./scripts/format.sh
```
Runs Prettier to format code.

## Usage

### Creating a New Prompt

1. **Role**: Enter the role the AI should assume (e.g., "Expert Software Engineer")
2. **Goal**: Describe what you want to accomplish
3. **Constraints**: Add any limitations or requirements
4. **Output Format**: Choose from JSON, XML, HTML, Markdown, or Custom
5. **Examples**: Add example outputs to guide the AI

The XML prompt is generated automatically as you fill out the form.

### Importing an Existing Prompt

1. Paste your XML prompt in the import section
2. Click "Parse Prompt" to extract the components
3. The form will be populated with the parsed data
4. Edit as needed and see the updated prompt

### Downloading Your Prompt

Click the "Download XML" button to save your generated prompt as an XML file.

## Project Structure

```
prompter/
├── src/
│   ├── components/          # Vue components
│   │   ├── ImportPrompt.vue
│   │   ├── PromptForm.vue
│   │   └── PromptPreview.vue
│   ├── composables/         # Vue composables
│   │   ├── usePromptGenerator.js
│   │   └── useXmlFormatter.js
│   ├── utils/              # Utility functions
│   │   └── promptParser.js
│   ├── App.vue             # Main app component
│   ├── main.js             # App entry point
│   └── style.css           # Global styles
├── tests/                  # Unit tests
├── scripts/                # Development scripts
├── index.html              # HTML entry point
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
└── README.md               # This file
```

## Technologies Used

- **Vue.js 3** - Progressive JavaScript framework
- **Vite** - Fast build tool and dev server
- **xml2js** - XML parsing and formatting
- **prettier** - Code formatting
- **Vitest** - Unit testing
- **ESLint** - Code linting

## Testing

Run the test suite:
```bash
npm run test
```

Run tests with UI:
```bash
npm run test:ui
```

## Building for Production

```bash
npm run build
```

This creates a `dist` folder with optimized production files.

## Deployment

### Quick Deploy to Cloudflare Pages

```bash
npm run deploy
```

This will build and deploy your application to Cloudflare Pages.

### Manual Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions including:
- Manual upload to Cloudflare Pages
- Git integration for automatic deployments
- Custom domain setup
- Environment variables configuration

## License

MIT License 