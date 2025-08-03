/*
Copyright © 2025 NAME HERE <EMAIL ADDRESS>
*/
package cmd

import (
	"log"
	"time"

	"github.com/madhuwantha/devtime/cmd/cmdsrc/localstorage"
	"github.com/madhuwantha/devtime/cmd/cmdsrc/logpromt"
	"github.com/madhuwantha/devtime/cmd/cmdsrc/repo"
	"github.com/madhuwantha/devtime/cmd/cmdsrc/syn"
	"github.com/spf13/cobra"
)

var projectId, taskId string = "", ""

// startCmd represents the start command
var startCmd = &cobra.Command{
	Use:   "start",
	Short: "Start tracking time",
	Long:  `Start tracking time for a project and task.`,
	Run: func(cmd *cobra.Command, args []string) {
		now := time.Now()
		log.Println(now)

		if projectId != "" && taskId != "" {
			project := repo.GetProject(projectId)
			task := repo.GetTask(taskId)
			localstorage.InsertStart(project, task, now)
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

			localstorage.InsertStart(project, task, now)
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
