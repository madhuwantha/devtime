package repo

import (
	"errors"
	"fmt"
	"log"
	"strings"

	"github.com/madhuwantha/devtime/localsrc"
	"github.com/madhuwantha/devtime/localsrc/entity"
)

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
