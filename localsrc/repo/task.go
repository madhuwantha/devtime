package repo

import (
	"errors"
	"fmt"
	"log"
	"strings"
	"time"

	"github.com/madhuwantha/devtime/localsrc"
	"github.com/madhuwantha/devtime/localsrc/entity"
)

type TodayTask struct {
	TaskName    string
	ProjectName string
	StartTime   time.Time
	EndTime     time.Time
	IsIdle      bool
}

func GetTodayTasks() ([]TodayTask, error) {
	if localsrc.DB == nil {
		log.Println("DB is not initialized")
		return nil, errors.New("DB is not initialized")
	}

	today := time.Now().Format("2006-01-02")

	query := `
	SELECT task.name as task_name, project.name as project_name, datetime(start_time) as start_time, datetime(end_time) as end_time
	FROM timelog
	INNER JOIN project on project.project_id = timelog.project_id
	INNER JOIN task on task.task_id = timelog.task_id

	WHERE date(timelog.start_time) = date('%s') ORDER BY timelog.id DESC
	`

	query = fmt.Sprintf(query, today)
	log.Printf("Query: %s", query)
	rows, err := localsrc.DB.Query(query)
	if err != nil {
		log.Printf("Query failed: %v", err)
	}
	defer rows.Close()
	var tasks []TodayTask = []TodayTask{}
	for rows.Next() {
		var task TodayTask
		var startTimeStr, endTimeStr string
		err := rows.Scan(&task.TaskName, &task.ProjectName, &startTimeStr, &endTimeStr)
		if err == nil {
			task.StartTime, err = time.Parse("2006-01-02 15:04:05", startTimeStr)
			if err == nil {
				task.EndTime, err = time.Parse("2006-01-02 15:04:05", endTimeStr)
			}
		}
		if err != nil {
			log.Printf("Scan failed: %v", err)
			continue
		}
		task.IsIdle = false
		tasks = append(tasks, task)
	}

	queryIdle := `
	SELECT datetime(start_time) as start_time, datetime(end_time) as end_time
	FROM idlelog
	WHERE date(start_time) = date('%s') ORDER BY id DESC
	`
	queryIdle = fmt.Sprintf(queryIdle, today)
	rowsIdle, err := localsrc.DB.Query(queryIdle)
	if err != nil {
		log.Printf("Query failed: %v", err)
	}
	defer rowsIdle.Close()
	for rowsIdle.Next() {
		var idleLog TodayTask
		var startTimeStr, endTimeStr string
		err := rowsIdle.Scan(&startTimeStr, &endTimeStr)
		if err == nil {
			idleLog.StartTime, err = time.Parse("2006-01-02 15:04:05", startTimeStr)
			if err == nil {
				idleLog.EndTime, err = time.Parse("2006-01-02 15:04:05", endTimeStr)
			}
		}
		if err != nil {
			log.Printf("Scan failed: %v", err)
			continue
		}
		idleLog.IsIdle = true
		tasks = append(tasks, idleLog)
	}
	return tasks, err
}

func GetTasks(projectId *string, statusList *[]string) ([]entity.Task, error) {
	if localsrc.DB == nil {
		log.Println("DB is not initialized")
		return nil, errors.New("DB is not initialized")
	}

	size := len(*statusList)
	query := "SELECT id, name, task_id, project_id, status FROM task"
	if projectId != nil {
		query = fmt.Sprintf("%s WHERE project_id = $1", query)
		if size == 1 {
			query = fmt.Sprintf("%s AND status = $2", query)
		} else if size > 1 {
			query = fmt.Sprintf("%s ANd status IN (%s)", query, strings.Join(*statusList, ", "))
		}
	} else {
		if size == 1 {
			query = fmt.Sprintf("%s WHERE status = $1", query)
		} else if size > 1 {
			query = fmt.Sprintf("%s WHERE status IN (%s)", query, strings.Join(*statusList, ", "))
		}
	}
	query = fmt.Sprintf("%s ORDER BY id DESC", query)

	rows, err := localsrc.DB.Query(query, projectId)
	if err != nil {
		log.Printf("Query failed: %v \n", err)
		return nil, err
	}
	defer rows.Close()
	var tasks []entity.Task = []entity.Task{}
	for rows.Next() {
		var task entity.Task
		err := rows.Scan(&task.ID, &task.Name, &task.TaskId, &task.ProjectId, &task.Status)
		if err != nil {
			log.Printf("Scan failed: %v \n", err)
			continue
		}
		tasks = append(tasks, task)
	}

	return tasks, nil
}

func GetTask(taskId string) (entity.Task, error) {
	if localsrc.DB == nil {
		log.Printf("DB is not initialized")
		return entity.Task{}, localsrc.ErrDBNotInitialized
	}
	var task entity.Task
	err := localsrc.DB.QueryRow("SELECT id, name, task_id, project_id, status FROM task WHERE task_id = $1", taskId).Scan(&task.ID, &task.Name, &task.TaskId, &task.ProjectId, &task.Status)

	if err != nil {
		log.Printf("Query failed: %v", err)
		return entity.Task{}, err
	}

	return task, nil
}

func InsertTask(task entity.Task) {
	if localsrc.DB == nil {
		log.Fatal("DB is not initialized")
	}

	stmt, err := localsrc.DB.Prepare("INSERT INTO task(name, task_id, project_id) VALUES (?, ?, ?)")
	if err != nil {
		log.Fatalf("Prepare failed: %v", err)
	}
	defer stmt.Close()
	_, err = stmt.Exec(task.Name, task.TaskId, task.ProjectId)
	if err != nil {
		log.Fatalf("Exec failed: %v", err)
	}
	log.Printf("Inserted task: %v", task.Name)
}

func UpdateTaskStatus(taskId string, status string) (bool, error) {
	if localsrc.DB == nil {
		log.Printf("DB is not initialized")
		return false, localsrc.ErrDBNotInitialized
	}

	stmt, err := localsrc.DB.Prepare("UPDATE task SET status = ? WHERE task_id = ?")
	if err != nil {
		log.Printf("Prepare failed: %v", err)
		return false, err
	}
	defer stmt.Close()
	_, err = stmt.Exec(status, taskId)
	if err != nil {
		log.Printf("Exec failed: %v", err)
		return false, err
	}
	return true, nil
}
