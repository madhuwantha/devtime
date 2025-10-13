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
		// Time tracking endpoints
		devtime.GET("/logs", api.GetLogs)
		devtime.POST("/start", api.StartTask)
		devtime.POST("/stop", api.StopTask)

		// User endpoints
		devtime.POST("/users", api.SaveUserInfo)
		devtime.GET("/users/:userId", api.GetUserInfo)
		devtime.GET("/users/:userId/projects", api.GetUserProjects)
		devtime.GET("/users/:userId/tasks", api.GetUserTasks)

		// Project endpoints
		projects := devtime.Group("/projects")
		{
			projects.POST("/", api.SaveProject)
			devtime.GET("/:projectId", api.GetProject)
			devtime.POST("/:projectId/users", api.AddUserToProject)
			devtime.GET("/:projectId/users", api.GetProjectUsers)
		}

		// Task endpoints
		tasks := devtime.Group("/tasks")
		{
			tasks.POST("/", api.SaveTask)
			tasks.GET("/:taskId", api.GetTask)
			tasks.POST("/:taskId/users", api.AddUserToTask)
			tasks.GET("/:taskId/users", api.GetTaskUsers)
		}
	}

	r.Run()

}
