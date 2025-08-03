package repo

import (
	"database/sql"
	"log"
	"time"

	"github.com/madhuwantha/devtime/localsrc"
	"github.com/madhuwantha/devtime/localsrc/entity"
)

func GetActiveTask() (entity.Task, error) {
	if localsrc.DB == nil {
		log.Printf("DB is not initialized")
		return entity.Task{}, localsrc.ErrDBNotInitialized
	}

	// Step 1: Get latest unclosed time log
	var timelog entity.TimeLog
	var startTimeStr, endTimeStr sql.NullString
	err := localsrc.DB.QueryRow("SELECT id,project_id,task_id,start_time, end_time FROM timelog WHERE end_time IS NULL ORDER BY id DESC LIMIT 1").
		Scan(&timelog.ID, &timelog.ProjectId, &timelog.TaskId, &startTimeStr, &endTimeStr)
	if err != nil {
		log.Printf("Failed to find unclosed timelog: %v", err)
		return entity.Task{}, err
	}

	if startTimeStr.Valid {
		parsedStartTime, err := time.Parse(time.RFC3339, startTimeStr.String)
		if err != nil {
			log.Printf("Failed to parse start_time: %v", err)
			return entity.Task{}, err
		}
		timelog.StartTime = parsedStartTime
	}
	if endTimeStr.Valid && endTimeStr.String != "" {
		parsedEndTime, err := time.Parse(time.RFC3339, endTimeStr.String)
		if err != nil {
			log.Printf("Failed to parse end_time: %v", err)
			return entity.Task{}, err
		}
		timelog.EndTime = parsedEndTime
	}

	log.Printf("Unclosed timelog found: %v", timelog)

	task, err := GetTask(timelog.TaskId)
	if err != nil {
		log.Printf("Failed to get task for unclosed timelog: %v", err)
		return entity.Task{}, err
	}

	if task.ID == 0 {
		log.Println("No active task found")
		return entity.Task{}, nil
	}

	log.Printf("Active task found: %v", task)
	return task, nil
}
