package idle

import (
	"fmt"
	"time"
)

type IdleChecker interface {
	GetIdleTime() (time.Duration, error)
}

func GetIdleTime() (time.Duration, error) {
	return getIdleTime()
}

func IdleHandler() {
	fmt.Println("Inactivity detected. Take action.")
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
			fmt.Println(err)
			continue
		}
		if idle >= threshold {
			onInactivity()
		}
	}
}
