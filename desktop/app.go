package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/joho/godotenv"
	"github.com/madhuwantha/devtime/localsrc"
	"github.com/madhuwantha/devtime/localsrc/entity"
	"github.com/madhuwantha/devtime/localsrc/repo"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}
	a.ctx = ctx

	localsrc.InitDB()
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

func (a *App) GetProjects() []entity.Project {
	projects, err := repo.GetProjects()
	if err != nil {
		fmt.Println("Error fetching projects:", err)
		return []entity.Project{}
	}
	return projects
}
func (a *App) GetTasks() []entity.Task {
	tasks, err := repo.GetTasks()
	if err != nil {
		fmt.Println("Error fetching tasks:", err)
		return []entity.Task{}
	}
	return tasks
}

type StartTaskResponse struct {
	Status bool
	Error  error
}

func (a *App) StartTask(projectId string, taskId string) StartTaskResponse {
	status, err := localsrc.StartTask(projectId, taskId)
	return StartTaskResponse{
		Status: status,
		Error:  err,
	}
}
func (a *App) GetActiveTask() *entity.Task {
	task, err := repo.GetActiveTask()
	if err != nil {
		log.Printf("Error fetching active task: %v", err)
		return nil
	}
	return &task
}

func (a *App) StopTask() bool {
	status, err := localsrc.StopTask()
	if err != nil {
		log.Printf("Error stoping active task: %v", err)
		return false
	}
	return status
}

func (a *App) StartWork() bool {
	status, err := localsrc.StartWork(time.Now())
	if err != nil {
		log.Printf("Error starting work: %v", err)
		return false
	}
	StartMonitor()
	return status
}
func (a *App) StopWork() bool {
	status, err := localsrc.StopWork(time.Now())
	if err != nil {
		log.Printf("Error stoping active work: %v", err)
		return false
	}
	StopMonitor()
	return status
}

func (a *App) IsWorking() (bool, error) {
	return localsrc.IsWorking()
}

func StartMonitor() {

}
func StopMonitor() {

}
