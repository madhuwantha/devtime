package main

import (
	"github.com/madhuwantha/devtime/localsrc"
	"github.com/madhuwantha/devtime/localsrc/entity"
)

func (a *App) GetWorkTimeSummary(groupBy string) ([]entity.WorkSummary, error) {
	// return localsrc.GetWorkTimeSummary(groupBy)
	return localsrc.GetWorkTimeSummary(groupBy, "2023-01-01", "2024-12-31")
}

func (a *App) GetIdleTimeSummary(groupBy string) ([]entity.IdleSummary, error) {
	// return localsrc.GetIdleTimeSummary(groupBy)
	return localsrc.GetIdleTimeSummary(groupBy, "2023-01-01", "2024-12-31")
}

func (a *App) GetProjectTimeSummary(groupBy string) ([]entity.ProjectSummary, error) {
	// return localsrc.GetProjectTimeSummary(groupBy)
	return localsrc.GetProjectTimeSummary(groupBy, "2023-01-01", "2024-12-31")
}

func (a *App) GetTaskTimeSummary(groupBy string) ([]entity.TaskSummary, error) {
	// return localsrc.GetTaskTimeSummary(groupBy)
	return localsrc.GetTaskTimeSummary(groupBy, "2023-01-01", "2024-12-31")
}

func (a *App) GetProductivitySummary(groupBy string) ([]entity.ProductivitySummary, error) {
	// return localsrc.GetProductivitySummary(groupBy)
	return localsrc.GetProductivitySummary(groupBy, "2023-01-01", "2024-12-31")
}

func (a *App) GetPeakProductivityHours() ([]entity.PeakHourSummary, error) {
	// return localsrc.GetPeakProductivityHours()
	return localsrc.GetPeakProductivityHours("2023-01-01", "2024-12-31")
}
