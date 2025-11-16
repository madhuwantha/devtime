package repo

import (
	"errors"
	"fmt"
	"log"
	"strings"

	"github.com/madhuwantha/devtime/localsrc"
	"github.com/madhuwantha/devtime/localsrc/entity"
)

func GetProjects(statusList *[]string) ([]entity.Project, error) {
	if localsrc.DB == nil {
		log.Printf("DB is not initialized")
		return nil, errors.New("DB is not initialized")
	}

	query := "SELECT id, project_id, name, code, status FROM project"
	size := len(*statusList)
	if size == 1 {
		query = fmt.Sprintf("%s WHERE status = '%s'", query, (*statusList)[0])
	} else if size > 1 {
		query = fmt.Sprintf("%s WHERE status IN (%s)", query, strings.Join(*statusList, ", "))
	}
	query = fmt.Sprintf("%s ORDER BY id DESC", query)

	rows, err := localsrc.DB.Query(query)

	if err != nil {
		log.Printf("Query failed: %v", err)
		return nil, err
	}
	defer rows.Close()

	var projects []entity.Project
	for rows.Next() {
		var project entity.Project
		err := rows.Scan(&project.ID, &project.ProjectId, &project.Name, &project.Code, &project.Status)
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
	err := localsrc.DB.QueryRow("SELECT id, project_id, name, code, status FROM project WHERE project_id = $1", projectId).Scan(&project.ID, &project.ProjectId, &project.Name, &project.Code, &project.Status)

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

func UpdateProjectStatus(projectId string, status string) (bool, error) {
	stmt, err := localsrc.DB.Prepare("UPDATE project SET status = ? WHERE project_id = ?")
	if err != nil {
		log.Printf("Prepare failed: %v", err)
		return false, err
	}
	defer stmt.Close()
	_, err = stmt.Exec(status, projectId)
	if err != nil {
		log.Printf("Exec failed: %v", err)
		return false, err
	}
	log.Printf("Project status updated: %s", status)
	return true, nil
}
