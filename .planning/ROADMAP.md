# ROADMAP.md - Oasis MVP

## Milestone: v1.0 MVP

**Goal:** Production-ready MVP with security focus  
**Timeline:** Under 1 month

---

## Phase Structure

### Phase 1: Security Foundations
- Fix critical `.gitignore` issue
- Rotate exposed API keys
- Implement proper error handling (replace alerts)
- Add error boundary

**Status:** Complete
**Plans:** 1 plan

**Plan list:**
- [x] 01-01-PLAN.md — Fix .gitignore, replace alerts, add error boundary

**Depends on:** None

### Phase 2: Testing Infrastructure
- Add Vitest + @testing-library/react
- Write tests for authentication flows
- Write tests for payment integrations

**Depends on:** Phase 1

### Phase 3: Quality Improvements
- Add TypeScript for type safety
- Implement Sentry error tracking
- Add lazy loading for routes

**Depends on:** Phase 2

### Phase 4: Feature Polish
- Fix navigation/routing issues
- Polish UI components
- Optimize bundle size

**Depends on:** Phase 3

### Phase 5: Production Readiness
- HTTPS enforcement
- CSP headers
- Rate limiting
- Deploy to production

**Depends on:** Phase 4

---

## Summary

| Phase | Focus | Priority |
|-------|-------|----------|
| 1 | Security Foundations | P0 |
| 2 | Testing Infrastructure | P1 |
| 3 | Quality Improvements | P2 |
| 4 | Feature Polish | P2 |
| 5 | Production Readiness | P1 |

---

*Created: 2026-04-09*
*Milestone: v1.0 MVP*
