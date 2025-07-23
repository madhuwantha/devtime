/*
Copyright © 2025 NAME HERE <EMAIL ADDRESS>
*/
package cmd

import (
	"log"
	"time"

	"github.com/madhuwantha/devtime/cmdsrc/localstorage"
	"github.com/madhuwantha/devtime/cmdsrc/logpromt"
	"github.com/madhuwantha/devtime/cmdsrc/syn"
	"github.com/spf13/cobra"
)

// var project, task string

// startCmd represents the start command
var startCmd = &cobra.Command{
	Use:   "start",
	Short: "Start tracking time",
	Long:  `Start tracking time for a project and task.`,
	Run: func(cmd *cobra.Command, args []string) {
		now := time.Now()
		log.Println(now)

		localProjects := syn.GetLocalProject()
		project, _, err := logpromt.PromptSyncSelectProject(localProjects)
		if err != nil {
			log.Fatal(err)
		}

		projectLocalTask := syn.GetLocalProjectTasks(project.ProjectId)
		task, _, err := logpromt.PromptSyncSelectTask(projectLocalTask)

		localstorage.InsertStart(project, task, now)
	},
}

func init() {

	// startCmd.Flags().StringVar(&project, "project", "", "Project name")
	// startCmd.Flags().StringVar(&task, "task", "", "Task name")
	// startCmd.MarkFlagRequired("project")
	// startCmd.MarkFlagRequired("task")

	rootCmd.AddCommand(startCmd)
}
