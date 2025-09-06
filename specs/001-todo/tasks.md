# Tasks: Simple ToDo App

**Input**: Design documents from `/specs/001-todo/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)

```
1. Load plan.md from feature directory ✓
   → Tech stack: TypeScript + Vite + localStorage + Vitest
   → Libraries: todo-lib (core task management), todo-cli
   → Structure: Single project (src/, tests/)
2. Load optional design documents: ✓
   → data-model.md: Task, TaskList entities → model tasks
   → contracts/todo-api.json: 6 operations → contract test tasks
   → research.md: TypeScript/Vite setup → setup tasks
3. Generate tasks by category: ✓
4. Apply task rules: ✓
   → Different files = [P] for parallel
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...) ✓
6. Generate dependency graph ✓
7. Create parallel execution examples ✓
8. Validate task completeness: ✓
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Based on plan.md structure decision: DEFAULT (Option 1)

## Phase 3.1: Setup

- [ ] T001 Create project structure with src/{models,services,cli,lib}/ and tests/{contract,integration,unit}/ directories
- [ ] T002 Initialize TypeScript project with Vite, Vitest, @testing-library/dom dependencies in package.json
- [ ] T003 [P] Configure TypeScript compiler options in tsconfig.json
- [ ] T004 [P] Configure ESLint and Prettier in .eslintrc.js and .prettierrc
- [ ] T005 [P] Configure Vitest in vite.config.ts

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3

**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

- [ ] T006 [P] Contract test GET /tasks operation in tests/contract/getTasks.test.ts
- [ ] T007 [P] Contract test POST /tasks operation in tests/contract/createTask.test.ts
- [ ] T008 [P] Contract test PATCH /tasks/{id} operation in tests/contract/updateTask.test.ts
- [ ] T009 [P] Contract test DELETE /tasks/{id} operation in tests/contract/deleteTask.test.ts
- [ ] T010 [P] Contract test GET /storage/export operation in tests/contract/exportTasks.test.ts
- [ ] T011 [P] Contract test POST /storage/import operation in tests/contract/importTasks.test.ts
- [ ] T012 [P] Integration test Task Creation scenario in tests/integration/taskCreation.test.ts
- [ ] T013 [P] Integration test Task List Display scenario in tests/integration/taskDisplay.test.ts
- [ ] T014 [P] Integration test Task Completion Toggle scenario in tests/integration/taskCompletion.test.ts
- [ ] T015 [P] Integration test Task Deletion scenario in tests/integration/taskDeletion.test.ts
- [ ] T016 [P] Integration test Visual Status Distinction scenario in tests/integration/visualStatus.test.ts
- [ ] T017 [P] Integration test Empty Task Prevention scenario in tests/integration/emptyTaskPrevention.test.ts

## Phase 3.3: Core Implementation (ONLY after tests are failing)

- [ ] T018 [P] Task model interface and validation in src/models/Task.ts
- [ ] T019 [P] TaskList model and operations in src/models/TaskList.ts
- [ ] T020 [P] TaskStorage interface and localStorage implementation in src/lib/TaskStorage.ts
- [ ] T021 [P] TaskValidation utility functions in src/lib/TaskValidation.ts
- [ ] T022 TaskService CRUD operations in src/services/TaskService.ts
- [ ] T023 getTasks API implementation (depends on TaskService)
- [ ] T024 createTask API implementation (depends on TaskService)
- [ ] T025 updateTask API implementation (depends on TaskService)
- [ ] T026 deleteTask API implementation (depends on TaskService)
- [ ] T027 exportTasks API implementation (depends on TaskService)
- [ ] T028 importTasks API implementation (depends on TaskService)
- [ ] T029 [P] CLI --create command in src/cli/todo-create.ts
- [ ] T030 [P] CLI --list command in src/cli/todo-list.ts
- [ ] T031 [P] CLI --complete command in src/cli/todo-complete.ts
- [ ] T032 [P] CLI --delete command in src/cli/todo-delete.ts
- [ ] T033 [P] CLI --export command in src/cli/todo-export.ts
- [ ] T034 [P] CLI --import command in src/cli/todo-import.ts
- [ ] T035 Main CLI entry point with --help, --version in src/cli/index.ts

## Phase 3.4: Integration

- [ ] T036 Connect TaskService to TaskStorage with error handling
- [ ] T037 DOM event handlers and UI updates in src/lib/UIController.ts
- [ ] T038 Main application initialization in src/main.ts
- [ ] T039 Error logging and user feedback system
- [ ] T040 localStorage quota monitoring and backup triggers

