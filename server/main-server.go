package main

import (
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/madhuwantha/devtime/server/api"
	"github.com/madhuwantha/devtime/server/mongostorage"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}
	r := gin.Default()
	r.Use(cors.Default()) // All origins allowed by default
	mongostorage.Connect()
	mongostorage.SetupGracefulShutdown()

	devtime := r.Group("/api")
	{
		devtime.GET("/logs", func(c *gin.Context) {})
		devtime.POST("/start", api.StartTask)
		devtime.POST("/stop", api.StopTask)

	}

	prjects := r.Group("/api/projects")
	{
		prjects.POST("/", api.SaveProject)
		prjects.POST("/:projectId/users/:userId/role/:role/add-user", api.AddUserToProject)
		prjects.POST("/:projectId/users/:userId/add-user", api.AddUserToProject)
		prjects.GET("/users/:userId", api.GetUserProjects)
	}

	projectstasks := r.Group("/api/projects/:projectId/tasks")
	{
		projectstasks.POST("/", api.SaveTask)
	}

	tasks := r.Group("/api/tasks")
	{
		tasks.POST("/:taskId/users/:userId/role/:role/add-user", api.AddUserToTask)
		tasks.POST("/:taskId/users/:userId/add-user", api.AddUserToTask)
	}

	users := r.Group("/api/users")
	{
		users.POST("/", api.SaveUserInfo)
	}

	r.Run()

}
