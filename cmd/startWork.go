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

// startWorkCmd represents the startWork command
var startWorkCmd = &cobra.Command{
	Use:   "startWork",
	Short: "Starts the work timer",
	Long:  `Starts the work timer`,
	Run: func(cmd *cobra.Command, args []string) {
		status, err := localsrc.StartWork(time.Now())
		if err != nil {
			log.Fatal(err)
		}

		if status {
			log.Println("Work started")
		} else {
			log.Println("Failed to start work")
		}
	},
}

func init() {
	rootCmd.AddCommand(startWorkCmd)
}
