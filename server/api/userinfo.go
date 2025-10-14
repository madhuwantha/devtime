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

func GetUserInfo(c *gin.Context) {
	userId := c.Param("userId")
	if userId == "" || userId == "undefined" {
		c.JSON(400, gin.H{"error": "User ID is required"})
		return
	}
	// Note: You'll need to implement GetUserById in models
	// For now, returning a placeholder response
	c.JSON(200, gin.H{"message": "GetUserInfo endpoint - implement GetUserById in models", "userId": userId})
}

func GetAllUsers(c *gin.Context) {
	users, err := models.GetAllUsers()
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to get users", "details": err})
		return
	}

	// Ensure we always return an array, even if empty
	if users == nil {
		users = []models.UserInfo{}
	}

	c.JSON(200, users)
}

func RegisterUser(c *gin.Context) {
	var userInfo models.UserInfo
	if err := c.ShouldBindJSON(&userInfo); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	exists, err := models.IsUserExists(userInfo.Email)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to check if user exists", "details": err})
		return
	}
	if exists {
		c.JSON(400, gin.H{"error": "User already exists", "email": userInfo.Email})
		return
	}

	id, err := models.RegisterUser(userInfo)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to register user", "details": err})
		return
	}
	c.JSON(201, gin.H{"message": "User registered successfully!", "id": id})
}

func LoginUser(c *gin.Context) {
	var loginInfo struct {
		Email    string `json:"email" binding:"required"`
		Password string `json:"password" binding:"required"`
	}
	if err := c.ShouldBindJSON(&loginInfo); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	token, err := models.LoginUser(loginInfo.Email, loginInfo.Password)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to login user", "details": err})
		return
	}
	c.JSON(200, gin.H{"message": "User logged in successfully!", "token": token})
}
