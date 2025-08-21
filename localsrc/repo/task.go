package repo

import (
	"errors"
	"fmt"
	"log"

	"github.com/madhuwantha/devtime/localsrc"
	"github.com/madhuwantha/devtime/localsrc/entity"
)

func GetTasks(projectId *string) ([]entity.Task, error) {
	if localsrc.DB == nil {
		log.Println("DB is not initialized")
		return nil, errors.New("DB is not initialized")
	}
	query := "SELECT id, name, task_id, project_id FROM task"
	if projectId != nil {
		query = fmt.Sprintf("%s WHERE project_id = $1", query)
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
		err := rows.Scan(&task.ID, &task.Name, &task.TaskId, &task.ProjectId)
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
	err := localsrc.DB.QueryRow("SELECT id, name, task_id, project_id FROM task WHERE task_id = $1", taskId).Scan(&task.ID, &task.Name, &task.TaskId, &task.ProjectId)

	if err != nil {
		log.Printf("Query failed: %v", err)
		return entity.Task{}, err
	}

	return task, nil
}
