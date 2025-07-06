# Shortcode Usage Guide

This guide provides practical examples for using Claude's shortcode commands in the Mobile QR Review project.

## Workflow Examples

### Starting a New Feature

```bash
# 1. Save current context before switching
/forward-context

# 2. Start new session and fetch context
/new-session

# 3. Work on specific feature
/42  # Start working on issue #42
```

### Frontend Development Session

```bash
# Switch to frontend mode
/frontend

# Example tasks in frontend mode:
- Create responsive QR code display component
- Implement mobile-first review form
- Design accessible payment UI
- Optimize CSS for performance
```

### Backend API Development

```bash
# Switch to backend mode
/backend

# Example tasks in backend mode:
- Design RESTful API for review submission
- Implement QR code generation endpoint
- Create database models for carbon credits
- Add authentication middleware
```

### Testing Workflow

```bash
# Generate unit tests for recent changes
/test

# Create end-to-end test scenarios
/e2e

# Generate QA checklist
/qa
```

### Performance Optimization

```bash
# Analyze performance bottlenecks
/perf

# Example output:
- Identify N+1 queries in review fetching
- Suggest image optimization strategies
- Recommend lazy loading for components
- Profile bundle size and splitting points
```

### Security Review

```bash
# Run security audit
/security

# Example checks:
- SQL injection vulnerabilities
- XSS prevention in review forms
- CSRF token implementation
- API rate limiting
- Environment variable exposure
```

### Documentation Updates

```bash
# Update project documentation
/doc

# Generate retrospective after feature completion
/retrospective
```

## Practical Use Cases

### Mobile QR Review Specific Workflows

#### 1. QR Code Feature Implementation
```bash
/backend
# Implement QR code generation API
# Create unique codes per project
# Add tracking endpoints

/frontend
# Design QR code display component
# Create print-friendly layouts
# Add download functionality

/e2e
# Test QR code scanning flow
# Verify mobile responsiveness
# Check offline capabilities
```

#### 2. Review System Development
```bash
/frontend
# Design mobile review form
# Implement star rating component
# Add photo upload capability

/backend
# Create review submission API
# Implement spam protection
# Add moderation queue

/security
# Validate input sanitization
# Check file upload security
# Review rate limiting
```

#### 3. Payment Integration
```bash
/backend
# Implement payment processing
# Add subscription management
# Create invoice generation

/test
# Unit tests for payment logic
# Mock payment gateway responses
# Test edge cases

/qa
# Payment flow test scenarios
# Error handling verification
# Refund process testing
```

## Best Practices

1. **Always save context** before switching modes or sessions using `/forward-context`
2. **Use appropriate mode** for the task at hand (frontend/backend)
3. **Run security audits** regularly with `/security`
4. **Generate tests** immediately after implementing features with `/test`
5. **Document as you go** using `/doc` command
6. **Compress context** with `/compact` when approaching token limits

## Shortcode Combinations

### Full Feature Development Cycle
```bash
/new-session       # Start fresh with context
/backend           # Implement API
/frontend          # Build UI
/test              # Generate tests
/e2e               # Create integration tests
/security          # Security review
/doc               # Update documentation
/retrospective     # Document lessons learned
/forward-context   # Save for next session
```

### Quick Debug Session
```bash
/debug             # Enter debug mode
/perf              # Check performance issues
/lint              # Fix code quality issues
/test              # Verify fixes with tests
```

### Deployment Preparation
```bash
/security          # Final security check
/qa                # Generate QA checklist
/deploy            # Create CI/CD pipeline
/doc               # Update deployment docs
```

## Tips for Effective Use

- Use `/compact` regularly to manage context size
- Switch modes (`/frontend`, `/backend`) based on your current task
- Always run `/security` before deploying sensitive features
- Use `/retrospective` after completing major features
- Leverage `/debug` when encountering difficult bugs
- Generate documentation with `/doc` while the context is fresh