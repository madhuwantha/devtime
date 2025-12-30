package main

import (
	"fmt"
	"time"

	"github.com/madhuwantha/devtime/localsrc/repo"
)

func (a *App) GetTodayTasks(date *time.Time) ([]repo.TodayTask, error) {
	tasks, err := repo.GetTodayTasks(date)
	if err != nil {
		fmt.Println("Error fetching today tasks:", err)
		return nil, err
	}

	return tasks, nil
}
