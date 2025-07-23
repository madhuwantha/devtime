package logpromt

import (
	"github.com/madhuwantha/devtime/cmdsrc/tracker"
	"github.com/manifoldco/promptui"
)

func PromptSyncSelectProject(projects []tracker.Project) (tracker.Project, string, error) {

	prompt := promptui.Select{
		Label: "Select the Project?",
		Items: projects,
	}
	i, result, err := prompt.Run()
	return projects[i], result, err
}
func PromptSyncSelectTask(tasks []tracker.Task) (tracker.Task, string, error) {

	prompt := promptui.Select{
		Label: "Select the task?",
		Items: tasks,
	}
	i, result, err := prompt.Run()
	return tasks[i], result, err
}
