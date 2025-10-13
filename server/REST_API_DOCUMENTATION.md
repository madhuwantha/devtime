# DevTime RESTful API Documentation

This document describes the RESTful API endpoints for the DevTime project management and time tracking system.

## Base URL
```
http://localhost:8080/api
```

## Authentication
Currently, the API does not implement authentication. In a production environment, you should implement proper authentication mechanisms.

## API Endpoints

### Time Tracking

#### Start Time Tracking
```http
POST /api/start
Content-Type: application/json

{
  "project": "project_id",
  "task": "task_id", 
  "username": "user@example.com"
}
```

#### Stop Time Tracking
```http
POST /api/stop
Content-Type: application/json

{
  "username": "user@example.com"
}
```

#### Get Time Logs
```http
GET /api/logs
```

### Users

#### Create User
```http
POST /api/users
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com"
}
```

#### Get User Information
```http
GET /api/users/{userId}
```

#### Get User Projects
```http
GET /api/users/{userId}/projects
```

#### Get User Tasks
```http
GET /api/users/{userId}/tasks
```

### Projects

#### Create Project
```http
POST /api/projects
Content-Type: application/json

{
  "name": "My Project",
  "code": "MP001"
}
```

#### Get Project Details
```http
GET /api/projects/{projectId}
```

#### Add User to Project
```http
POST /api/projects/{projectId}/users
Content-Type: application/json

{
  "userId": "user_id",
  "role": "MEMBER" // or "ADMIN"
}
```

#### Get Project Users
```http
GET /api/projects/{projectId}/users
```

### Tasks

#### Create Task
```http
POST /api/tasks
Content-Type: application/json

{
  "name": "Task Name",
  "projectId": "project_id"
}
```

#### Get Task Details
```http
GET /api/tasks/{taskId}
```

#### Add User to Task
```http
POST /api/tasks/{taskId}/users
Content-Type: application/json

{
  "userId": "user_id",
  "role": "ASSIGNEE" // or "WATCHER", "REVIEWER", "OWNER"
}
```

#### Get Task Users
```http
GET /api/tasks/{taskId}/users
```

## HTTP Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Response Format

### Success Response
```json
{
  "message": "Operation successful",
  "id": "resource_id"
}
```

### Error Response
```json
{
  "error": "Error message",
  "details": "Additional error details"
}
```

## Data Models

### User
```json
{
  "id": "user_id",
  "username": "john_doe",
  "email": "john@example.com"
}
```

### Project
```json
{
  "id": "project_id",
  "name": "Project Name",
  "code": "PRJ001",
  "tasks": ["task_id_1", "task_id_2"],
  "users": [
    {
      "userId": "user_id",
      "role": "ADMIN"
    }
  ]
}
```

### Task
```json
{
  "id": "task_id",
  "name": "Task Name",
  "projectId": "project_id",
  "users": [
    {
      "userId": "user_id",
      "role": "ASSIGNEE"
    }
  ]
}
```

### Time Log
```json
{
  "id": "log_id",
  "project": "project_id",
  "task": "task_id",
  "startTime": "2025-01-01T10:00:00Z",
  "endTime": "2025-01-01T11:00:00Z",
  "username": "user@example.com"
}
```

## User Roles

### Project Roles
- `ADMIN` - Full project access
- `MEMBER` - Basic project access

### Task Roles
- `OWNER` - Full task control
- `ASSIGNEE` - Task assignment
- `REVIEWER` - Task review access
- `WATCHER` - Read-only access

## REST Principles Applied

1. **Resource-based URLs**: URLs represent resources, not actions
2. **HTTP Methods**: Use appropriate HTTP methods (GET, POST, PUT, DELETE)
3. **Stateless**: Each request contains all necessary information
4. **Consistent Interface**: Uniform interface across all endpoints
5. **Layered System**: Clear separation between client and server

## Migration from Old API

### Old Endpoints → New Endpoints

| Old Endpoint | New Endpoint | Method |
|-------------|-------------|---------|
| `/api/projects/users/{userId}` | `/api/users/{userId}/projects` | GET |
| `/api/tasks/users/{userId}` | `/api/users/{userId}/tasks` | GET |
| `/api/projects/{projectId}/users/{userId}/role/{role}/add-user` | `/api/projects/{projectId}/users` | POST |
| `/api/tasks/{taskId}/users/{userId}/role/{role}/add-user` | `/api/tasks/{taskId}/users` | POST |
| `/api/projects/{projectId}/tasks/` | `/api/tasks/` | POST |

### Key Changes

1. **Removed verbs from URLs**: `add-user` → use POST method
2. **Moved user data to request body**: Role and userId now in JSON body
3. **Consistent resource hierarchy**: `/users/{id}/projects` instead of `/projects/users/{id}`
4. **Added missing endpoints**: GET operations for individual resources

## Example Usage

### Creating a Project and Task

```bash
# 1. Create a project
curl -X POST http://localhost:8080/api/projects \
  -H "Content-Type: application/json" \
  -d '{"name": "My Project", "code": "MP001"}'

# 2. Create a task
curl -X POST http://localhost:8080/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"name": "Implement Feature", "projectId": "project_id"}'

# 3. Add user to project
curl -X POST http://localhost:8080/api/projects/project_id/users \
  -H "Content-Type: application/json" \
  -d '{"userId": "user_id", "role": "MEMBER"}'

# 4. Add user to task
curl -X POST http://localhost:8080/api/tasks/task_id/users \
  -H "Content-Type: application/json" \
  -d '{"userId": "user_id", "role": "ASSIGNEE"}'
```

## Notes

- All endpoints return JSON responses
- Content-Type header should be set to `application/json` for POST requests
- Error responses include both error message and details
- Some endpoints return placeholder responses and need model implementation
