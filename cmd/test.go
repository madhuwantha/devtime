/*
Copyright © 2025 NAME HERE <EMAIL ADDRESS>
*/
package cmd

import (
	"github.com/madhuwantha/devtime/cmdsrc/syn"
	"github.com/spf13/cobra"
)

// testCmd represents the test command
var testCmd = &cobra.Command{
	Use:   "test",
	Short: "A brief description of your command",
	Long: `A longer description that spans multiple lines and likely contains examples
and usage of using your command. For example:

Cobra is a CLI library for Go that empowers applications.
This application is a tool to generate the needed files
to quickly create a Cobra application.`,
	Run: func(cmd *cobra.Command, args []string) {
		// fmt.Println("test called")

		// prompt := promptui.Select{
		// 	Label: "Select Day",
		// 	Items: []string{"Monday", "Tuesday", "Wednesday", "Thursday", "Friday",
		// 		"Saturday", "Sunday"},
		// }

		// _, result, err := prompt.Run()

		// if err != nil {
		// 	fmt.Printf("Prompt failed %v\n", err)
		// 	return
		// }

		// fmt.Printf("You choose %q\n", result)

		syn.SynLocalProjects()
	},
}

func init() {
	rootCmd.AddCommand(testCmd)
}
