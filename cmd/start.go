/*
Copyright © 2025 NAME HERE <EMAIL ADDRESS>
*/
package cmd

import (
	"log"

	"github.com/madhuwantha/devtime/cmd/cmdsrc/logpromt"
	"github.com/madhuwantha/devtime/cmd/cmdsrc/syn"
	"github.com/madhuwantha/devtime/localsrc"
	"github.com/madhuwantha/devtime/localsrc/repo"
	"github.com/spf13/cobra"
)

var projectId, taskId string = "", ""

// startCmd represents the start command
var startCmd = &cobra.Command{
	Use:   "start",
	Short: "Start tracking time",
	Long:  `Start tracking time for a project and task.`,
	Run: func(cmd *cobra.Command, args []string) {
		var errr error
		if projectId != "" && taskId != "" {
			project, err := repo.GetProject(projectId)
			if err != nil {
				log.Printf("task not found for task id %v", taskId)
			}
			task, err := repo.GetTask(taskId)
			if err != nil {
				log.Printf("task not found for task id %v", taskId)
			}
			if err != nil {
				log.Fatal("Failed to start tracking time:", errr)
			}
			_, errr = localsrc.StartTask(project.ProjectId, task.TaskId)
		} else {
			localProjects := syn.GetLocalProject()
			project, _, err := logpromt.PromptSyncSelectProject(localProjects)
			if err != nil {
				log.Fatal(err)
			}

			projectLocalTask := syn.GetLocalProjectTasks(project.ProjectId)
			task, _, err := logpromt.PromptSyncSelectTask(projectLocalTask)

			if err != nil {
				log.Fatal(err)
			}
			_, err = localsrc.StartTask(project.ProjectId, task.TaskId)
			errr = err
		}

		if errr != nil {
			log.Println("Failed to start tracking time:", errr)
		} else {
			log.Println("Successfully started tracking time for project:", projectId, "and task:", taskId)
		}
	},
}

func init() {

	startCmd.Flags().StringVar(&projectId, "project", "", "Project id")
	startCmd.Flags().StringVar(&taskId, "task", "", "Task id")
	// startCmd.MarkFlagRequired("project")
	// startCmd.MarkFlagRequired("task")

	rootCmd.AddCommand(startCmd)
}
