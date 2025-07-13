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
