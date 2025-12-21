package localsrc

import (
	"database/sql"
	"errors"
	"fmt"
	"log"
	"os"

	_ "github.com/mattn/go-sqlite3"
)

var ErrDBNotInitialized = errors.New("database is not initialized")
var DB *sql.DB

func InitDB() {
	var err error
	dbPath := os.Getenv("DB_PATH")
	if dbPath == "" {
		dbPath = "/Volumes/dIsk_1/PROJECTS/devtime/devtime.db"
	}
	// Configure SQLite connection string with WAL mode and other optimizations for concurrent access
	// WAL mode allows multiple readers and one writer simultaneously
	// _busy_timeout sets how long SQLite will wait for locks (in milliseconds)
	DB, err = sql.Open("sqlite3", dbPath+"?_journal_mode=WAL&_busy_timeout=5000")

	if err != nil {
		log.Fatal(err)
	}

	// Set connection pool settings for better concurrent access
	DB.SetMaxOpenConns(1) // SQLite only supports one writer at a time
	DB.SetMaxIdleConns(1)
	DB.SetConnMaxLifetime(0) // Connections don't expire

	if err = DB.Ping(); err != nil {
		log.Fatal(err)
	}

	createTable := `


	CREATE TABLE IF NOT EXISTS project (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		project_id TEXT,
		name TEXT,
		code TEXT,
		status TEXT NOT NULL DEFAULT 'active'
	);
	CREATE TABLE IF NOT EXISTS task (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT,		
		task_id TEXT,
		project_id TEXT,
		status TEXT NOT NULL DEFAULT 'pending',

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

	CREATE TABLE IF NOT EXISTS worklog (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		start_time TEXT,
		end_time TEXT,		
		is_pause INTEGER NOT NULL DEFAULT 0
	);

	CREATE TABLE IF NOT EXISTS idlelog (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		start_time TEXT,
		end_time TEXT		
	);
	
	CREATE UNIQUE INDEX IF NOT EXISTS uidx_project_project_id
		ON project (project_id);
	CREATE UNIQUE INDEX IF NOT EXISTS uidx_task_task_id
		ON task (task_id);
	`

	alter := `
	

	`

	createTable = fmt.Sprintf("%s %s", createTable, alter)

	_, err = DB.Exec(createTable)
	if err != nil {
		log.Fatal(err)
	}
}
