package repo

import (
	"errors"
	"log"

	"github.com/madhuwantha/devtime/localsrc"
	"github.com/madhuwantha/devtime/localsrc/entity"
)

func GetProjects() ([]entity.Project, error) {
	if localsrc.DB == nil {
		log.Printf("DB is not initialized")
		return nil, errors.New("DB is not initialized")
	}
	rows, err := localsrc.DB.Query("SELECT id, project_id, name, code FROM project ORDER BY id DESC")

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

func GetProject(projectId string) (entity.Project, error) {
	if localsrc.DB == nil {
		log.Printf("DB is not initialized")
		return entity.Project{}, localsrc.ErrDBNotInitialized
	}
	var project entity.Project
	err := localsrc.DB.QueryRow("SELECT id, project_id, name, code FROM project WHERE project_id = $1", projectId).Scan(&project)

	if err != nil {
		log.Printf("Query failed: %v", err)
		return entity.Project{}, err
	}

	return project, nil
}

func InsertProject(project entity.Project) (bool, error) {
	stmt, err := localsrc.DB.Prepare("INSERT INTO project (project_id, name, code) VALUES (?, ?, ?)")
	if err != nil {
		log.Printf("Prepare failed: %v", err)
		return false, err
	}
	defer stmt.Close()
	_, err = stmt.Exec(project.ProjectId, project.Name, project.Code)
	if err != nil {
		log.Printf("Exec failed: %v", err)
		return false, err
	}
	log.Printf("Project inserted: %s", project.Name)
	return true, nil
}
