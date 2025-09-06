# 📝 Simple ToDo App

A modern, full-stack ToDo application built with TypeScript, Vite, and localStorage persistence. This project demonstrates spec-driven development (SDD) methodology with comprehensive testing and clean architecture.

![Todo App Screenshot](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite)
![Tests](https://img.shields.io/badge/Tests-106_passed-green)
![Build](https://img.shields.io/badge/Build-passing-brightgreen)

## ✨ Features

- ✅ **Create Tasks** - Add new tasks with descriptions (1-500 characters)
- ✅ **Complete Tasks** - Toggle task completion status with visual feedback
- ✅ **Delete Tasks** - Remove tasks you no longer need
- ✅ **Visual Status** - Clear distinction between completed and incomplete tasks
- ✅ **Data Persistence** - All tasks saved to localStorage automatically
- ✅ **Input Validation** - Prevents empty or whitespace-only tasks
- ✅ **Responsive Design** - Works on desktop and mobile devices
- ✅ **CLI Interface** - Command-line tools for programmatic task management
- ✅ **Export/Import** - Backup and restore your tasks

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- npm (comes with Node.js)

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/KitakatsuTed/specKitSample.git
   cd specKitSample
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:5173](http://localhost:5173)

That's it! 🎉 Your ToDo app should now be running locally.

## 🛠️ Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm test` | Run all tests (unit, integration, contract, performance) |
| `npm run lint` | Check code quality with ESLint |
| `npm run format` | Format code with Prettier |
| `npm run typecheck` | Run TypeScript type checking |

### Project Structure

```
├── src/
│   ├── cli/              # Command-line interface
│   ├── lib/              # Core libraries and utilities
│   ├── models/           # TypeScript interfaces and types
│   ├── services/         # Business logic and data services
│   ├── main.ts          # Application entry point
│   └── styles.css       # Global styles
├── tests/
│   ├── contract/        # API contract tests
│   ├── integration/     # UI integration tests
│   ├── unit/            # Unit tests
│   └── performance/     # Performance benchmarks
├── specs/               # Project specifications and documentation
└── public/              # Static assets
```

## 🧪 Testing

This project follows Test-Driven Development (TDD) with comprehensive test coverage:

```bash
# Run all tests
npm test

# Run specific test types
npm test -- tests/unit/
npm test -- tests/integration/
npm test -- tests/contract/
npm test -- tests/performance/
```

### Test Types

- **Contract Tests** - Validate API contracts and data schemas
- **Integration Tests** - Test user interactions and UI behavior
- **Unit Tests** - Test individual components and functions
- **Performance Tests** - Benchmark localStorage operations and UI responsiveness

## 💻 CLI Usage

The app includes a powerful command-line interface:

```bash
# List all tasks
node dist/cli/index.js list

# Create a new task
node dist/cli/index.js create "Buy groceries"

# Complete a task
node dist/cli/index.js complete <task-id>

# Delete a task
node dist/cli/index.js delete <task-id>

# Export tasks
node dist/cli/index.js export tasks.json

# Import tasks
node dist/cli/index.js import tasks.json
```

*Note: Build the project first with `npm run build` to use CLI commands.*

## 📱 Usage Guide

### Web Interface

1. **Adding Tasks**
   - Type your task in the input field
   - Press Enter or click "Add" button
   - Tasks are automatically saved

2. **Completing Tasks**
   - Click the checkbox next to any task
   - Completed tasks show with strikethrough text
   - Status persists across browser sessions

3. **Deleting Tasks**
   - Click the "Delete" button (❌) next to any task
   - Deletion is immediate and permanent

### Data Persistence

- All tasks are automatically saved to your browser's localStorage
- Data persists across browser sessions and page refreshes
- No server or internet connection required

## 🏗️ Architecture

This project follows **Spec-Driven Development (SDD)** methodology:

### Core Technologies

- **TypeScript 5.x** - Type-safe JavaScript with modern features
- **Vite** - Fast build tool and development server
- **Vitest** - Unit testing framework with great TypeScript support
- **localStorage** - Client-side data persistence
- **Vanilla JavaScript** - No heavy frameworks, just modern web APIs

### Design Principles

- **Library-First** - Every feature as a standalone, testable library
- **Test-First** - TDD with red-green-refactor cycle
- **Type Safety** - Comprehensive TypeScript coverage
- **Performance** - Optimized for handling 1000+ tasks efficiently
- **Accessibility** - ARIA labels and keyboard navigation support

## 🔧 Configuration

### Environment Setup

The app works out-of-the-box with no configuration needed. All settings use sensible defaults:

- **Task limit**: 500 characters per description
- **Storage**: localStorage with automatic serialization
- **Port**: 5173 (development), configurable via Vite
- **Build target**: ES2022 for modern browsers

### Customization

Key files for customization:

- `src/styles.css` - UI styling and themes
- `vite.config.ts` - Build and development settings
- `src/services/TaskService.ts` - Business logic and validation rules

## 🤝 Contributing

This project demonstrates spec-driven development practices. To contribute:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Write tests first** following TDD methodology
4. **Implement your feature**
5. **Ensure all tests pass** (`npm test`)
6. **Commit your changes** (`git commit -m 'Add amazing feature'`)
7. **Push to the branch** (`git push origin feature/amazing-feature`)
8. **Open a Pull Request**

## 📋 Requirements Implemented

This app implements all functional requirements:

- **FR-001**: ✅ Add new tasks with text descriptions
- **FR-002**: ✅ Display all tasks in readable list format
- **FR-003**: ✅ Mark tasks as complete/incomplete
- **FR-004**: ✅ Delete tasks from list
- **FR-005**: ✅ Visual distinction between complete/incomplete tasks
- **FR-006**: ✅ Prevent adding empty or whitespace-only tasks

## 🚀 Deployment

### Production Build

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment.

### Deployment Options

- **Vercel** - Zero-config deployment for Vite projects
- **Netlify** - Drag and drop the `dist/` folder
- **GitHub Pages** - Use the built files from `dist/`
- **Any static hosting** - Serve the `dist/` directory

Example for Vercel:
```bash
npm i -g vercel
vercel --prod
```

## 🐛 Troubleshooting

### Common Issues

**Development server won't start**
- Ensure Node.js v18+ is installed
- Delete `node_modules` and run `npm install`
- Check if port 5173 is already in use

**Tests failing**
- Run `npm run build` first for CLI tests
- Clear browser localStorage if integration tests fail
- Ensure no other Vite servers are running

**Build errors**
- Check TypeScript errors with `npm run typecheck`
- Verify all dependencies are installed
- Clear Vite cache: `rm -rf .vite`

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built using modern web technologies and best practices
- Follows accessibility guidelines for inclusive design
- Implements comprehensive testing strategies
- Demonstrates spec-driven development methodology

---

**Made with ❤️ using TypeScript and Vite**

For more information about the development process and specifications, see the `specs/001-todo/` directory.