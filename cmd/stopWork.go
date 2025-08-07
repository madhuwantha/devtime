/*
Copyright © 2025 NAME HERE <EMAIL ADDRESS>
*/
package cmd

import (
	"log"
	"time"

	"github.com/madhuwantha/devtime/localsrc"
	"github.com/spf13/cobra"
)

// stopWorkCmd represents the stopWork command
var stopWorkCmd = &cobra.Command{
	Use:   "stopWork",
	Short: "Stops the work timer",
	Long:  `Stops the work timer`,
	Run: func(cmd *cobra.Command, args []string) {
		status, err := localsrc.StopWork(time.Now())
		if err != nil {
			log.Fatal(err)
		}

		if status {
			log.Println("Work stopped")
		} else {
			log.Println("Failed to stop work")
		}
	},
}

func init() {
	rootCmd.AddCommand(stopWorkCmd)
}
