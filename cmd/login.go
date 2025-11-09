/*
Copyright © 2025 NAME HERE <EMAIL ADDRESS>
*/
package cmd

import (
	"bufio"
	"fmt"
	"os"
	"strings"

	"github.com/madhuwantha/devtime/cmd/cmdsrc/cliauth"
	"github.com/spf13/cobra"
)

// loginCmd represents the login command
var loginCmd = &cobra.Command{
	Use:   "login",
	Short: "Login to the DevTime server",
	Long:  `Login to the DevTime server`,
	Run: func(cmd *cobra.Command, args []string) {

		reader := bufio.NewReader(os.Stdin)
		fmt.Print("Enter your email/username: ")
		email, err := reader.ReadString('\n')
		if err != nil {
			fmt.Println("Error reading email/username: ", err)
			return
		}
		email = strings.TrimSpace(email)
		fmt.Print("Enter your password: ")
		password, err := reader.ReadString('\n')
		if err != nil {
			fmt.Println("Error reading password: ", err)
			return
		}
		password = strings.TrimSpace(password)
		fmt.Println("Logging in with email/username: ", email)

		token, userInfo, err := cliauth.LoginUser(email, password)
		if err != nil {
			fmt.Println("Error logging in: ", err)
			return
		}
		err = cliauth.SaveToken(token)
		if err != nil {
			fmt.Println("Error saving token: ", err)
			return
		}
		err = cliauth.SaveUserInfo(userInfo)
		if err != nil {
			fmt.Println("Error saving user info: ", err)
			return
		}
		fmt.Println("Logged in successfully as ", userInfo.Username)
	},
}

func init() {
	rootCmd.AddCommand(loginCmd)

	// Here you will define your flags and configuration settings.

	// Cobra supports Persistent Flags which will work for this command
	// and all subcommands, e.g.:
	// loginCmd.PersistentFlags().String("foo", "", "A help for foo")

	// Cobra supports local flags which will only run when this command
	// is called directly, e.g.:
	// loginCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
}
