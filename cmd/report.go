/*
Copyright © 2025 NAME HERE <EMAIL ADDRESS>
*/
package cmd

import (
	"fmt"
	"log"
	"time"

	"github.com/madhuwantha/devtime/localstorage"
	"github.com/spf13/cobra"
)

// reportCmd represents the report command
var reportCmd = &cobra.Command{
	Use:   "report",
	Short: "Show a summary of your time logs",
	Run: func(cmd *cobra.Command, args []string) {
		logs := localstorage.GetAllLogs()

		if len(logs) == 0 {
			log.Println("No time logs found")
			return
		}

		fmt.Println("Time Report:")
		totalDuration := time.Duration(0)

		for _, log := range logs {
			fmt.Printf("📌 %s | %s | %s\n", log.StartTime.Format("2006-01-02 15:04"), log.Project, log.Task)
			if !log.EndTime.IsZero() {
				duration := log.EndTime.Sub(log.StartTime)
				totalDuration += duration
				fmt.Printf("   → ⏱  Duration: %s\n", duration.Truncate(time.Second))
			} else {
				fmt.Println("   → ⏳ Still running")
			}
		}

		fmt.Println("---------------------------")
		fmt.Printf("✅ Total Time Tracked: %s\n", totalDuration.Truncate(time.Second))
	},
}

func init() {
	rootCmd.AddCommand(reportCmd)

	// Here you will define your flags and configuration settings.

	// Cobra supports Persistent Flags which will work for this command
	// and all subcommands, e.g.:
	// reportCmd.PersistentFlags().String("foo", "", "A help for foo")

	// Cobra supports local flags which will only run when this command
	// is called directly, e.g.:
	// reportCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
}
