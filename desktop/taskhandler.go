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
	TaskID     string
	ProjectID  string
	StartTime  time.Time
	StopChan   chan bool
	IsRunning  bool
	PauseAt    time.Time
	IsPaused   bool
	totalBreak time.Duration
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

func (a *App) GetTasks(projectId *string, statusList *[]string) []entity.Task {
	tasks, err := repo.GetTasks(projectId, statusList)
	if err != nil {
		fmt.Println("Error fetching tasks:", err)
		return []entity.Task{}
	}
	return tasks
}

func (a *App) GetTask(taskId string) *entity.Task {
	task, err := repo.GetTask(taskId)
	if err != nil {
		log.Printf("Error fetching task: %v", err)
		return nil
	}
	return &task
}

func (a *App) PauseTask() bool {
	log.Printf("Pausing task")
	status, taskId, err := localsrc.StopTask()
	if err != nil {
		log.Printf("Error pausing active work: %v", err)
		return false
	}
	PauseTaskTimer(taskId, a)
	return status
}

func (a *App) ResumeTask(projectId string, taskId string) bool {
	log.Printf("Resuming task")
	status, err := localsrc.StartTask(projectId, taskId)
	if err != nil {
		log.Printf("Error resuming work: %v", err)
		return false
	}
	ResumeTaskTimer(taskId, a)
	return status
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
		IsPaused:  false,
	}
	a.taskTimers[taskId] = taskTimer

	log.Printf("Task timer for task ID %s started", taskId)
	go func() {
		startTime := time.Now()
		a.taskTimers[taskId].StartTime = startTime
		for {
			select {
			case <-a.taskTimers[taskId].StopChan:
				a.taskTimers[taskId].IsRunning = false
				log.Printf("Task timer for task ID %s stopped", a.taskTimers[taskId].TaskID)
				return
			case <-time.After(1 * time.Second):
				elapsed := time.Since(a.taskTimers[taskId].StartTime)
				fmt.Printf("Elapsed: %v\n", elapsed)
				formatted := fmt.Sprintf("%02d:%02d:%02d",
					int(elapsed.Hours())%24,
					int(elapsed.Minutes())%60,
					int(elapsed.Seconds())%60,
				)
				log.Printf("Task timer for task ID %s updated to %s", a.taskTimers[taskId].TaskID, formatted)
				runtime.EventsEmit(a.ctx, "tasktimer:update:"+a.taskTimers[taskId].TaskID, formatted)
			}
		}
	}()

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

func ResumeTaskTimer(taskId string, a *App) {
	if a.taskTimers[taskId].IsRunning {
		log.Printf("Already doing")
		return
	}
	a.taskTimers[taskId].IsRunning = true
	a.taskTimers[taskId].IsPaused = false

	a.taskTimers[taskId].StopChan = make(chan bool)

	go func() {
		a.taskTimers[taskId].totalBreak += time.Since(a.taskTimers[taskId].PauseAt)
		for {
			select {
			case <-a.taskTimers[taskId].StopChan:
				log.Printf("Working Timer paused")
				return
			case <-time.After(1 * time.Second):
				elapsed := time.Since(a.taskTimers[taskId].StartTime) - a.taskTimers[taskId].totalBreak
				formatted := fmt.Sprintf(
					"%02d:%02d:%02d",
					int(elapsed.Hours()),
					int(elapsed.Minutes()),
					int(elapsed.Seconds()),
				)
				runtime.EventsEmit(a.ctx, "tasktimer:update:"+a.taskTimers[taskId].TaskID, formatted)
			}
		}
	}()
}

func PauseTaskTimer(taskId string, a *App) {
	if !a.taskTimers[taskId].IsRunning {
		log.Printf("No running task timer found for task ID %s", taskId)
		return
	}

	a.taskTimers[taskId].PauseAt = time.Now()
	a.taskTimers[taskId].IsRunning = false
	a.taskTimers[taskId].IsPaused = true
	a.taskTimers[taskId].StopChan <- true
	close(a.taskTimers[taskId].StopChan)
	// runtime.EventsEmit(a.ctx, "workingTimer:update", "00:00:00")
}

func (a *App) CreateTask(name string, projectId string) error {
	// Generate a unique task ID
	taskId := fmt.Sprintf("TASK_%d", time.Now().Unix())

	task := entity.Task{
		Name:      name,
		TaskId:    taskId,
		ProjectId: projectId,
	}

	repo.InsertTask(task)
	return nil
}

func (a *App) UpdateTaskStatus(taskId string, status string) bool {
	_, err := repo.UpdateTaskStatus(taskId, status)
	if err != nil {
		log.Printf("Error updating task status: %v", err)
		return false
	}
	return true
}
