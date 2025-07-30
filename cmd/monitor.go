/*
Copyright © 2025 NAME HERE <EMAIL ADDRESS>
*/
package cmd

import (
	"fmt"
	"log"
	"os"

	"github.com/madhuwantha/devtime/cmdsrc/idle"
	"github.com/spf13/cobra"
)

// monitorCmd represents the monitor command
var monitorCmd = &cobra.Command{
	Use:   "monitor",
	Short: "Start the devtime background monitor",
	Long: `The monitor command launches a background process that tracks user activity and idle time.
It ensures only one instance runs at a time and manages its own process lifecycle.`,
	Run: func(cmd *cobra.Command, args []string) {
		// Check if we're already running in background
		if os.Getenv("DEVTIME_DAEMON") == "1" {
			idle.RunIdleTracker()
			return
		}

		// Relaunch self in background
		execPath, err := os.Executable()
		if err != nil {
			log.Fatal("Failed to get executable path:", err)
		}

		attr := &os.ProcAttr{
			Files: []*os.File{os.Stdin, os.Stdout, os.Stderr},
			Env:   append(os.Environ(), "DEVTIME_DAEMON=1"),
		}

		proc, err := os.StartProcess(execPath, []string{execPath, "monitor"}, attr)
		if err != nil {
			log.Fatal("Failed to start background process:", err)
		}

		// Save PID
		os.WriteFile("/tmp/devtime.pid", []byte(fmt.Sprintf("%d", proc.Pid)), 0644)
		fmt.Println("Started background timer with PID:", proc.Pid)

	},
}

func init() {
	rootCmd.AddCommand(monitorCmd)
}
