package main

import (
	"fmt"
	"log"

	"github.com/madhuwantha/devtime/localsrc"
	"github.com/madhuwantha/devtime/localsrc/entity"
	"github.com/madhuwantha/devtime/localsrc/repo"
)

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

func (a *App) GetTasks(projectId *string) []entity.Task {
	tasks, err := repo.GetTasks(projectId)
	if err != nil {
		fmt.Println("Error fetching tasks:", err)
		return []entity.Task{}
	}
	return tasks
}
