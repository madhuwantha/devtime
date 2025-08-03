package localstorage

import (
	"database/sql"
	"log"
	"os"
	"time"

	"github.com/madhuwantha/devtime/cmd/cmdsrc/tracker"
	_ "github.com/mattn/go-sqlite3"
)

var DB *sql.DB

func InitDB() {
	var err error
	dbPath := os.Getenv("DB_PATH")
	if dbPath == "" {
		dbPath = "../../devtime.db"
	}
	DB, err = sql.Open("sqlite3", "./devtime.db")

	if err != nil {
		log.Fatal(err)
	}

	if err = DB.Ping(); err != nil {
		log.Fatal(err)
	}

	createTable := `


	CREATE TABLE IF NOT EXISTS project (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		project_id TEXT,
		name TEXT,
		code TEXT
	);
	CREATE TABLE IF NOT EXISTS task (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT,		
		task_id TEXT,
		project_id TEXT,

		FOREIGN KEY (project_id) REFERENCES project(project_id)
	);

	CREATE TABLE IF NOT EXISTS timelog (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		project_id TEXT,
		task_id TEXT,
		start_time TEXT,
		end_time TEXT,

		FOREIGN KEY (project_id) REFERENCES project(project_id),
		FOREIGN KEY (task_id) REFERENCES task(task_id)
	);
	
	CREATE UNIQUE INDEX IF NOT EXISTS uidx_project_project_id
		ON project (project_id);
	CREATE UNIQUE INDEX IF NOT EXISTS uidx_task_task_id
		ON task (task_id);



	`

	_, err = DB.Exec(createTable)
	if err != nil {
		log.Fatal(err)
	}
}

func InsertStart(project tracker.Project, task tracker.Task, start time.Time) {
	if DB == nil {
		log.Fatal("DB is not initialized")
	}

	stmt, err := DB.Prepare("INSERT INTO timelog(project_id, task_id, start_time) VALUES (?, ?, ?)")

	if err != nil {
		log.Fatalf("Prepare failed: %v", err)
	}
	defer stmt.Close()

	_, err = stmt.Exec(project.ProjectId, task.TaskId, start.Format(time.RFC3339))

	if err != nil {
		log.Fatalf("Exec failed: %v", err)
	}
}

func InsertStop(end time.Time) {
	if DB == nil {
		log.Fatal("DB is not initialized")
	}

	// Step 1: Get latest unclosed time log
	var id int
	err := DB.QueryRow("SELECT id FROM timelog WHERE end_time IS NULL ORDER BY id DESC LIMIT 1").Scan(&id)
	if err != nil {
		log.Fatalf("Failed to find unclosed timelog: %v", err)
	}

	// Step 2: Update that record
	stmt, err := DB.Prepare("UPDATE timelog SET end_time = ? WHERE id = ?")
	if err != nil {
		log.Fatalf("Prepare failed: %v", err)
	}
	defer stmt.Close()

	_, err = stmt.Exec(end.Format(time.RFC3339), id)
	if err != nil {
		log.Fatalf("Exec failed: %v", err)
	}
}

func GetAllLogs() []tracker.TimeLog {
	if DB == nil {
		log.Fatal("DB is not initialized")
	}

	rows, err := DB.Query(`
		SELECT timelog.id, project.name, task.name, start_time, end_time 
			FROM timelog
			INNER JOIN project ON project.project_id = timelog.project_id
			INNER JOIN task ON task.task_id = timelog.task_id
			ORDER BY start_time DESC
	`)

	if err != nil {
		log.Fatalf("Query failed: %v", err)
	}
	defer rows.Close()

	var logs []tracker.TimeLog

	for rows.Next() {
		var currentLog tracker.TimeLog
		var startStr string
		var endStr sql.NullString

		err := rows.Scan(&currentLog.ID, &currentLog.ProjectId, &currentLog.TaskId, &startStr, &endStr)

		if err != nil {
			log.Fatalf("Scan failed: %v", err)
			continue
		}

		currentLog.StartTime, _ = time.Parse(time.RFC3339, startStr)
		if endStr.Valid {
			currentLog.EndTime, _ = time.Parse(time.RFC3339, endStr.String)
		}

		logs = append(logs, currentLog)
	}

	return logs
}
