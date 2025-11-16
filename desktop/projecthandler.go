package main

import (
	"fmt"

	"github.com/madhuwantha/devtime/localsrc/entity"
	"github.com/madhuwantha/devtime/localsrc/repo"
)

func (a *App) GetProjects(statusList *[]string) ([]entity.Project, error) {
	projects, err := repo.GetProjects(statusList)
	if err != nil {
		fmt.Println("Error fetching projects:", err)
		return []entity.Project{}, err
	}
	return projects, nil
}

func (a *App) CreateProject(name string, code string) error {
	_, err := repo.InsertProject(entity.Project{Name: name, Code: code, ProjectId: generateProjectId()})
	if err != nil {
		fmt.Println("Error creating project:", err)
		return err
	}
	return nil
}

func (a *App) UpdateProjectStatus(projectId string, status string) (bool, error) {
	_, err := repo.UpdateProjectStatus(projectId, status)
	if err != nil {
		fmt.Println("Error updating project status:", err)
		return false, err
	}
	return true, nil
}

func (a *App) GetProject(projectId string) (entity.Project, error) {
	project, err := repo.GetProject(projectId)
	if err != nil {
		fmt.Println("Error fetching project:", err)
		return entity.Project{}, err
	}
	return project, nil
}
