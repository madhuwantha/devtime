/*
Copyright © 2025 NAME HERE <EMAIL ADDRESS>
*/
package cmd

import (
	"fmt"

	"github.com/madhuwantha/devtime/cmd/cmdsrc/syn"
	"github.com/spf13/cobra"
)

// synCmd represents the syn command
var synCmd = &cobra.Command{
	Use:   "syn",
	Short: "This command is used to sync data between local and server",
	Long:  `This command is used to sync data between local and server.`,
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("Here is the sync command")
		direction, err := syn.PromptSyncDirection()
		if err != nil {
			fmt.Printf("Prompt failed %v\n", err)
			return
		}

		datatype, err := syn.PromptSyncDataType()
		if err != nil {
			fmt.Printf("Prompt failed %v\n", err)
			return
		}

		fmt.Printf("Starting sync: %s %s\n", direction, datatype)
		strategy := syn.GetSyncStrategy(direction, datatype)
		if strategy != nil {
			strategy.RunSync()
		} else {
			fmt.Println("No sync strategy found")
		}
	},
}

func init() {
	rootCmd.AddCommand(synCmd)
}
