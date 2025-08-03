package logpromt

import (
	"github.com/madhuwantha/devtime/localstorage/entity"
	"github.com/manifoldco/promptui"
)

func PromptSyncSelectProject(projects []entity.Project) (entity.Project, string, error) {

	prompt := promptui.Select{
		Label: "Select the Project?",
		Items: projects,
	}
	i, result, err := prompt.Run()
	return projects[i], result, err
}
func PromptSyncSelectTask(tasks []entity.Task) (entity.Task, string, error) {

	prompt := promptui.Select{
		Label: "Select the task?",
		Items: tasks,
	}
	i, result, err := prompt.Run()
	return tasks[i], result, err
}
