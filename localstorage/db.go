package localstorage

import (
	"database/sql"
	"log"
	"time"

	"github.com/madhuwantha/devtime/tracker"
	_ "github.com/mattn/go-sqlite3"
)

var DB *sql.DB

func InitDB() {
	var err error
	DB, err = sql.Open("sqlite3", "./devtime.db")

	if err != nil {
		log.Fatal(err)
	}

	if err = DB.Ping(); err != nil {
		log.Fatal(err)
	}

	createTable := `
	CREATE TABLE IF NOT EXISTS timelogs (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		project TEXT,
		task TEXT,
		start_time TEXT,
		end_time TEXT
	);`

	_, err = DB.Exec(createTable)
	if err != nil {
		log.Fatal(err)
	}
}

func InsertStart(project string, task string, start time.Time) {
	if DB == nil {
		log.Fatal("DB is not initialized")
	}

	stmt, err := DB.Prepare("INSERT INTO timelogs(project, task, start_time) VALUES (?, ?, ?)")

	if err != nil {
		log.Fatalf("Prepare failed: %v", err)
	}
	defer stmt.Close()

	_, err = stmt.Exec(project, task, start.Format(time.RFC3339))

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
	err := DB.QueryRow("SELECT id FROM timelogs WHERE end_time IS NULL ORDER BY id DESC LIMIT 1").Scan(&id)
	if err != nil {
		log.Fatalf("Failed to find unclosed timelog: %v", err)
	}

	// Step 2: Update that record
	stmt, err := DB.Prepare("UPDATE timelogs SET end_time = ? WHERE id = ?")
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

	rows, err := DB.Query("SELECT id, project, task, start_time, end_time FROM timelogs ORDER BY start_time DESC")

	if err != nil {
		log.Fatalf("Query failed: %v", err)
	}
	defer rows.Close()

	var logs []tracker.TimeLog

	for rows.Next() {
		var currentLog tracker.TimeLog
		var startStr, endStr string

		err := rows.Scan(&currentLog.ID, &currentLog.Project, &currentLog.Task, &startStr, &endStr)

		if err != nil {
			log.Fatalf("Scan failed: %v", err)
			continue
		}

		currentLog.StartTime, _ = time.Parse(time.RFC3339, startStr)
		if endStr != "" {
			currentLog.EndTime, _ = time.Parse(time.RFC3339, endStr)
		}

		logs = append(logs, currentLog)
	}

	return logs
}
