package syn

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"strings"

	"github.com/madhuwantha/devtime/localsrc"
	"github.com/madhuwantha/devtime/localsrc/entity"
	"github.com/madhuwantha/devtime/server/models"
)

func GetServerTasks(userId string) []models.Task {
	urlPars := []string{API_URL, "/tasks/users/", userId}
	url := strings.Join(urlPars, "")
	resp, err := http.Get(url)
	if err != nil {
		log.Fatalln(err)
	}
	var tasks []models.Task = make([]models.Task, 0)
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Fatalln(err)
	}
	err = json.Unmarshal(body, &tasks)
	if err != nil {
		log.Fatalln(err)
	}

	return tasks
}

func GetLocalTasks() []entity.Task {
	if localsrc.DB == nil {
		log.Fatal("DB is not initialized")
	}
	rows, err := localsrc.DB.Query("SELECT id, name, task_id, project_id FROM task ORDER BY id DESC")
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

func GetLocalProjectTasks(projectId string) []entity.Task {
	if localsrc.DB == nil {
		log.Fatal("DB is not initialized")
	}
	rows, err := localsrc.DB.Query("SELECT id, name, task_id, project_id FROM task WHERE project_id = ? ORDER BY id DESC", projectId)
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

func InsertLocalTasks(task models.Task) {
	if localsrc.DB == nil {
		log.Fatal("DB is not initialized")
	}

	stmt, err := localsrc.DB.Prepare("INSERT INTO task(name, task_id, project_id) VALUES (?, ?, ?)")
	if err != nil {
		log.Fatalf("Prepare failed: %v", err)
	}
	defer stmt.Close()
	_, err = stmt.Exec(task.Name, task.ID.String(), task.ProjectID.String())
	if err != nil {
		log.Fatalf("Exec failed: %v", err)
	}
	log.Printf("Inserted task: %v", task.Name)
}

func SynLocalTasks(userId string) {
	serverTasks := GetServerTasks(userId)
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
