package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/joho/godotenv"
	"github.com/madhuwantha/devtime/localsrc"
	"github.com/madhuwantha/devtime/localsrc/entity"
	"github.com/madhuwantha/devtime/localsrc/idle"
	"github.com/madhuwantha/devtime/localsrc/repo"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx        context.Context
	timerChan  chan bool
	isWorking  bool
	totalBreak time.Duration
	startTime  time.Time
	breakAt    time.Time
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{
		timerChan:  make(chan bool),
		totalBreak: time.Duration(0),
	}
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
func (a *App) GetTasks(projectId *string) []entity.Task {
	tasks, err := repo.GetTasks(projectId)
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
	StartMonitor(10)
	StartWorkingTimmer(a)
	return status
}
func (a *App) StopWork() bool {
	status, err := localsrc.StopWork(time.Now())
	if err != nil {
		log.Printf("Error stoping active work: %v", err)
		return false
	}
	StopMonitor()
	StopWorkingTimmer(a)
	return status
}

func (a *App) PauseWork() bool {
	status, err := localsrc.StopWork(time.Now())
	if err != nil {
		log.Printf("Error pausing active work: %v", err)
		return false
	}
	StopMonitor()
	// StopWorkingTimmer(a)
	return status
}

func (a *App) ResumeWork() bool {
	status, err := localsrc.StartWork(time.Now())
	if err != nil {
		log.Printf("Error resuming work: %v", err)
		return false
	}
	StartMonitor(10)
	// StartWorkingTimmer(a)
	return status
}

func (a *App) IsWorking() (bool, error) {
	return localsrc.IsWorking()
}

func StartMonitor(threshold int) {
	idle.StartIdleWatcher(threshold)
}

func StopMonitor() {
	idle.StopIdleWatcher()
}

func StartWorkingTimmer(a *App) {
	if a.isWorking {
		log.Printf("Already working")
		return
	}
	a.isWorking = true

	a.timerChan = make(chan bool)

	go func() {
		startTime := time.Now()
		a.startTime = startTime

		for {
			select {
			case <-a.timerChan:
				log.Printf("Working Timer stopped")
				return
			case <-time.After(1 * time.Second):
				elapsed := time.Since(startTime)
				formatted := fmt.Sprintf(
					"%02d:%02d:%02d",
					int(elapsed.Hours()),
					int(elapsed.Minutes()),
					int(elapsed.Seconds()),
				)

				runtime.EventsEmit(a.ctx, "workingTimer:update", formatted)
			}
		}
	}()
}

func StopWorkingTimmer(a *App) {
	if !a.isWorking {
		log.Printf("Not working")
		return
	}

	a.totalBreak = time.Duration(0)
	a.isWorking = false
	a.timerChan <- true
	close(a.timerChan)
	runtime.EventsEmit(a.ctx, "workingTimer:update", "00:00:00")
}

func ResumeWorkingTimmer(a *App) {
	if a.isWorking {
		log.Printf("Already working")
		return
	}
	a.isWorking = true

	a.timerChan = make(chan bool)

	go func() {
		a.totalBreak += time.Since(a.startTime)
		for {
			select {
			case <-a.timerChan:
				log.Printf("Working Timer stopped")
				return
			case <-time.After(1 * time.Second):
				elapsed := time.Since(a.startTime) - a.totalBreak
				formatted := fmt.Sprintf(
					"%02d:%02d:%02d",
					int(elapsed.Hours()),
					int(elapsed.Minutes()),
					int(elapsed.Seconds()),
				)

				runtime.EventsEmit(a.ctx, "workingTimer:update", formatted)
			}
		}
	}()
}

func PauseWorkingTimmer(a *App) {
	if !a.isWorking {
		log.Printf("Not working")
		return
	}

	a.breakAt = time.Now()
	a.isWorking = false
	a.timerChan <- true
	close(a.timerChan)
	runtime.EventsEmit(a.ctx, "workingTimer:update", "00:00:00")
}
