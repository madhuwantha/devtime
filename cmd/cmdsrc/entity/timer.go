package entity

import "time"

type TimeLog struct {
	ID        int
	ProjectId string
	TaskId    string
	StartTime time.Time
	EndTime   time.Time
}
