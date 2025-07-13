package api

import (
	"github.com/gin-gonic/gin"
	"github.com/madhuwantha/devtime/server/models"
)

func SaveProject(c *gin.Context) {
	var project models.Project
	if err := c.ShouldBindJSON(&project); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	id, err := models.InsertProject(project)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to insert project", "details": err})
		return
	}
	c.JSON(201, gin.H{"message": "Project inserted successfully!", "id": id})

}
