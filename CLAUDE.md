# Claude Code Context: Spec-Driven Development Framework

## Project Overview

**Type**: Spec-Driven Development framework with ToDo app implementation  
**Architecture**: Library-first, TypeScript, localStorage-based SPA  
**Testing**: TDD with Vitest, strict red-green-refactor cycle  
**Current Feature**: Simple ToDo App (branch: 001-todo)

## Tech Stack

- **Language**: TypeScript 5.x
- **Build**: Vite (fast dev server, optimized builds)
- **Testing**: Vitest + @testing-library/dom
- **Storage**: localStorage with JSON serialization
- **Platform**: Modern web browsers (Chrome 90+, Firefox 88+, Safari 14+)

## Development Principles

- **Library-First**: Every feature as standalone, testable library
- **CLI Interface**: Libraries expose functionality via CLI
- **Test-First**: TDD mandatory, tests written before implementation
- **Simplicity**: Minimal frameworks, direct APIs, no wrapper classes
- **Constitution**: All changes must comply with `/memory/constitution.md`

## Current Implementation Status

**Phase**: Planning complete (Phase 1)  
**Branch**: `001-todo`  
**Next**: `/tasks` command to generate implementation tasks

### Generated Artifacts

- `specs/001-todo/spec.md` - Feature specification
- `specs/001-todo/research.md` - Technical decisions and rationale
- `specs/001-todo/data-model.md` - Entity definitions and storage schema
- `specs/001-todo/contracts/todo-api.json` - OpenAPI contract definitions
- `specs/001-todo/quickstart.md` - User acceptance testing guide

## Key Decisions Made

1. **TypeScript SPA**: Vanilla TypeScript with modern Web APIs
2. **localStorage**: Perfect for single-user, simple persistence needs
3. **No Framework**: Direct DOM manipulation for simplicity
4. **UUID v4**: Task identifiers for uniqueness
5. **JSON Schema**: OpenAPI contracts for API validation

## Important File Locations

- Constitution: `/memory/constitution.md`
- Spec template: `/templates/spec-template.md`
- Plan template: `/templates/plan-template.md`
- Current spec: `/specs/001-todo/spec.md`
- Current plan: `/specs/001-todo/plan.md`

## Functional Requirements (ToDo App)

- **FR-001**: Add new tasks with text descriptions
- **FR-002**: Display all tasks in readable list format
- **FR-003**: Mark tasks as complete/incomplete
- **FR-004**: Delete tasks from list
- **FR-005**: Visual distinction between complete/incomplete tasks
- **FR-006**: Prevent adding empty or whitespace-only tasks

## Data Model

```typescript
interface Task {
  id: string; // UUID v4
  description: string; // 1-500 chars
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
}
```

## Storage Schema

- Key: `todo-app-tasks` → Task[]
- Key: `todo-app-metadata` → {version, lastBackup}
- Format: JSON serialization with ISO date strings

## Testing Strategy

1. **Contract Tests**: localStorage operations, API schemas
2. **Integration Tests**: User scenarios from quickstart.md
3. **Unit Tests**: Individual functions and validation logic
4. **E2E Tests**: Full user workflows via browser automation

## Performance Targets

- UI Response: <100ms for all interactions
- Task Scale: Support up to 1000 tasks efficiently
- Storage: Minimal localStorage usage with compression

## Next Steps

1. Run `/tasks` command to generate implementation tasks
2. Follow TDD: Write failing tests first
3. Implement core library in `src/lib/`
4. Add CLI interface for programmatic access
5. Build UI components for user interaction

## Recent Changes

- 2025-09-06: Planning phase completed
- 2025-09-06: Technical stack finalized (TypeScript + Vite + localStorage)
- 2025-09-06: Data model and contracts defined
- 2025-09-06: Quickstart testing scenarios created

---

_Auto-updated by Spec-Driven Development tools_
