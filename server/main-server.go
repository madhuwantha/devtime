package main

import (
	"log"

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
	}

	tasks := r.Group("/api/projects/:projectId/tasks")
	{
		tasks.POST("/", api.SaveTask)
	}

	r.Run()

}
