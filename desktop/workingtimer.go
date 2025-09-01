package main

import (
	"fmt"
	"log"
	"time"

	"github.com/madhuwantha/devtime/localsrc"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

func (a *App) StartWork() bool {
	status, err := localsrc.StartWork(time.Now())
	if err != nil {
		log.Printf("Error starting work: %v", err)
		return false
	}
	StartMonitor(10)
	StartWorkingTimmer(a)
	return status
}
func (a *App) StopWork() bool {
	status, err := localsrc.StopWork(time.Now())
	if err != nil {
		log.Printf("Error stoping active work: %v", err)
		return false
	}
	StopMonitor()
	StopWorkingTimmer(a)
	return status
}

func (a *App) PauseWork() bool {
	log.Printf("Pausing work")
	status, err := localsrc.StopWork(time.Now())
	if err != nil {
		log.Printf("Error pausing active work: %v", err)
		return false
	}
	StopMonitor()
	PauseWorkingTimmer(a)
	return status
}

func (a *App) ResumeWork() bool {
	log.Printf("Resuming work")
	status, err := localsrc.StartWork(time.Now())
	if err != nil {
		log.Printf("Error resuming work: %v", err)
		return false
	}
	StartMonitor(10)
	ResumeWorkingTimmer(a)
	return status
}

func (a *App) IsWorking() (bool, error) {
	return localsrc.IsWorking()
}
func (a *App) IsPausedWorking() (bool, error) {
	return a.isPaused, nil
}

func StartWorkingTimmer(a *App) {
	if a.isWorking {
		log.Printf("Already working")
		return
	}
	a.isWorking = true

	a.timerChan = make(chan bool)

	go func() {
		startTime := time.Now()
		a.startTime = startTime

		for {
			select {
			case <-a.timerChan:
				log.Printf("Working Timer stopped")
				return
			case <-time.After(1 * time.Second):
				elapsed := time.Since(startTime)
				formatted := fmt.Sprintf(
					"%02d:%02d:%02d",
					int(elapsed.Hours()),
					int(elapsed.Minutes()),
					int(elapsed.Seconds()),
				)

				runtime.EventsEmit(a.ctx, "workingTimer:update", formatted)
			}
		}
	}()
}

func StopWorkingTimmer(a *App) {
	if !a.isWorking {
		log.Printf("Not working")
		return
	}

	a.totalBreak = time.Duration(0)
	a.isWorking = false
	a.timerChan <- true
	close(a.timerChan)
	runtime.EventsEmit(a.ctx, "workingTimer:update", "00:00:00")
}

func ResumeWorkingTimmer(a *App) {
	if a.isWorking {
		log.Printf("Already working")
		return
	}
	a.isWorking = true
	a.isPaused = false

	a.timerChan = make(chan bool)

	go func() {
		a.totalBreak += time.Since(a.pauseAt)
		for {
			select {
			case <-a.timerChan:
				log.Printf("Working Timer paused")
				return
			case <-time.After(1 * time.Second):
				elapsed := time.Since(a.startTime) - a.totalBreak
				formatted := fmt.Sprintf(
					"%02d:%02d:%02d",
					int(elapsed.Hours()),
					int(elapsed.Minutes()),
					int(elapsed.Seconds()),
				)

				runtime.EventsEmit(a.ctx, "workingTimer:update", formatted)
			}
		}
	}()
}

func PauseWorkingTimmer(a *App) {
	if !a.isWorking {
		log.Printf("Not working")
		return
	}

	a.pauseAt = time.Now()
	a.isWorking = false
	a.isPaused = true
	a.timerChan <- true
	close(a.timerChan)
	// runtime.EventsEmit(a.ctx, "workingTimer:update", "00:00:00")
}
