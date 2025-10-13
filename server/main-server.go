package main

import (
	"log"
	"os"
	"strings"
	"time"

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

	// Configure CORS
	configureCORS(r)

	mongostorage.Connect()
	mongostorage.SetupGracefulShutdown()

	// Health check endpoint (outside /api group for testing)
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "ok",
			"message": "DevTime server is running",
			"cors":    "enabled",
		})
	})

	devtime := r.Group("/api")
	{
		// Time tracking endpoints
		devtime.GET("/logs", api.GetLogs)
		devtime.POST("/start", api.StartTask)
		devtime.POST("/stop", api.StopTask)

		// User endpoints
		users := devtime.Group("/users")
		{
			users.POST("/", api.SaveUserInfo)
			users.GET("/:userId", api.GetUserInfo)
			users.GET("/:userId/projects", api.GetUserProjects)
			users.GET("/:userId/tasks", api.GetUserTasks)
		}

		// Project endpoints
		projects := devtime.Group("/projects")
		{
			projects.POST("/", api.SaveProject)
			projects.GET("/:projectId", api.GetProject)
			projects.POST("/:projectId/users", api.AddUserToProject)
			projects.GET("/:projectId/users", api.GetProjectUsers)
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

// configureCORS sets up CORS middleware with appropriate settings
func configureCORS(r *gin.Engine) {
	// Get allowed origins from environment variable or use defaults
	allowedOriginsStr := os.Getenv("CORS_ALLOWED_ORIGINS")
	if allowedOriginsStr == "" {
		// Default origins for development
		allowedOriginsStr = "http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://127.0.0.1:5173"
	}

	// Parse comma-separated origins
	allowedOrigins := strings.Split(allowedOriginsStr, ",")
	// Trim whitespace from each origin
	for i, origin := range allowedOrigins {
		allowedOrigins[i] = strings.TrimSpace(origin)
	}

	// Get environment (development/production)
	env := os.Getenv("GIN_MODE")
	if env == "" {
		env = "debug" // Default to development
	}

	var corsConfig cors.Config

	if env == "release" {
		// Production CORS configuration - more restrictive
		corsConfig = cors.Config{
			AllowOrigins:     allowedOrigins,
			AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"},
			AllowHeaders:     []string{"Origin", "Content-Length", "Content-Type", "Authorization", "X-Requested-With"},
			ExposeHeaders:    []string{"Content-Length"},
			AllowCredentials: true,
			MaxAge:           12 * time.Hour,
		}
	} else {
		// Development CORS configuration - more permissive
		corsConfig = cors.Config{
			AllowAllOrigins:  true,
			AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"},
			AllowHeaders:     []string{"Origin", "Content-Length", "Content-Type", "Authorization", "X-Requested-With", "Accept", "Cache-Control"},
			ExposeHeaders:    []string{"Content-Length", "Content-Type"},
			AllowCredentials: true,
			MaxAge:           12 * time.Hour,
		}
	}

	r.Use(cors.New(corsConfig))

	// Add a simple middleware to log all requests for debugging
	r.Use(func(c *gin.Context) {
		log.Printf("Request: %s %s from origin: %s", c.Request.Method, c.Request.URL.Path, c.Request.Header.Get("Origin"))
		c.Next()
	})

	log.Printf("CORS configured for environment: %s", env)
	if env == "release" {
		log.Printf("Allowed origins: %v", allowedOrigins)
	} else {
		log.Println("CORS: All origins allowed (development mode)")
	}
}
