package main

import (
	"fmt"

	"github.com/madhuwantha/devtime/localsrc/entity"
	"github.com/madhuwantha/devtime/localsrc/repo"
)

func (a *App) GetProjects() []entity.Project {
	projects, err := repo.GetProjects()
	if err != nil {
		fmt.Println("Error fetching projects:", err)
		return []entity.Project{}
	}
	return projects
}
