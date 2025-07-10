package main

import (
	"log"

	"github.com/joho/godotenv"
	"github.com/madhuwantha/devtime/mongostorage"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}
	mongostorage.Connect()
}
