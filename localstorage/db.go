package localstorage

import (
	"database/sql"
	"log"
	"time"
)

var DB *sql.DB

func init() {
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

func InsertStart(project int, task string, start time.Time) {
	stmt, _ := DB.Prepare("INSERT INTO timelogs(project, task, start_time) VALUES (?, ?, ?)")
	stmt.Exec(project, task, start.Format(time.RFC3339))
}

func InsertStop(end time.Time) {
	stmt, _ := DB.Prepare("UPDATE timelogs SET end_time = ? WHERE end_time IS NULL ORDER BY id DESC LIMIT 1")
	stmt.Exec(end.Format(time.RFC3339))
}
