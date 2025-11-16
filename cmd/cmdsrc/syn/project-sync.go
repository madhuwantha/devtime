package syn

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"

	"github.com/madhuwantha/devtime/cmd/cmdsrc/cliauth"
	"github.com/madhuwantha/devtime/localsrc/entity"
	"github.com/madhuwantha/devtime/localsrc/repo"
	"github.com/madhuwantha/devtime/server/models"
)

const API_URL = "http://localhost:8080/api"

func GetServerProjects() []models.Project {
	// Using new RESTful endpoint: GET /api/users/:userId/projects
	userInfo, err := cliauth.GetUserInfo()
	if err != nil {
		log.Printf("Error getting user info: %v", err)
		return []models.Project{}
	}
	urlPars := []string{API_URL, "/users/", userInfo.ID, "/projects"}
	url := strings.Join(urlPars, "")
	resp, err := http.Get(url)
	if err != nil {
		log.Printf("Error getting projects: %v", err)
		return []models.Project{}
	}

	var projects []models.Project = make([]models.Project, 0)
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Printf("Error unmarshalling projects: %v", err)
		return []models.Project{}
	}
	err = json.Unmarshal(body, &projects)
	if err != nil {
		log.Printf("Error getting projects: %v", err)
		return []models.Project{}
	}
	return projects
}

func GetLocalProject() []entity.Project {
	projects, err := repo.GetProjects(&[]string{})
	if err != nil {
		log.Printf("%v", err)
		return []entity.Project{}
	}
	return projects
}

func InsertLocalProject(project models.Project) {
	var projectDto entity.Project = entity.Project{
		ProjectId: project.ID.String(),
		Name:      project.Name,
		Code:      project.Code,
	}
	repo.InsertProject(projectDto)
}

func SynLocalProjects() {
	serverProjects := GetServerProjects()
	fmt.Print("serverProjects: ", serverProjects)
	localProjects := GetLocalProject()
	fmt.Print("localProjects: ", localProjects)

	for _, serverProject := range serverProjects {
		found := false
		for _, localProject := range localProjects {
			if serverProject.ID.String() == localProject.ProjectId {
				found = true
				break
			}
		}
		if !found {
			log.Printf("Project not found: %s", serverProject.Name)
			InsertLocalProject(serverProject)
		}
	}
}
