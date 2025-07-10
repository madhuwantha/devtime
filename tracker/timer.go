package tracker

import "time"

type TimeLog struct {
	ID        int
	Project   string
	Task      string
	StartTime time.Time
	EndTime   time.Time
}
