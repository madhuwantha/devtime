/*
Copyright © 2025 NAME HERE <EMAIL ADDRESS>
*/
package cmd

import (
	"fmt"

	"github.com/madhuwantha/devtime/cmdsrc/syn"
	"github.com/manifoldco/promptui"
	"github.com/spf13/cobra"
)

// synCmd represents the syn command
var synCmd = &cobra.Command{
	Use:   "syn",
	Short: "This command is used to sync data between local and server",
	Long:  `This command is used to sync data between local and server.`,
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("Here is the sync command")

		prompt := promptui.Select{
			Label: "Select What you want to do?",
			Items: []string{"Server -> Local", "Local -> Server"},
		}

		_, way, err := prompt.Run()

		if err != nil {
			fmt.Printf("Prompt failed %v\n", err)
			return
		}

		fmt.Printf("Lets start to sync %q\n", way)

		if way == "Server -> Local" {

			prompt := promptui.Select{
				Label: "Select What you want to sync?",
				Items: []string{"Projects", "Tasks"},
			}
			_, datatype, err := prompt.Run()
			if err != nil {
				fmt.Printf("Prompt failed %v\n", err)
				return
			}
			fmt.Printf("Lets start to sync %q %v\n", datatype, way)

			switch datatype {
			case "Projects":
				syn.SynLocalProjects()
				fmt.Println("Syncing Projects from Server to Local is completed")
			case "Tasks":
			}

		} else {

		}
	},
}

func init() {
	rootCmd.AddCommand(synCmd)
}
