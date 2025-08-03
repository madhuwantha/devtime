//go:build windows
// +build windows

package idle

import (
	"errors"
	"time"
)

func getIdleTime() (time.Duration, error) {
	return 0, errors.New("getIdleTime is not supported on Linux")
}
