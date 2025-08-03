package repo

import (
	"errors"
	"log"

	"github.com/madhuwantha/devtime/localsrc"
	"github.com/madhuwantha/devtime/localsrc/entity"
)

func GetTasks() ([]entity.Task, error) {
	if localsrc.DB == nil {
		log.Println("DB is not initialized")
		return nil, errors.New("DB is not initialized")
	}
	rows, err := localsrc.DB.Query("SELECT id, name, task_id, project_id FROM task ORDER BY id DESC")
	if err != nil {
		log.Printf("Query failed: %v \n", err)
		return nil, err
	}
	defer rows.Close()
	var tasks []entity.Task = []entity.Task{}
	for rows.Next() {
		var task entity.Task
		err := rows.Scan(&task.ID, &task.Name, &task.TaskId, &task.ProjectId)
		if err != nil {
			log.Printf("Scan failed: %v \n", err)
			continue
		}
		tasks = append(tasks, task)
	}

	return tasks, nil
}

func GetTask(taskId string) entity.Task {
	if localsrc.DB == nil {
		log.Fatal("DB is not initialized")
	}
	var task entity.Task
	err := localsrc.DB.QueryRow("SELECT id, name, task_id, project_id FROM task WHERE task_id = $1", taskId).Scan(&task)

	if err != nil {
		log.Fatalf("Query failed: %v", err)
	}

	return task
}
