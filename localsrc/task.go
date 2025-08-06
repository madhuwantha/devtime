package localsrc

import (
	"time"
)

func StartTask(projectId string, taskId string) (bool, error) {
	now := time.Now()
	status, err := InsertStart(projectId, taskId, now)
	if err != nil {
		return false, err
	}
	return status, nil
}
func StopTask() (bool, error) {
	now := time.Now()
	status, err := InsertStop(now)
	if err != nil {
		return false, err
	}
	return status, nil
}
