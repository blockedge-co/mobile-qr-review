# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Mobile QR Review - A Next.js 15 application for carbon credit marketplace with QR-based review collection and project selection functionality.

## Development Workflow

### GitHub Flow Process

We follow GitHub flow for all development:

1. **Always create a branch** for any change (features, fixes, documentation)
2. **Push to origin** and open a Pull Request
3. **Use gh commands** to manage issues and PRs
4. **Automatic issue creation** for Tasks, Fixes, and Context updates

### Branch Naming Convention

```bash
# Features
feature/add-payment-integration
feature/implement-qr-scanner

# Bug fixes
fix/dropdown-selection-issue
fix/payment-validation-error

# Documentation/Context updates
context/update-api-documentation
context/add-deployment-guide
```

### Issue Management

Claude will automatically create GitHub issues using these types:

- **Task**: New features or enhancements
- **Fix**: Bug fixes or corrections
- **Context**: Documentation, configuration, or context updates

Example commands:
```bash
# Create a new task issue
gh issue create --title "Add payment confirmation email" --body "Implement email notification after successful payment" --label "Task"

# Create a fix issue
gh issue create --title "Fix dropdown menu overflow on mobile" --body "Dropdown menu extends beyond viewport on small screens" --label "Fix"

# Create a context issue
gh issue create --title "Document API integration process" --body "Add comprehensive documentation for third-party API integration" --label "Context"
```

### Pull Request Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: add your feature description"

# Push to origin
git push -u origin feature/your-feature-name

# Create PR with gh
gh pr create --title "feat: your feature" --body "Description of changes"
```

## Development Commands

```bash
# Install dependencies (use pnpm)
pnpm install

# Development
pnpm dev        # Start development server (http://localhost:3000)

# Production
pnpm build      # Build for production
pnpm start      # Start production server

# Code Quality
pnpm lint       # Run ESLint
pnpm typecheck  # Run TypeScript type checking (if available)
```

## Architecture & Patterns

### Tech Stack
- **Framework**: Next.js 15.2.4 with App Router
- **Language**: TypeScript 5 (strict mode)
- **UI Library**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Icons**: Lucide React
- **Forms**: react-hook-form with Zod validation
- **State Management**: React hooks and context (as needed)

### Key Architectural Decisions

1. **Component Structure**: All components use "use client" directive for client-side rendering
2. **Path Aliases**: Use `@/` prefix for imports (mapped to root directory)
3. **UI Components**: Located in `/components/ui/` - these are shadcn/ui components that shouldn't be modified directly
4. **Business Components**: Custom components follow semantic naming patterns
5. **Styling**: Use `cn()` utility from `/lib/utils` for className merging
6. **Error Handling**: Implement proper error boundaries and user feedback

### Project Structure
```
/app            # Next.js App Router pages
/components     # React components
  /ui           # shadcn/ui component library (don't modify)
  /landing      # Landing page components
  /payment      # Payment flow components
  /review       # Review system components
/hooks          # Custom React hooks
/lib            # Utilities and helpers
/public         # Static assets and images
/types          # TypeScript type definitions
```

## Important Configuration

### Build Settings (next.config.ts)
- TypeScript errors are ignored during builds (`ignoreBuildErrors: true`)
- ESLint errors are ignored during builds (`ignoreDuringBuilds: true`)
- Images are unoptimized (`unoptimized: true`)
- Consider enabling these checks for production

### TypeScript (tsconfig.json)
- Strict mode enabled
- Path alias: `@/*` → `"./*"`
- Target: ES2017

## Component Patterns

### Using shadcn/ui Components
```typescript
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
```

### Creating New Components
```typescript
"use client"

import { cn } from "@/lib/utils"

interface ComponentNameProps {
  className?: string
  // other props
}

export function ComponentName({ className, ...props }: ComponentNameProps) {
  return (
    <div className={cn("default-classes", className)} {...props}>
      {/* Component content */}
    </div>
  )
}
```

## Current Features

1. **Project Selection**: Dropdowns for Forest/Mangrove/Solar projects
2. **Duration Options**: 7/30/90 day carbon credit purchases
3. **Auto-renewal**: Toggle for subscription management
4. **Payment Integration**: Payment form with card details
5. **Google Reviews**: Embedded review section
6. **QR Code Integration**: (To be implemented) Mobile-friendly review collection

## Common Tasks

### Adding a New Page
Create a new directory under `/app` with a `page.tsx` file:
```typescript
export default function PageName() {
  return <div>Page content</div>
}
```

### Adding UI Components
Use shadcn/ui CLI or manually copy from documentation. Components should go in `/components/ui/`.

### Modifying Theme
Edit CSS variables in `/app/globals.css` under `:root` and `.dark` selectors.

## Code Style Guidelines

1. **Commit Messages**: Use conventional commits
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation
   - `style:` for formatting
   - `refactor:` for code restructuring
   - `test:` for tests
   - `chore:` for maintenance

2. **Code Organization**
   - Keep components small and focused
   - Extract reusable logic into hooks
   - Use TypeScript interfaces over types
   - Prefer composition over inheritance

3. **Testing** (when implemented)
   - Write tests for critical paths
   - Use React Testing Library
   - Mock external dependencies

4. **Performance**
   - Use React.memo for expensive components
   - Implement lazy loading for routes
   - Optimize images and assets

## Dependencies to Note

- **date-fns**: Date manipulation
- **recharts**: Data visualization
- **sonner**: Toast notifications
- **next-themes**: Dark mode support
- **embla-carousel**: Carousel functionality
- **react-hook-form**: Form management
- **zod**: Schema validation

## Security Considerations

1. Never commit sensitive data (API keys, secrets)
2. Validate all user inputs
3. Sanitize data before rendering
4. Use HTTPS for all external requests
5. Implement proper CORS policies

## Deployment Notes

- Build optimization flags are currently disabled
- Enable TypeScript and ESLint checks before production deployment
- Configure environment variables for production
- Set up proper error monitoring and logging

## Shortcode Commands

Claude supports these shortcode commands for specialized workflows:

### Session Management
- `/forward-context` - Save current conversation/context to GitHub issue
- `/new-session` - Fetch context from last issue/PR and summarize tasks
- `/compact` - Compress context before switching sessions
- `/nnn` - Start working on feature number nnn

### Development Modes
- `/frontend` - UI/UX focus with component design and accessibility
- `/backend` - API endpoints, database models, and business logic
- `/debug` - Analyze errors and suggest fixes
- `/perf` - Performance analysis and optimization

### Testing & Quality
- `/e2e` - Generate end-to-end test scenarios
- `/test` - Create unit tests for recent changes
- `/qa` - Generate QA checklists and test plans
- `/lint` - Fix linter errors and suggest configurations

### Documentation & Review
- `/doc` - Create/update documentation
- `/retrospective` - Write lessons learned
- `/security` - Security audit and vulnerability scan
- `/ux` - UX review with usability feedback

### Deployment
- `/deploy` - Generate CI/CD pipelines and release notes

## Important Reminders

- Always create a branch for new work
- Open PRs for all changes
- Create GitHub issues for tracking work
- Keep commits atomic and well-described
- Update this documentation as the project evolves
- Use shortcode commands to switch contexts and modes