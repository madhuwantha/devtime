package main

import (
	"context"
	"fmt"
	"log"
	"sync"
	"time"

	"github.com/joho/godotenv"
	"github.com/madhuwantha/devtime/localsrc"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx           context.Context
	timerChan     chan bool
	isWorking     bool
	isPaused      bool
	totalBreak    time.Duration
	startTime     time.Time
	pauseAt       time.Time
	taskTimers    map[string]*TaskTimer
	taskMutex     sync.Mutex
	pipWindowOpen bool
	monitorChan   chan bool
	isIdle        bool
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{
		timerChan:  make(chan bool),
		totalBreak: time.Duration(0),
		taskTimers: make(map[string]*TaskTimer),
		isIdle:     false,
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
	a.monitorChan = make(chan bool)

	localsrc.InitDB()

	// Start monitoring window state for PiP window
	go a.monitorWindowState()
}

func StopMonitor() {
	StopIdleWatcher()
}

// generateProjectId generates a simple project ID
func generateProjectId() string {
	return time.Now().Format("20060102150405") // YYYYMMDDHHMMSS format
}

// monitorWindowState monitors the main window state and shows/hides PiP window
func (a *App) monitorWindowState() {
	ticker := time.NewTicker(500 * time.Millisecond) // Check every 500ms
	defer ticker.Stop()

	for {
		select {
		case <-a.monitorChan:
			return
		case <-ticker.C:
			if a.ctx == nil {
				continue
			}

			// Check if window is minimized
			isMinimized := runtime.WindowIsMinimised(a.ctx)

			// Show PiP window if minimized, hide if not
			if isMinimized && !a.pipWindowOpen {
				// a.showPipWindow()
				// log.Println("PiP window shown--------------------------------")
			} else if !isMinimized && a.pipWindowOpen {
				// a.hidePipWindow()
				// runtime.WindowShow(a.ctx)
				// log.Println("PiP window hidden--------------------------------")
			}
		}
	}
}

// showPipWindow creates and shows the picture-in-picture window
func (a *App) showPipWindow() {
	if a.pipWindowOpen {
		return
	}

	// Get current timer value
	var timerValue string
	if a.isWorking {
		elapsed := time.Since(a.startTime) - a.totalBreak
		timerValue = fmt.Sprintf("%02d:%02d:%02d",
			int(elapsed.Hours()),
			int(elapsed.Minutes()),
			int(elapsed.Seconds()))
	} else {
		timerValue = "00:00:00"
	}

	// Create HTML content for PiP window
	htmlContent := a.generatePipHTML(timerValue, a.isWorking, a.isPaused)

	// Create native PiP window (macOS only for now)
	createNativePipWindow(htmlContent, 280, 120)

	a.pipWindowOpen = true
	log.Println("PiP window shown")
}

// hidePipWindow hides the picture-in-picture window
func (a *App) hidePipWindow() {
	if !a.pipWindowOpen {
		return
	}

	hideNativePipWindow()
	a.pipWindowOpen = false
	runtime.WindowShow(a.ctx)
	log.Println("PiP window hidden")
}

// generatePipHTML creates the HTML content for the PiP window
func (a *App) generatePipHTML(timerValue string, isWorking, isPaused bool) string {
	var status string
	if isPaused {
		status = "⏸ Paused"
	} else {
		status = "▶ Working"
	}
	if isWorking {
		status = "▶ Working"
	}

	return fmt.Sprintf(`
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<style>
		body {
			margin: 0;
			padding: 12px;
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
			background: linear-gradient(135deg, #1e293b 0%%, #7c3aed 100%%);
			color: white;
			border-radius: 12px;
			overflow: hidden;
		}
		.container {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			height: 100%%;
		}
		.timer {
			font-size: 32px;
			font-weight: bold;
			margin-bottom: 8px;
			text-shadow: 0 2px 4px rgba(0,0,0,0.3);
		}
		.status {
			font-size: 12px;
			opacity: 0.8;
		}
	</style>
</head>
<body>
	<div class="container">
		<div class="timer">%s</div>
		<div class="status">%s</div>
	</div>
	<script>
		// Listen for timer updates
		window.addEventListener('message', function(event) {
			if (event.data.type === 'timer:update') {
				document.querySelector('.timer').textContent = event.data.value;
			}
			if (event.data.type === 'status:update') {
				document.querySelector('.status').textContent = event.data.value;
			}
		});
	</script>
</body>
</html>
	`, timerValue, status)
}

// GetPipWindowState returns whether the PiP window is currently open
func (a *App) GetPipWindowState() bool {
	return a.pipWindowOpen
}
