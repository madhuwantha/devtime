package localsrc

import (
	"database/sql"
	"errors"
	"fmt"
	"log"
	"os"
	"path/filepath"

	_ "github.com/mattn/go-sqlite3"
)

var ErrDBNotInitialized = errors.New("database is not initialized")
var DB *sql.DB

// GetDBPath returns the path to the database file in user's home directory
func GetDBPath() (string, error) {
	// dbPath := os.Getenv("DB_PATH")
	// if dbPath != "" {
	// 	return dbPath, nil
	// }

	home, err := os.UserHomeDir()
	if err != nil {
		return "", fmt.Errorf("failed to get user home directory: %w", err)
	}

	dbDir := filepath.Join(home, ".devtime")
	return filepath.Join(dbDir, "devtime.db"), nil
}

// IsDBInitialized checks if the database file exists
func IsDBInitialized() bool {
	dbPath, err := GetDBPath()
	if err != nil {
		return false
	}

	_, err = os.Stat(dbPath)
	log.Printf("Database path: %s", dbPath)
	log.Printf("Database exists: %v", err == nil)
	return err == nil
}

// InitDB initializes the database at the proper location
func InitDB() error {
	var err error
	dbPath, err := GetDBPath()
	if err != nil {
		return fmt.Errorf("failed to get DB path: %w", err)
	}

	// Create directory if it doesn't exist
	dbDir := filepath.Dir(dbPath)
	err = os.MkdirAll(dbDir, 0700)
	if err != nil {
		return fmt.Errorf("failed to create DB directory: %w", err)
	}
	// Configure SQLite connection string with WAL mode and other optimizations for concurrent access
	// WAL mode allows multiple readers and one writer simultaneously
	// _busy_timeout sets how long SQLite will wait for locks (in milliseconds)
	DB, err = sql.Open("sqlite3", dbPath+"?_journal_mode=WAL&_busy_timeout=5000")

	if err != nil {
		return fmt.Errorf("failed to open database: %w", err)
	}

	// Set connection pool settings for better concurrent access
	DB.SetMaxOpenConns(1) // SQLite only supports one writer at a time
	DB.SetMaxIdleConns(1)
	DB.SetConnMaxLifetime(0) // Connections don't expire

	if err = DB.Ping(); err != nil {
		return fmt.Errorf("failed to ping database: %w", err)
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
		return fmt.Errorf("failed to create tables: %w", err)
	}

	log.Printf("Database initialized successfully at: %s", dbPath)
	return nil
}
