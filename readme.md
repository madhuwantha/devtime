
#### Build
```bash
 go build -o devtime
```

#### Run server

```bash
go run server/main-server.go
```
#### Run desktop server

```bash
cd desktop
```

```bash
wails dev
```


---



# Overview

The CLI tool is called `devtime`. It is a developer time tracker that allows you to track project time, manage logs, and synchronize data between local storage and a server. It uses the Cobra library for command-line parsing and local SQLite for log storage.

---

## Main Features & Commands

### 1. `start`
- **Purpose:** Start tracking time for a project and task.
- **How it works:**  
  - Prompts the user to select a project and a task from local data.
  - Records the current time as the start time for the selected project/task.
  - Stores this information in local storage.
- **Usage:**  
  ```
  devtime start
  ```

### 2. `stop`
- **Purpose:** Stop tracking time for the currently running project/task.
- **How it works:**  
  - Records the current time as the stop time for the ongoing time tracking session.
  - Updates the local log to mark the end of the session.
- **Usage:**  
  ```
  devtime stop
  ```

### 3. `report`
- **Purpose:** Show a summary of your time logs.
- **How it works:**  
  - Fetches all time logs from local storage.
  - Displays each log with start time, project, task, and duration.
  - Shows the total time tracked.
  - Indicates if a session is still running.
- **Usage:**  
  ```
  devtime report
  ```

### 4. `syn`

#### Purpose
The `syn` command is used to synchronize data between the local SQLite database and the remote server. It currently supports syncing projects and tasks from the server to the local database.

---

#### How It Works

1. **User Prompts**
   - The user is prompted to select the sync direction:
     - `"Server -> Local"`
     - `"Local -> Server"` (not yet implemented)
   - The user is then prompted to select the data type to sync:
     - `"Projects"`
     - `"Tasks"`

2. **Sync Strategy Selection**
   - Based on the user's choices, a sync strategy is selected:
     - If `"Server -> Local"` and `"Projects"`: syncs projects from server to local.
     - If `"Server -> Local"` and `"Tasks"`: syncs tasks from server to local.
     - Other combinations (e.g., `"Local -> Server"`) are not yet implemented.

3. **Sync Execution**
   - The selected strategy's `RunSync()` method is called, which performs the actual synchronization.

---

#### Implementation Details

##### User Prompting (`prompt.go`)
- Uses `promptui` to interactively ask the user for sync direction and data type.

##### Strategy Pattern (`factory.go`, `sync_strategy.go`, `server_to_local.go`)
- The code uses a strategy pattern to select the appropriate sync logic.
- `ServerToLocalProjects` and `ServerToLocalTasks` implement the `SyncStrategy` interface.

##### Project Sync (`project-sync.go`)
- Fetches projects from the server for a hardcoded user.
- Compares server projects with local projects.
- Inserts any missing projects from the server into the local database.

##### Task Sync (`task-sync.go`)
- Fetches tasks from the server for a hardcoded user.
- Compares server tasks with local tasks.
- Inserts any missing tasks from the server into the local database.

##### Server-to-Local Strategy (`server_to_local.go`)
- `ServerToLocalProjects.RunSync()` calls `SynLocalProjects()` and prints a completion message.
- `ServerToLocalTasks.RunSync()` calls `SynLocalTasks()` and prints a completion message.

---

#### Current Limitations

- **Only "Server -> Local" is implemented.** The "Local -> Server" direction is present in code comments but not functional.
- **User ID is hardcoded** for server requests.
- **Only "Projects" and "Tasks"** are supported as data types.

---

#### Example Flow

1. User runs: `devtime syn`
2. Prompt: "Select What you want to do?" → User selects "Server -> Local"
3. Prompt: "Select What you want to sync?" → User selects "Projects"
4. The tool fetches all projects from the server, compares with local, and inserts any missing ones.
5. Prints: "Syncing Projects from Server to Local is completed"

---

#### Summary Table

| Step                | Description                                                                 |
|---------------------|-----------------------------------------------------------------------------|
| Prompt direction    | "Server -> Local" (only this is implemented)                                |
| Prompt data type    | "Projects" or "Tasks"                                                       |
| Fetch from server   | Gets all projects/tasks for a hardcoded user                                |
| Compare & insert    | Adds missing projects/tasks to local DB                                     |
| Output              | Prints completion message after sync                                        |

---



## Additional Details

- **Global Flags:**  
  - `--toggle, -t` (currently a placeholder/help flag).

- **Initialization:**  
  - On startup, the CLI initializes the local database.

- **Extensibility:**  
  - The CLI is structured to allow easy addition of new commands and flags.

---

## Summary Table

| Command   | Description                                 | Key Actions/Prompts                |
|-----------|---------------------------------------------|------------------------------------|
| start     | Start tracking time for a project/task      | Project/task selection, start time |
| stop      | Stop tracking time                          | Stop time, update log              |
| report    | Show summary of time logs                   | List logs, show durations          |
| syn       | Sync data between local and server          | Direction/data type prompts        |

---

