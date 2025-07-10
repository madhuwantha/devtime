package localstorage

import (
	"database/sql"
	"log"
	"time"

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
