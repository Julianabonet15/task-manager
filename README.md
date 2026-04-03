# TaskFlow

A task management web application for small development teams. Built with NestJS, Next.js, and SQLite.

## Tech Stack

- **Backend:** NestJS + TypeScript + SQLite (better-sqlite3)
- **Frontend:** Next.js 15 + TypeScript + Tailwind CSS
- **Testing:** Jest

## Prerequisites

- Node.js 20+
- npm

## Getting Started

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd task-manager
```

### 2. Backend
```bash
cd backend
npm install
npm run start:dev
```

The API will be available at `http://localhost:3001`

### 3. Frontend

Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:3000`

### Docker (optional)
```bash
docker compose up --build
```

- Backend: `http://localhost:3001`
- Frontend: `http://localhost:3002`

## Running Tests
```bash
cd backend
npm run test
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/tasks | List all root tasks |
| GET | /api/tasks/:id | Get task with subtasks |
| POST | /api/tasks | Create a task |
| PUT | /api/tasks/:id | Update a task |
| DELETE | /api/tasks/:id | Delete a task (cascades to subtasks) |
| GET | /api/tasks/stats | Get task statistics |

## Features

- Create, view, update, and delete tasks
- Task lifecycle: Not Started → In Progress → In Review → Done / Blocked
- Priority levels: Low, Medium, High, Critical
- Nested subtasks (unlimited hierarchy)
- Effort estimates per task
- Team stats dashboard
- Search and filter by status
- Dark mode
- Responsive design