package main

import (
	"context"
	"log"
	"time"

	"github.com/joho/godotenv"
	"github.com/madhuwantha/devtime/localsrc"
	"github.com/madhuwantha/devtime/localsrc/idle"
)

// App struct
type App struct {
	ctx        context.Context
	timerChan  chan bool
	isWorking  bool
	isPaused   bool
	totalBreak time.Duration
	startTime  time.Time
	pauseAt    time.Time
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{
		timerChan:  make(chan bool),
		totalBreak: time.Duration(0),
	}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}
	a.ctx = ctx

	localsrc.InitDB()
}

func StartMonitor(threshold int) {
	idle.StartIdleWatcher(threshold)
}

func StopMonitor() {
	idle.StopIdleWatcher()
}
