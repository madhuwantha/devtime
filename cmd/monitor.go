/*
Copyright © 2025 NAME HERE <EMAIL ADDRESS>
*/
package cmd

import (
	"fmt"
	"log"
	"os"

	"github.com/madhuwantha/devtime/localsrc/idle"
	"github.com/spf13/cobra"
)

var threshold int16

// monitorCmd represents the monitor command
var monitorCmd = &cobra.Command{
	Use:   "monitor",
	Short: "Start the devtime background monitor",
	Long: `The monitor command launches a background process that tracks user activity and idle time.
It ensures only one instance runs at a time and manages its own process lifecycle.`,
	Run: func(cmd *cobra.Command, args []string) {

		fmt.Printf("%d", threshold)

		// Check if we're already running in background
		if os.Getenv("DEVTIME_DAEMON") == "1" {
			idle.RunIdleTracker(threshold)
			return
		}

		// Relaunch self in background
		// execPath, err := os.Executable()
		// if err != nil {
		// 	log.Fatal("Failed to get executable path:", err)
		// }

		execPath := "/Volumes/dIsk_1/PROJECTS/devtime/devtime"

		attr := &os.ProcAttr{
			Files: []*os.File{os.Stdin, os.Stdout, os.Stderr},
			Env:   append(os.Environ(), "DEVTIME_DAEMON=1"),
		}

		proc, err := os.StartProcess(execPath, []string{execPath, "monitor", "--threshold", fmt.Sprint(threshold)}, attr)
		if err != nil {
			log.Fatal("Failed to start background process:", err)
		}

		// Save PID
		os.WriteFile("/tmp/devtime.pid", []byte(fmt.Sprintf("%d", proc.Pid)), 0644)
		fmt.Println("Started background timer with PID:", proc.Pid)

	},
}

func init() {
	monitorCmd.Flags().Int16Var(&threshold, "threshold", 10, "Threshold time fror idle in seconds")
	monitorCmd.MarkFlagRequired("threshold")

	rootCmd.AddCommand(monitorCmd)
}
