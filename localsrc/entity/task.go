package entity

const (
	TASK_PENDING     = "pending"
	TASK_IN_PROGRESS = "in_progress"
	TASK_ON_HOLD     = "on_hold"
	TASK_COMPLETED   = "completed"
)

type Task struct {
	ID        int
	Name      string
	ProjectId string
	TaskId    string
	Status    string
}
