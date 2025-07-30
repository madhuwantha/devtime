/*
Copyright © 2025 NAME HERE <EMAIL ADDRESS>
*/
package cmd

import (
	"fmt"
	"os"
	"strconv"

	"github.com/spf13/cobra"
)

// stopMonitorCmd represents the stopMonitor command
var stopMonitorCmd = &cobra.Command{
	Use:   "stopMonitor",
	Short: "A brief description of your command",
	Long: `A longer description that spans multiple lines and likely contains examples
and usage of using your command. For example:

Cobra is a CLI library for Go that empowers applications.
This application is a tool to generate the needed files
to quickly create a Cobra application.`,
	Run: func(cmd *cobra.Command, args []string) {
		data, err := os.ReadFile("/tmp/devtime.pid")
		if err != nil {
			fmt.Println("No running timer found.")
			return
		}

		pid, err := strconv.Atoi(string(data))
		if err != nil {
			fmt.Println("Invalid PID in file.")
			return
		}

		process, err := os.FindProcess(pid)
		if err != nil {
			fmt.Println("Could not find process:", err)
			return
		}

		err = process.Kill()
		if err != nil {
			fmt.Println("Failed to stop process:", err)
		} else {
			fmt.Println("Timer stopped.")
			os.Remove("/tmp/devtime.pid")
		}
	},
}

func init() {
	rootCmd.AddCommand(stopMonitorCmd)
}
