package syn

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"strings"

	"github.com/madhuwantha/devtime/cmdsrc/localstorage"
	"github.com/madhuwantha/devtime/cmdsrc/tracker"
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

func GetLocalTasks() []tracker.Task {
	if localstorage.DB == nil {
		log.Fatal("DB is not initialized")
	}
	rows, err := localstorage.DB.Query("SELECT id, name, task_id, project_id FROM tasks ORDER BY id DESC")
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

func InsertLocalTasks(task models.Task) {
	if localstorage.DB == nil {
		log.Fatal("DB is not initialized")
	}

	stmt, err := localstorage.DB.Prepare("INSERT INTO tasks(name, task_id, project_id) VALUES (?, ?, ?)")
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
	log.Printf("Found %d local tasks", len(localTasks))
	log.Printf("Found %d server tasks", len(serverTasks))
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
