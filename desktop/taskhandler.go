package main

import (
	"fmt"
	"log"
	"time"

	"github.com/madhuwantha/devtime/localsrc"
	"github.com/madhuwantha/devtime/localsrc/entity"
	"github.com/madhuwantha/devtime/localsrc/repo"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type StartTaskResponse struct {
	Status bool
	Error  error
}

type TaskTimer struct {
	TaskID    string
	ProjectID string
	StartTime time.Time
	StopChan  chan bool
	IsRunning bool
}

func (a *App) StartTask(projectId string, taskId string) StartTaskResponse {
	status, err := localsrc.StartTask(projectId, taskId)
	StartTaskTimer(taskId, projectId, a)
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
	status, taskId, err := localsrc.StopTask()
	StopTaskTimer(taskId, a)
	if err != nil {
		log.Printf("Error stoping active task: %v", err)
		return false
	}
	return status
}

func (a *App) GetTasks(projectId *string) []entity.Task {
	tasks, err := repo.GetTasks(projectId)
	if err != nil {
		fmt.Println("Error fetching tasks:", err)
		return []entity.Task{}
	}
	return tasks
}

func StartTaskTimer(taskId string, projectId string, a *App) {
	log.Printf("Starting task timer for task ID: %s", taskId)

	a.taskMutex.Lock()
	defer a.taskMutex.Unlock()

	if t, exists := a.taskTimers[taskId]; exists && t.IsRunning {
		log.Printf("Task timer for task ID %s is already running", taskId)
		return
	}

	taskTimer := &TaskTimer{
		TaskID:    taskId,
		ProjectID: projectId,
		StartTime: time.Now(),
		StopChan:  make(chan bool),
		IsRunning: true,
	}
	a.taskTimers[taskId] = taskTimer

	go func(taskTimer *TaskTimer) {
		select {
		case taskTimer.StopChan <- true:
			taskTimer.IsRunning = false
			log.Printf("Task timer for task ID %s stopped", taskTimer.TaskID)
			return
		case <-time.After(1 * time.Second):
			elapsed := time.Since(taskTimer.StartTime)
			formatted := fmt.Sprintf("%02d:%02d:%02d",
				int(elapsed.Hours())%24,
				int(elapsed.Minutes())%60,
				int(elapsed.Seconds())%60,
			)
			runtime.EventsEmit(a.ctx, "tasktimer:update:"+taskTimer.TaskID, formatted)
		}
	}(taskTimer)

}

func StopTaskTimer(taskId string, a *App) {
	log.Printf("Stopping task timer for task ID: %s", taskId)

	a.taskMutex.Lock()
	defer a.taskMutex.Unlock()

	timer, exists := a.taskTimers[taskId]

	if !exists || !timer.IsRunning {
		log.Printf("No running task timer found for task ID %s", taskId)
		return
	}
	timer.StopChan <- true
	close(timer.StopChan)
	timer.IsRunning = false
	runtime.EventsEmit(a.ctx, "tasktimer:update:"+taskId, "00:00:00")
}
