package main

import (
	"github.com/madhuwantha/devtime/localsrc"
	"github.com/madhuwantha/devtime/localsrc/entity"
)

func (a *App) GetWorkTimeSummary(groupBy string) ([]entity.WorkSummary, error) {
	return localsrc.GetWorkTimeSummary(groupBy)
}

func (a *App) GetIdleTimeSummary(groupBy string) ([]entity.IdleSummary, error) {
	return localsrc.GetIdleTimeSummary(groupBy)
}

func (a *App) GetProjectTimeSummary(groupBy string) ([]entity.ProjectSummary, error) {
	return localsrc.GetProjectTimeSummary(groupBy)
}

func (a *App) GetTaskTimeSummary(groupBy string) ([]entity.TaskSummary, error) {
	return localsrc.GetTaskTimeSummary(groupBy)
}

func (a *App) GetProductivitySummary(groupBy string) ([]entity.ProductivitySummary, error) {
	return localsrc.GetProductivitySummary(groupBy)
}

func (a *App) GetPeakProductivityHours() ([]entity.PeakHourSummary, error) {
	return localsrc.GetPeakProductivityHours()
}
