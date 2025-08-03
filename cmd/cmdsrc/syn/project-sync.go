package syn

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"strings"

	"github.com/madhuwantha/devtime/localstorage/entity"
	"github.com/madhuwantha/devtime/localstorage/repo"
	"github.com/madhuwantha/devtime/server/models"
)

const API_URL = "http://localhost:8080/api"

func GetServerProjects() []models.Project {
	urlPars := []string{API_URL, "/projects/users/", "6887baccee48cf2c844dee92"}
	url := strings.Join(urlPars, "")
	resp, err := http.Get(url)
	if err != nil {
		log.Fatalln(err)
	}

	var projects []models.Project = make([]models.Project, 0)
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Fatalln(err)
	}
	err = json.Unmarshal(body, &projects)
	if err != nil {
		log.Fatalln(err)
	}
	return projects
}

func GetLocalProject() []entity.Project {
	projects, err := repo.GetProjects()
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
	localProjects := GetLocalProject()

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
