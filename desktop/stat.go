package main

import (
	"fmt"

	"github.com/madhuwantha/devtime/localsrc/repo"
)

func (a *App) GetTodayTasks() ([]repo.TodayTask, error) {
	tasks, err := repo.GetTodayTasks()
	if err != nil {
		fmt.Println("Error fetching today tasks:", err)
		return nil, err
	}
	return tasks, nil
}
