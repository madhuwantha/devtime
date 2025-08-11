package idle

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"
)

type IdleChecker interface {
	GetIdleTime() (time.Duration, error)
}

func GetIdleTime() (time.Duration, error) {
	return getIdleTime()
}

func IdleHandler() {
	logMsg := fmt.Sprintf("%s - Inactivity detected. Take action.\n", time.Now().Format(time.RFC3339))

	// Append to log file (create if not exists)
	f, err := os.OpenFile("/tmp/idle.log", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		log.Printf("Error opening log file: %v", err)
		return
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

var cancelIdleWatcher context.CancelFunc

func StartIdleWatcher(thresholdSeconds int) {
	// Stop any existing watcher first
	StopIdleWatcher()

	ctx, cancel := context.WithCancel(context.Background())
	cancelIdleWatcher = cancel

	ticker := time.NewTicker(1 * time.Second)
	go func() {
		defer ticker.Stop()
		fmt.Println("Idle watcher started")
		threshold := time.Duration(thresholdSeconds) * time.Second

		for {
			select {
			case <-ctx.Done():
				fmt.Println("Idle watcher stopped")
				return
			case <-ticker.C:
				idle, err := GetIdleTime()
				if err != nil {
					fmt.Println("Error:", err)
					continue
				}
				if idle >= threshold {
					IdleHandler()
				}
			}
		}
	}()
}

func StopIdleWatcher() {
	if cancelIdleWatcher != nil {
		cancelIdleWatcher()
		cancelIdleWatcher = nil
	}
}
