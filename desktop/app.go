package main

import (
	"context"
	"fmt"
	"log"

	"github.com/joho/godotenv"
	"github.com/madhuwantha/devtime/localstorage"
	"github.com/madhuwantha/devtime/localstorage/entity"
	"github.com/madhuwantha/devtime/localstorage/repo"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}
	a.ctx = ctx

	localstorage.InitDB()
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

func (a *App) GetProjects() []entity.Project {
	projects, err := repo.GetProjects()
	if err != nil {
		fmt.Println("Error fetching projects:", err)
		return []entity.Project{}
	}
	return projects
}
func (a *App) GetTasks() []entity.Task {
	tasks, err := repo.GetTasks()
	if err != nil {
		fmt.Println("Error fetching tasks:", err)
		return []entity.Task{}
	}
	return tasks
}
