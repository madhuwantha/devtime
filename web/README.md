# DevTime Web Frontend (Vite + React + TypeScript)

A modern React TypeScript frontend application for the DevTime project management and time tracking system, built with Vite for fast development and optimal performance.

## Features

- **Dashboard**: Overview of projects, tasks, and time tracking status
- **Project Management**: Create projects, add users to projects with different roles
- **Task Management**: Create tasks, assign users to tasks with different roles
- **Time Tracking**: Start/stop time tracking for specific projects and tasks
- **User Management**: Create and manage user accounts

## Technology Stack

- **Vite** - Fast build tool and development server
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API communication

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- The DevTime server running on `http://localhost:8080`

### Installation

1. Navigate to the web directory:
   ```bash
   cd web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Environment Variables

Create a `.env` file in the web directory:

```env
VITE_API_URL=http://localhost:8080
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Integration

The frontend integrates with the following DevTime server APIs:

### Projects API
- `POST /api/projects/` - Create project
- `POST /api/projects/:projectId/users/:userId/role/:role/add-user` - Add user to project
- `GET /api/projects/users/:userId` - Get user projects

### Tasks API
- `POST /api/projects/:projectId/tasks/` - Create task
- `POST /api/tasks/:taskId/users/:userId/role/:role/add-user` - Add user to task
- `GET /api/tasks/users/:userId` - Get user tasks

### Users API
- `POST /api/users/` - Create user

### Time Tracking API
- `POST /api/start` - Start task timer
- `POST /api/stop` - Stop task timer

## Project Structure

```
src/
├── components/          # React components
│   ├── Layout.tsx      # Main layout with navigation
│   ├── Dashboard.tsx   # Dashboard overview
│   ├── Projects.tsx    # Project management
│   ├── Tasks.tsx       # Task management
│   ├── TimeTracking.tsx # Time tracking interface
│   └── UserManagement.tsx # User management
├── services/           # API service layer
│   └── api.ts         # API client functions
├── types/             # TypeScript type definitions
│   └── index.ts       # Shared types
├── App.tsx            # Main application component
└── main.tsx           # Application entry point
```

## User Roles

### Project Roles
- **ADMIN**: Full project access
- **MEMBER**: Basic project access

### Task Roles
- **OWNER**: Full task control
- **ASSIGNEE**: Task assignment
- **REVIEWER**: Task review access
- **WATCHER**: Read-only access

## Development

### Code Style

The project uses:
- TypeScript for type safety
- Tailwind CSS for styling
- Functional components with hooks
- Axios for HTTP requests
- ESLint for code quality

### Vite Benefits

- **Fast HMR**: Instant hot module replacement
- **Optimized Builds**: Tree-shaking and code splitting
- **Modern Tooling**: Built-in TypeScript support
- **ES Modules**: Native ES module support

## Production Build

To create a production build:

```bash
npm run build
```

The build output will be in the `dist` folder, optimized for production deployment.

## Contributing

1. Follow the existing code style
2. Use TypeScript for all new components
3. Add proper error handling for API calls
4. Test all functionality before submitting changes

## License

This project is part of the DevTime system. See the main project LICENSE file for details.