package repo

import (
	"log"

	"github.com/madhuwantha/devtime/cmd/cmdsrc/localstorage"
	"github.com/madhuwantha/devtime/cmd/cmdsrc/tracker"
)

func GetTasks() []tracker.Task {
	if localstorage.DB == nil {
		log.Fatal("DB is not initialized")
	}
	rows, err := localstorage.DB.Query("SELECT id, name, task_id, project_id FROM task ORDER BY id DESC")
	if err != nil {
		log.Fatalf("Query failed: %v", err)
	}
	defer rows.Close()
	var tasks []tracker.Task
	for rows.Next() {
		var task tracker.Task
		err := rows.Scan(&task.ID, &task.Name, &task.TaskId, &task.ProjectId)
		if err != nil {
			log.Fatalf("Scan failed: %v", err)
		}
		tasks = append(tasks, task)
	}

	return tasks
}

func GetTask(taskId string) tracker.Task {
	if localstorage.DB == nil {
		log.Fatal("DB is not initialized")
	}
	var task tracker.Task
	err := localstorage.DB.QueryRow("SELECT id, name, task_id, project_id FROM task WHERE task_id = $1", taskId).Scan(&task)

	if err != nil {
		log.Fatalf("Query failed: %v", err)
	}

	return task
}
