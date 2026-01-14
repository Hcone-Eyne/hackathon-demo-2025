# Contributing to DBT Prototype

Thank you for your interest in contributing to DBT Prototype! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)

## Code of Conduct

By participating in this project, you agree to:

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Prioritize user security and privacy
- Follow project guidelines and standards

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Git
- Supabase account (for backend features)
- Code editor (VS Code recommended)

### Setup

1. **Fork the repository**
   - Click "Fork" on GitHub
   - Clone your fork locally

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env
   # Add your Supabase credentials
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

## Development Workflow

### Branching Strategy

- `main` - Production-ready code
- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation updates
- `refactor/*` - Code refactoring

### Making Changes

1. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clear, focused commits
   - Follow coding standards
   - Add tests for new features
   - Update documentation

3. **Test your changes**
   ```bash
   npm run test
   npm run test:coverage
   ```

4. **Commit your changes**
   ```bash
   git commit -m "feat: add new feature description"
   ```

### Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add bookmark sorting functionality
fix: resolve authentication redirect issue
docs: update installation instructions
refactor: optimize content caching logic
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Avoid `any` type - use proper typing
- Define interfaces for data structures
- Use enums for fixed sets of values

### React

- Use functional components with hooks
- Keep components small and focused
- Use proper prop types
- Implement error boundaries for error handling
- Optimize performance with `memo`, `useMemo`, `useCallback`

### Styling

- Use Tailwind CSS utility classes
- Follow the design system in `index.css`
- Use semantic color tokens (--primary, --secondary, etc.)
- Ensure responsive design (mobile-first)
- Test accessibility (keyboard navigation, screen readers)

### File Organization

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   ├── ComponentName.tsx
│   └── __tests__/       # Component tests
├── hooks/               # Custom hooks
├── utils/               # Utility functions
├── pages/               # Page components
└── contexts/            # React contexts
```

### Code Quality

- Run linter before committing
- Fix all TypeScript errors
- Ensure 80%+ test coverage for new code
- Write self-documenting code with clear names
- Add comments for complex logic

## Testing

### Writing Tests

- Write unit tests for utilities and hooks
- Write component tests for UI components
- Test user interactions and edge cases
- Mock external dependencies (Supabase, APIs)

### Test Structure

```typescript
describe('ComponentName', () => {
  it('should render correctly', () => {
    // Test implementation
  });

  it('should handle user interaction', () => {
    // Test implementation
  });
});
```

### Running Tests

```bash
# Run all tests
npm run test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch

# Run specific test file
npm run test src/components/__tests__/Button.test.tsx
```

## Pull Request Process

### Before Submitting

- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] New tests added for new features
- [ ] Documentation updated
- [ ] No console errors or warnings
- [ ] Tested on different screen sizes
- [ ] Accessibility checked

### Submitting PR

1. **Push your branch**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create Pull Request**
   - Use clear, descriptive title
   - Fill out PR template
   - Link related issues
   - Add screenshots/videos if UI changes

3. **PR Template**
   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Testing
   - [ ] Unit tests pass
   - [ ] Manual testing completed
   - [ ] Accessibility tested

   ## Screenshots
   (if applicable)
   ```

### Review Process

- Maintainers will review within 3-5 days
- Address feedback promptly
- Be open to suggestions
- Once approved, maintainer will merge

## Reporting Issues

### Bug Reports

Include:
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots/videos
- Browser/device information
- Console errors

### Feature Requests

Include:
- Clear use case
- Expected behavior
- Potential implementation approach
- Why it benefits users

### Security Issues

**DO NOT** report security issues publicly. Email security@yourcompany.com.

## Questions?

- Check existing issues and discussions
- Review documentation
- Ask in project discussions
- Contact maintainers

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation

Thank you for contributing! 🎉
