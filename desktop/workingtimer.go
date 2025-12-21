package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/madhuwantha/devtime/localsrc"
	"github.com/madhuwantha/devtime/localsrc/idle"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

func (a *App) StartWork() bool {
	status, err := localsrc.StartWork(time.Now())
	if err != nil {
		log.Printf("Error starting work: %v", err)
		return false
	}
	StartMonitor(10, a)
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
	StartMonitor(10, a)
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
					int(elapsed.Hours())%24,
					int(elapsed.Minutes())%60,
					int(elapsed.Seconds())%60,
				)
				runtime.EventsEmit(a.ctx, "workingTimer:update", formatted)
				// Update PiP window if open
				if a.pipWindowOpen {
					htmlContent := a.generatePipHTML(formatted, a.isWorking, a.isPaused)
					updateNativePipWindowContent(htmlContent)
				}
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
				// Update PiP window if open
				if a.pipWindowOpen {
					htmlContent := a.generatePipHTML(formatted, a.isWorking, a.isPaused)
					updateNativePipWindowContent(htmlContent)
				}
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

func StartMonitor(threshold int, a *App) {
	StartIdleWatcher(threshold, a)
}

var cancelIdleWatcher context.CancelFunc

func StartIdleWatcher(thresholdSeconds int, a *App) {
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
				idleTime, err := idle.GetIdleTime()
				if err != nil {
					fmt.Println("Error:", err)
					continue
				}
				if idleTime >= threshold {
					if !a.isIdle {
						a.isIdle = true
						idle.IdleHandler()
					}
				} else {
					if a.isIdle {
						a.isIdle = false
						idle.IdleStopHandler()
					}
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
