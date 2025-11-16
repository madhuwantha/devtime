package entity

const (
	PROJECT_STATUS_ACTIVE    = "active"
	PROJECT_STATUS_INACTIVE  = "inactive"
	PROJECT_STATUS_COMPLETED = "completed"
)

type Project struct {
	ID        int
	Name      string
	Code      string
	ProjectId string
	Status    string `default:"active"`
}
