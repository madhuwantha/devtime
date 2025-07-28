package idle

import (
	"log"
	"time"
)

type IdleChecker interface {
	GetIdleTime() (time.Duration, error)
}

func GetIdleTime() (time.Duration, error) {
	return getIdleTime()
}

func WatchIdle(threshold time.Duration, onInactivity func()) {
	ticker := time.NewTicker(1 * time.Second)
	defer ticker.Stop()

	for range ticker.C {
		idle, err := GetIdleTime()
		if err != nil {
			log.Printf("log %f", idle)
			continue
		}
		if idle >= threshold {
			onInactivity()
			return
		}
	}
}
