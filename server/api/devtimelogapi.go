package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/madhuwantha/devtime/server/dto"
	"github.com/madhuwantha/devtime/server/models"
)

func StartTask(c *gin.Context) {

	var devTimeLog dto.DevTimeLogRequest
	if err := c.ShouldBindJSON(&devTimeLog); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := models.IncerStart(devTimeLog.Project, devTimeLog.Task, devTimeLog.UserName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert start log", "details": err})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Task start log inserted successfully!"})
}
