package dto

type DevTimeLogRequest struct {
	Project  string `json:"project"`
	Task     string `json:"task"`
	UserName string `json:"username"`
}
