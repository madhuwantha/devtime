package main

import (
	"embed"
	"log"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/mac"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
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
		MinWidth:          300,
		MinHeight:         400,
		BackgroundColour:  &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		StartHidden:       false, // Set to true if you want to start minimized
		HideWindowOnClose: true,  // Hide instead of quit when window is closed
		AlwaysOnTop:       false, // Main window should not always be on top
		Frameless:         false, // Keep window frame for better UX
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
			// Picture-in-picture window level for macOS
			WindowIsTranslucent: false,
		},
		Windows: &windows.Options{
			// Windows-specific options for picture-in-picture
			IsZoomControlEnabled: true,
		},
	})

	if err != nil {
		log.Fatal("Error:", err)
	}
}
