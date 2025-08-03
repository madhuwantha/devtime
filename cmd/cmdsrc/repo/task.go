package repo

import (
	"log"

	"github.com/madhuwantha/devtime/cmd/cmdsrc/entity"
	"github.com/madhuwantha/devtime/cmd/cmdsrc/localstorage"
)

func GetTasks() []entity.Task {
	if localstorage.DB == nil {
		log.Fatal("DB is not initialized")
	}
	rows, err := localstorage.DB.Query("SELECT id, name, task_id, project_id FROM task ORDER BY id DESC")
	if err != nil {
		log.Fatalf("Query failed: %v", err)
	}
	defer rows.Close()
	var tasks []entity.Task
	for rows.Next() {
		var task entity.Task
		err := rows.Scan(&task.ID, &task.Name, &task.TaskId, &task.ProjectId)
		if err != nil {
			log.Fatalf("Scan failed: %v", err)
		}
		tasks = append(tasks, task)
	}

	return tasks
}

func GetTask(taskId string) entity.Task {
	if localstorage.DB == nil {
		log.Fatal("DB is not initialized")
	}
	var task entity.Task
	err := localstorage.DB.QueryRow("SELECT id, name, task_id, project_id FROM task WHERE task_id = $1", taskId).Scan(&task)

	if err != nil {
		log.Fatalf("Query failed: %v", err)
	}

	return task
}
