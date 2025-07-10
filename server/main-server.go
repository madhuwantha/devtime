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
		devtime.POST("/logs", api.StartTask)

	}

	r.Run()

}
