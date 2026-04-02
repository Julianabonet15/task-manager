# CLAUDE.md

This file provides guidance for AI coding agents working on this project.

## Project Structure
```
task-manager/
├── backend/          # NestJS API
│   └── src/
│       ├── database/ # SQLite setup
│       ├── tasks/    # Tasks module (controller, service, repository, DTOs)
│       └── main.ts
├── frontend/         # Next.js app
│   └── src/
│       ├── app/      # Pages (main view, task detail panel)
│       ├── components/ # UI components
│       └── lib/      # API client and types
├── Dockerfile.backend
└── docker-compose.yml
```

## Architecture

- **Backend:** NestJS with Controller → Service → Repository pattern
- **Database:** SQLite via better-sqlite3, single `tasks` table with `parent_id` for hierarchy
- **Frontend:** Next.js App Router, client components, Tailwind CSS v4

## Key Design Decisions

- Tasks use adjacency list pattern (`parent_id`) for unlimited subtask hierarchy
- Stats endpoint counts all tasks flat (including subtasks) by status
- DELETE cascades to subtasks via SQLite foreign key
- Frontend uses a side panel instead of a separate detail page
- Dark mode via `next-themes` with Tailwind CSS `dark:` variants

## Task Model
```typescript
{
  id: string          // UUID
  title: string
  description: string | null
  status: 'not_started' | 'in_progress' | 'in_review' | 'done' | 'blocked'
  priority: 'low' | 'medium' | 'high' | 'critical'
  estimate: number | null
  parent_id: string | null
  created_at: string  // ISO datetime
  updated_at: string  // ISO datetime
}
```

## Running the Project
```bash
# Backend
cd backend && npm install && npm run start:dev

# Frontend
cd frontend && npm install && npm run dev

# Tests
cd backend && npm run test
```

## Important Notes

- CORS is configured to allow `http://localhost:3001`
- SQLite DB file is created automatically at `backend/task-manager.db`
- ESLint unsafe rules are disabled for better-sqlite3 compatibility