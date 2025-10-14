package api

import (
	"github.com/gin-gonic/gin"
	"github.com/madhuwantha/devtime/server/models"
)

func SaveTask(c *gin.Context) {
	var request struct {
		Name      string `json:"name" binding:"required"`
		ProjectId string `json:"projectId" binding:"required"`
		UserId    string `json:"userId" binding:"required"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	task := models.Task{
		Name: request.Name,
	}

	id, err := models.InsertTask(task, request.ProjectId, request.UserId)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to insert task", "details": err})
		return
	}
	c.JSON(201, gin.H{"message": "Task inserted successfully!", "id": id})
}

func AddUserToTask(c *gin.Context) {
	taskId := c.Param("taskId")
	if taskId == "" || taskId == "undefined" {
		c.JSON(400, gin.H{"error": "Task ID is required"})
		return
	}

	var request struct {
		UserId string `json:"userId" binding:"required"`
		Role   string `json:"role"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	err := models.AddUserToTask(taskId, request.UserId, request.Role)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to add user to task", "details": err})
		return
	}

	c.JSON(200, gin.H{"message": "User added to task successfully!"})
}

func GetTask(c *gin.Context) {
	taskId := c.Param("taskId")
	if taskId == "" || taskId == "undefined" {
		c.JSON(400, gin.H{"error": "Task ID is required"})
		return
	}
	// Note: You'll need to implement GetTaskById in models
	// For now, returning a placeholder response
	c.JSON(200, gin.H{"message": "GetTask endpoint - implement GetTaskById in models"})
}

func GetTaskUsers(c *gin.Context) {
	taskId := c.Param("taskId")
	if taskId == "" || taskId == "undefined" {
		c.JSON(400, gin.H{"error": "Task ID is required"})
		return
	}
	// Note: You'll need to implement GetTaskById in models
	// For now, returning a placeholder response
	c.JSON(200, gin.H{"message": "GetTaskUsers endpoint - implement GetTaskById in models"})
}

func GetUserTasks(c *gin.Context) {
	userId := c.Param("userId")

	if userId == "" || userId == "undefined" {
		c.JSON(400, gin.H{"error": "User ID is required"})
		return
	}

	tasks, err := models.GetUserTasks(userId)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to get user tasks", "details": err})
		return
	}
	c.JSON(200, tasks)
}
