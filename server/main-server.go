package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/madhuwantha/devtime/mongostorage"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}
	r := gin.Default()
	mongostorage.Connect()

	devtime := r.Group("/api")
	{
		devtime.GET("/logs", func(c *gin.Context) {})
		devtime.POST("/logs", func(c *gin.Context) {})

	}

	r.Run()

}
