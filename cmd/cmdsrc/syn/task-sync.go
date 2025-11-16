package syn

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"strings"

	"github.com/madhuwantha/devtime/cmd/cmdsrc/cliauth"
	"github.com/madhuwantha/devtime/localsrc"
	"github.com/madhuwantha/devtime/localsrc/entity"
	"github.com/madhuwantha/devtime/server/models"
)

func GetServerTasks() []models.Task {
	userInfo, err := cliauth.GetUserInfo()
	if err != nil {
		log.Printf("Error getting user info: %v", err)
		return []models.Task{}
	}
	userId := userInfo.ID
	// Using new RESTful endpoint: GET /api/users/:userId/tasks
	urlPars := []string{API_URL, "/users/", userId, "/tasks"}
	url := strings.Join(urlPars, "")
	resp, err := http.Get(url)
	if err != nil {
		log.Printf("Error getting tasks: %v", err)
		return []models.Task{}
	}
	var tasks []models.Task = make([]models.Task, 0)
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Printf("Error unmarshalling tasks: %v", err)
		return []models.Task{}
	}
	err = json.Unmarshal(body, &tasks)
	if err != nil {
		log.Printf("Error getting tasks: %v", err)
		return []models.Task{}
	}

	return tasks
}

func GetLocalTasks() []entity.Task {
	if localsrc.DB == nil {
		log.Printf("DB is not initialized")
		return []entity.Task{}
	}
	rows, err := localsrc.DB.Query("SELECT id, name, task_id, project_id FROM task ORDER BY id DESC")
	if err != nil {
		log.Printf("Query failed: %v", err)
		return []entity.Task{}
	}
	defer rows.Close()
	var tasks []entity.Task
	for rows.Next() {
		var task entity.Task
		err := rows.Scan(&task.ID, &task.Name, &task.TaskId, &task.ProjectId)
		if err != nil {
			log.Printf("Scan failed: %v", err)
			continue
		}
		tasks = append(tasks, task)
	}

	return tasks
}

func GetLocalProjectTasks(projectId string) []entity.Task {
	if localsrc.DB == nil {
		log.Printf("DB is not initialized")
		return []entity.Task{}
	}
	rows, err := localsrc.DB.Query("SELECT id, name, task_id, project_id FROM task WHERE project_id = ? ORDER BY id DESC", projectId)
	if err != nil {
		log.Printf("Query failed: %v", err)
		return []entity.Task{}
	}
	defer rows.Close()
	var tasks []entity.Task
	for rows.Next() {
		var task entity.Task
		err := rows.Scan(&task.ID, &task.Name, &task.TaskId, &task.ProjectId)
		if err != nil {
			log.Printf("Scan failed: %v", err)
			continue
		}
		tasks = append(tasks, task)
	}
	return tasks
}

func InsertLocalTasks(task models.Task) {
	if localsrc.DB == nil {
		log.Printf("DB is not initialized")
		return
	}

	stmt, err := localsrc.DB.Prepare("INSERT INTO task(name, task_id, project_id) VALUES (?, ?, ?)")
	if err != nil {
		log.Printf("Prepare failed: %v", err)
	}
	defer stmt.Close()
	_, err = stmt.Exec(task.Name, task.ID.String(), task.ProjectID.String())
	if err != nil {
		log.Printf("Exec failed: %v", err)
	}
	log.Printf("Inserted task: %v", task.Name)
}

func SynLocalTasks() {
	serverTasks := GetServerTasks()
	localTasks := GetLocalTasks()
	log.Printf("Found %d local task", len(localTasks))
	log.Printf("Found %d server task", len(serverTasks))
	for _, serverTask := range serverTasks {
		found := false
		for _, localTask := range localTasks {
			if serverTask.ID.String() == localTask.TaskId {
				found = true
				break
			}
		}
		if !found {
			log.Printf("Task not found: %s", serverTask.Name)
			InsertLocalTasks(serverTask)
		}
	}
}
