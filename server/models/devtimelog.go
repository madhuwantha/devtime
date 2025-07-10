package models

import (
	"context"
	"log"
	"time"

	"github.com/madhuwantha/devtime/server/mongostorage"
)

type DevTimeLog struct {
	ID        int       `json:"_id,omitempty" bson:"_id,omitempty"`
	Project   string    `json:"project"`
	Task      string    `json:"task"`
	StartTime time.Time `json:"startTime"`
	EndTime   time.Time `json:"endTime"`
	UserName  string    `json:"username"`
}

func IncerStart(project string, task string, userName string) error {
	now := time.Now()
	devTimeLog := DevTimeLog{
		Project:   project,
		Task:      task,
		StartTime: now,
		UserName:  userName,
	}
	collection := mongostorage.GetClient().Database(mongostorage.DB).Collection(mongostorage.COLLECTION)
	if collection == nil {
		panic("Collection is nil")
	}
	_, err := collection.InsertOne(context.TODO(), devTimeLog)
	if err != nil {
		log.Fatal(err)
	}
	return err
}
