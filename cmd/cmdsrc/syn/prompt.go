package syn

import (
	"github.com/manifoldco/promptui"
)

func PromptSyncDirection() (string, error) {
	prompt := promptui.Select{
		Label: "Select What you want to do?",
		Items: []string{"Server -> Local", "Local -> Server"},
	}
	_, result, err := prompt.Run()
	return result, err
}

func PromptSyncDataType() (string, error) {
	prompt := promptui.Select{
		Label: "Select What you want to sync?",
		Items: []string{"Projects", "Tasks"},
	}
	_, result, err := prompt.Run()
	return result, err
}
