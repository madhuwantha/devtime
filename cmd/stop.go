/*
Copyright © 2025 NAME HERE <EMAIL ADDRESS>
*/
package cmd

import (
	"fmt"
	"time"

	"github.com/madhuwantha/devtime/cmd/cmdsrc/localstorage"
	"github.com/spf13/cobra"
)

// stopCmd represents the stop command
var stopCmd = &cobra.Command{
	Use:   "stop",
	Short: "Stop tracking time",
	Long:  `Stop tracking time for a project and task currently being tracked.`,
	Run: func(cmd *cobra.Command, args []string) {
		now := time.Now()
		fmt.Println("Stopping tracking time...", now.Format("2006-01-02 15:04:05"))
		localstorage.InsertStop(now)
		fmt.Println("Stopped tracking time at", now.Format("2006-01-02 15:04:05"))
	},
}

func init() {
	rootCmd.AddCommand(stopCmd)
}
