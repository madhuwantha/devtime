package entity

// Daily/weekly/monthly work summary
type WorkSummary struct {
	Date       string  `json:"date"`
	TotalHours float64 `json:"total_hours"`
}

// Idle time per day
type IdleSummary struct {
	Date      string  `json:"date"`
	IdleHours float64 `json:"idle_hours"`
}

// Project-wise time summary
type ProjectSummary struct {
	ProjectName string  `json:"project_name"`
	Period      string  `json:"period"`
	HoursSpent  float64 `json:"hours_spent"`
}

// Task-wise time summary
type TaskSummary struct {
	TaskName    string  `json:"task_name"`
	ProjectName string  `json:"project_name"`
	Period      string  `json:"period"`
	HoursSpent  float64 `json:"hours_spent"`
}

// Productivity percentage per day
type ProductivitySummary struct {
	Date                string  `json:"date"`
	ProductivityPercent float64 `json:"productivity_percent"`
}

// Peak productivity hours
type PeakHourSummary struct {
	Hour       string  `json:"hour"`
	HoursSpent float64 `json:"hours_spent"`
}
