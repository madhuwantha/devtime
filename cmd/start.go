/*
Copyright © 2025 NAME HERE <EMAIL ADDRESS>
*/
package cmd

import (
	"time"

	"github.com/madhuwantha/devtime/cmdsrc/localstorage"
	"github.com/spf13/cobra"
)

var project, task string

// startCmd represents the start command
var startCmd = &cobra.Command{
	Use:   "start",
	Short: "Start tracking time",
	Long:  `Start tracking time for a project and task.`,
	Run: func(cmd *cobra.Command, args []string) {
		now := time.Now()
		localstorage.InsertStart(project, task, now)
	},
}

func init() {

	startCmd.Flags().StringVar(&project, "project", "", "Project name")
	startCmd.Flags().StringVar(&task, "task", "", "Task name")
	startCmd.MarkFlagRequired("project")
	startCmd.MarkFlagRequired("task")

	rootCmd.AddCommand(startCmd)
}
