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

func (a *App) CreateProject(name string, code string) error {
	_, err := repo.InsertProject(entity.Project{Name: name, Code: code, ProjectId: generateProjectId()})
	if err != nil {
		fmt.Println("Error creating project:", err)
		return err
	}
	return nil
}
