package repo

import (
	"errors"
	"log"

	"github.com/madhuwantha/devtime/localstorage"
	"github.com/madhuwantha/devtime/localstorage/entity"
)

func GetProjects() ([]entity.Project, error) {
	if localstorage.DB == nil {
		log.Printf("DB is not initialized")
		return nil, errors.New("DB is not initialized")
	}
	rows, err := localstorage.DB.Query("SELECT id, project_id, name, code FROM project ORDER BY id DESC")

	if err != nil {
		log.Printf("Query failed: %v", err)
		return nil, err
	}
	defer rows.Close()

	var projects []entity.Project
	for rows.Next() {
		var project entity.Project
		err := rows.Scan(&project.ID, &project.ProjectId, &project.Name, &project.Code)
		if err != nil {
			log.Fatalf("Scan failed: %v", err)
			continue
		}
		projects = append(projects, project)
	}

	return projects, nil
}

func GetProject(projectId string) entity.Project {
	if localstorage.DB == nil {
		log.Fatal("DB is not initialized")
	}
	var project entity.Project
	err := localstorage.DB.QueryRow("SELECT id, project_id, name, code FROM project WHERE project_id = $1", projectId).Scan(&project)

	if err != nil {
		log.Fatalf("Query failed: %v", err)
	}

	return project
}

func InsertProject(project entity.Project) {
	stmt, err := localstorage.DB.Prepare("INSERT INTO project (project_id, name, code) VALUES (?, ?, ?)")
	if err != nil {
		log.Fatalf("Prepare failed: %v", err)
	}
	defer stmt.Close()
	_, err = stmt.Exec(project.ProjectId, project.Name, project.Code)
	if err != nil {
		log.Fatalf("Exec failed: %v", err)
	}
	log.Printf("Project inserted: %s", project.Name)
}
