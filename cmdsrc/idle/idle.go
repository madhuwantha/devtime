package idle

import (
	"fmt"
	"os"
	"time"
)

type IdleChecker interface {
	GetIdleTime() (time.Duration, error)
}

func GetIdleTime() (time.Duration, error) {
	return getIdleTime()
}

func WatchIdle(threshold time.Duration, ticker *time.Ticker, onInactivity func()) {
	defer ticker.Stop()

	pid := os.Getpid()
	fmt.Println("My PID is:", pid)

	for range ticker.C {
		idle, err := GetIdleTime()
		if err != nil {
			fmt.Println(err)
			continue
		}
		if idle >= threshold {
			onInactivity()
			return
		}
	}
}

func WatchIdle1(threshold time.Duration, ticker *time.Ticker, onInactivity func()) {
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

func RunIdleTracker() {
	ticker := time.NewTicker(1 * time.Second)
	defer ticker.Stop()
	fmt.Println("Idle watcher started in background")

	WatchIdle1(10*time.Second, ticker, func() {
		fmt.Println("Inactivity detected. Take action.")
	})
}
