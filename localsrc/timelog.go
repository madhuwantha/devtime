package localsrc

import (
	"database/sql"
	"errors"
	"fmt"
	"log"
	"time"

	"github.com/madhuwantha/devtime/localsrc/entity"
)

func InsertStart(projectId string, taskId string, start time.Time) (bool, error) {
	if DB == nil {
		log.Println("DB is not initialized")
		return false, errors.New("DB is not initialized")
	}

	stmt, err := DB.Prepare("INSERT INTO timelog(project_id, task_id, start_time) VALUES (?, ?, ?)")

	if err != nil {
		log.Printf("Prepare failed: %v \n", err)
		return false, err
	}
	defer stmt.Close()

	_, err = stmt.Exec(projectId, taskId, start.Format(time.RFC3339))

	if err != nil {
		log.Fatalf("Exec failed: %v", err)
		return false, err
	}
	return true, nil
}

func InsertStop(end time.Time) (bool, error) {
	if DB == nil {
		log.Printf("DB is not initialized")
		return false, ErrDBNotInitialized
	}

	// Step 1: Get latest unclosed time log
	var id int
	err := DB.QueryRow("SELECT id FROM timelog WHERE end_time IS NULL ORDER BY id DESC LIMIT 1").Scan(&id)
	if err != nil {
		log.Printf("Failed to find unclosed timelog: %v", err)
		return false, err
	}

	// Step 2: Update that record
	stmt, err := DB.Prepare("UPDATE timelog SET end_time = ? WHERE id = ?")
	if err != nil {
		log.Printf("Prepare failed: %v", err)
		return false, err
	}
	defer stmt.Close()

	_, err = stmt.Exec(end.Format(time.RFC3339), id)
	if err != nil {
		log.Printf("Exec failed: %v", err)
		return false, err
	}
	return true, nil
}

func GetAllLogs() []entity.TimeLog {
	if DB == nil {
		log.Fatal("DB is not initialized")
	}

	rows, err := DB.Query(`
		SELECT timelog.id, project.name, task.name, start_time, end_time 
			FROM timelog

			LEFT JOIN project ON project.project_id = timelog.project_id
	LEFT JOIN task ON task.task_id = timelog.task_id
	ORDER BY start_time DESC
	
			`)
	fmt.Printf("Querying all logs...\n")
	fmt.Println(rows)

	if err != nil {
		log.Fatalf("Query failed: %v", err)
	}
	defer rows.Close()

	var logs []entity.TimeLog

	for rows.Next() {
		fmt.Println("Processing a row...")

		var currentLog entity.TimeLog
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
