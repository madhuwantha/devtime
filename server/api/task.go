package api

import (
	"github.com/gin-gonic/gin"
	"github.com/madhuwantha/devtime/server/models"
)

func SaveTask(c *gin.Context) {
	var task models.Task
	if err := c.ShouldBindJSON(&task); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	projectId := c.Param("projectId")
	if projectId == "" || projectId == "undefined" {
		c.JSON(400, gin.H{"error": "Project ID is required"})
		return
	}

	id, err := models.InsertTask(task, projectId)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to insert task", "details": err})
		return
	}
	c.JSON(201, gin.H{"message": "Task inserted successfully!", "id": id})

}

func AddUserToTask(c *gin.Context) {
	taskId := c.Param("taskId")
	userId := c.Param("userId")
	role := c.Param("role")

	if taskId == "" || taskId == "undefined" {
		c.JSON(400, gin.H{"error": "Task ID is required"})
		return
	}

	if userId == "" || userId == "undefined" {
		c.JSON(400, gin.H{"error": "User ID is required"})
		return
	}

	err := models.AddUserToTask(taskId, userId, role)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to add user to task", "details": err})
		return
	}

	c.JSON(200, gin.H{"message": "User added to task successfully!"})
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
