package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/madhuwantha/devtime/server/dto"
	"github.com/madhuwantha/devtime/server/models"
)

func StartTask(c *gin.Context) {

	var devTimeLog dto.DevTimeStartLogRequest
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

func StopTask(c *gin.Context) {
	var devTimeLog dto.DevTimeStopLogRequest
	if err := c.ShouldBindJSON(&devTimeLog); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	err := models.IncerStop(devTimeLog.UserName)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert stop log", "details": err})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "Task stop log inserted successfully!"})
}

func GetLogs(c *gin.Context) {
	// Note: You'll need to implement GetLogs in models
	// For now, returning a placeholder response
	c.JSON(http.StatusOK, gin.H{"message": "GetLogs endpoint - implement GetLogs in models"})
}