## Phase 3.5: Polish

- [ ] T041 [P] Unit tests for Task model validation in tests/unit/Task.test.ts
- [ ] T042 [P] Unit tests for TaskList operations in tests/unit/TaskList.test.ts
- [ ] T043 [P] Unit tests for TaskStorage serialization in tests/unit/TaskStorage.test.ts
- [ ] T044 [P] Unit tests for TaskValidation functions in tests/unit/TaskValidation.test.ts
- [ ] T045 Performance tests for <100ms UI response in tests/performance/response.test.ts
- [ ] T046 Performance tests for 1000+ task operations in tests/performance/scale.test.ts
- [ ] T047 Create HTML template and basic CSS in public/index.html and src/styles.css
- [ ] T048 Execute quickstart validation scenarios from specs/001-todo/quickstart.md
- [ ] T049 Build production bundle and verify all functionality
- [ ] T050 Code cleanup: remove duplication, add JSDoc comments

## Dependencies

```
Setup (T001-T005) → Tests (T006-T017) → Implementation (T018-T035) → Integration (T036-T040) → Polish (T041-T050)

Key blocking relationships:
- T001 blocks all subsequent tasks (project structure)
- T002 blocks all TypeScript tasks (dependencies)
- T006-T017 MUST complete before T018-T035 (TDD requirement)
- T018-T021 block T022 (models before service)
- T022 blocks T023-T028 (service before APIs)
- T035 blocks T048 (CLI before quickstart)
- T038 blocks T048 (main app before quickstart)
```

## Parallel Example

```bash
# After setup, launch all contract tests together (Phase 3.2):
# These can run in parallel because they test different operations and write to different files

vitest run tests/contract/getTasks.test.ts &
vitest run tests/contract/createTask.test.ts &
vitest run tests/contract/updateTask.test.ts &
vitest run tests/contract/deleteTask.test.ts &
vitest run tests/contract/exportTasks.test.ts &
vitest run tests/contract/importTasks.test.ts &
wait

# Launch integration tests in parallel:
vitest run tests/integration/taskCreation.test.ts &
vitest run tests/integration/taskDisplay.test.ts &
vitest run tests/integration/taskCompletion.test.ts &
vitest run tests/integration/taskDeletion.test.ts &
vitest run tests/integration/visualStatus.test.ts &
vitest run tests/integration/emptyTaskPrevention.test.ts &
wait

# Launch model creation in parallel (Phase 3.3):
# Create Task.ts, TaskList.ts, TaskStorage.ts, TaskValidation.ts simultaneously
```

## Notes

- [P] tasks = different files, no dependencies
- Verify tests fail before implementing (TDD requirement)
- Commit after each task completion
- Run `npm run lint` and `npm run typecheck` after each implementation phase

## Task Generation Rules Applied

1. **From Contracts** (todo-api.json):
   - 6 operations → 6 contract test tasks (T006-T011) [P]
   - 6 operations → 6 implementation tasks (T023-T028)
2. **From Data Model** (data-model.md):
   - Task entity → Task model task (T018) [P]
   - TaskList entity → TaskList model task (T019) [P]
   - TaskStorage interface → Storage implementation (T020) [P]
   - TaskValidation interface → Validation utilities (T021) [P]
3. **From Quickstart** (quickstart.md):
   - 6 test scenarios → 6 integration test tasks (T012-T017) [P]
   - Quickstart execution → validation task (T048)

4. **From Plan** (plan.md):
   - CLI interface requirement → 7 CLI command tasks (T029-T035)
   - TypeScript + Vite setup → setup tasks (T001-T005)

## Validation Checklist

- ✅ All 6 contracts have corresponding tests (T006-T011)
- ✅ All 2 entities have model tasks (T018-T019)
- ✅ All tests come before implementation (Phase 3.2 before 3.3)
- ✅ Parallel tasks truly independent (different files)
- ✅ Each task specifies exact file path
- ✅ No [P] task modifies same file as another [P] task

## Total: 50 Tasks

- **Setup**: 5 tasks (T001-T005)
- **Tests**: 12 tasks (T006-T017) - All must fail before implementation
- **Implementation**: 18 tasks (T018-T035)
- **Integration**: 5 tasks (T036-T040)
- **Polish**: 10 tasks (T041-T050)

**Estimated completion time**: 15-20 hours (following strict TDD)
**Ready for**: Phase 4 implementation execution
