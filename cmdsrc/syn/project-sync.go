package syn

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"strings"

	"github.com/madhuwantha/devtime/cmdsrc/localstorage"
	"github.com/madhuwantha/devtime/cmdsrc/tracker"
	"github.com/madhuwantha/devtime/server/models"
)

const API_URL = "http://localhost:8080/api"

func GetServerProjects() []models.Project {
	urlPars := []string{API_URL, "/projects/users/", "6873e2fb6ebc409486ceb87c"}
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

func GetLocalProject() []tracker.Project {
	if localstorage.DB == nil {
		log.Fatal("DB is not initialized")
	}
	rows, err := localstorage.DB.Query("SELECT id, project_id, name, code FROM projects ORDER BY id DESC")

	if err != nil {
		log.Fatalf("Query failed: %v", err)
	}
	defer rows.Close()

	var projects []tracker.Project
	for rows.Next() {
		var project tracker.Project
		err := rows.Scan(&project.ID, &project.ProjectId, &project.Name, &project.Code)
		if err != nil {
			log.Fatalf("Scan failed: %v", err)
			continue
		}
		projects = append(projects, project)
	}

	return projects
}

func InsertLocalProject(project models.Project) {
	stmt, err := localstorage.DB.Prepare("INSERT INTO projects (project_id, name, code) VALUES (?, ?, ?)")
	if err != nil {
		log.Fatalf("Prepare failed: %v", err)
	}
	defer stmt.Close()
	_, err = stmt.Exec(project.ID.String(), project.Name, project.Code)
	if err != nil {
		log.Fatalf("Exec failed: %v", err)
	}
	log.Printf("Project inserted: %s", project.Name)
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
