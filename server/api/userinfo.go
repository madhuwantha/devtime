package api

import (
	"github.com/gin-gonic/gin"
	"github.com/madhuwantha/devtime/server/models"
)

func SaveUserInfo(c *gin.Context) {
	var userInfo models.UserInfo
	if err := c.ShouldBindJSON(&userInfo); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	id, err := models.InsertUserInfo(userInfo)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to insert UserInfo", "details": err})
		return
	}
	c.JSON(201, gin.H{"message": "UserInfo inserted successfully!", "id": id})

}
