package idle

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/madhuwantha/devtime/localsrc/repo"
)

type IdleChecker interface {
	GetIdleTime() (time.Duration, error)
}

func GetIdleTime() (time.Duration, error) {
	return getIdleTime()
}

func IdleStopHandler() {
	err := repo.UpdateLastIdle()
	if err != nil {
		log.Printf("Error updating last idle: %v", err)
	}
}
func IdleHandler() {
	logMsg := fmt.Sprintf("%s - Inactivity detected. Take action.\n", time.Now().Format(time.RFC3339))

	err := repo.GoIdle(time.Now())
	if err != nil {
		log.Printf("Error going idle: %v", err)
	}

	// Append to log file (create if not exists)
	f, err := os.OpenFile("/tmp/idle.log", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		log.Printf("Error opening log file: %v", err)
	}
	defer f.Close()

	if _, err := f.WriteString(logMsg); err != nil {
		log.Printf("Error writing log: %v", err)
	}

	// Still print to console if you want
	fmt.Print(logMsg)
}

func RunIdleTracker(threshold int16) {
	ticker := time.NewTicker(1 * time.Second)
	defer ticker.Stop()
	fmt.Println("Idle watcher started in background")
	duration := time.Duration(threshold) * time.Second
	WatchIdle(duration, ticker, IdleHandler)
}

func WatchIdle(threshold time.Duration, ticker *time.Ticker, onInactivity func()) {
	for range ticker.C {
		idle, err := GetIdleTime()
		if err != nil {
			log.Printf("Error getting idle time: %v", err)
			continue
		}
		if idle >= threshold {
			onInactivity()
		}
	}
}
