package localsrc

import (
	"database/sql"
	"errors"
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
	DB, err = sql.Open("sqlite3", dbPath)

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

	CREATE TABLE IF NOT EXISTS worklog (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		start_time TEXT,
		end_time TEXT,		
		is_pause INTEGER NOT NULL DEFAULT 0
	);

	CREATE TABLE IF NOT EXISTS idlelog (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		start_time TEXT,
		end_time TEXT,				
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
