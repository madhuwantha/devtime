package main

import (
	"embed"
	"log"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/mac"
)

//go:embed all:frontend/dist
var assets embed.FS

//go:embed build/appicon.png
var icon []byte

func main() {

	app := NewApp()

	err := wails.Run(&options.App{
		Title:             "Devtime",
		Width:             568,
		Height:            768,
		BackgroundColour:  &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		StartHidden:       false, // Set to true if you want to start minimized
		HideWindowOnClose: true,  // Hide instead of quit when window is closed
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		OnStartup: app.startup,
		Bind:      []interface{}{app},

		Mac: &mac.Options{
			About: &mac.AboutInfo{
				Title:   "My Application",
				Message: "© 2021 Me",
				Icon:    icon,
			},
		},
	})

	if err != nil {
		log.Fatal("Error:", err)
	}
}
