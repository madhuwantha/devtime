package dto

type DevTimeStartLogRequest struct {
	Project  string `json:"project"`
	Task     string `json:"task"`
	UserName string `json:"username"`
}
type DevTimeStopLogRequest struct {
	UserName string `json:"username"`
}
