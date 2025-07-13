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

func AddUserToProject(c *gin.Context) {
	projectId := c.Param("projectId")
	userId := c.Param("userId")
	role := c.Param("role")

	if projectId == "" || projectId == "undefined" {
		c.JSON(400, gin.H{"error": "Project ID is required"})
		return
	}

	if userId == "" || userId == "undefined" {
		c.JSON(400, gin.H{"error": "User ID is required"})
		return
	}

	err := models.AddUserToProject(projectId, userId, role)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to add user to project", "details": err})
		return
	}
	c.JSON(200, gin.H{"message": "User added to project successfully!"})
}

func GetUserProjects(c *gin.Context) {
	userId := c.Param("userId")
	if userId == "" || userId == "undefined" {
		c.JSON(400, gin.H{"error": "User ID is required"})
		return
	}
	projects, err := models.GetUserProjects(userId)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to get user projects", "details": err})
		return
	}
	c.JSON(200, projects)
}
