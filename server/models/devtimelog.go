package models

import (
	"context"
	"log"
	"time"

	"github.com/madhuwantha/devtime/server/mongostorage"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

type DevTimeLog struct {
	ID        bson.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Project   string        `json:"project"`
	Task      string        `json:"task"`
	StartTime time.Time     `json:"startTime"`
	EndTime   time.Time     `json:"endTime"`
	UserName  string        `json:"username"`
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

func IncerStop(userName string) error {
	collection := mongostorage.GetClient().Database(mongostorage.DB).Collection(mongostorage.COLLECTION)
	filter := bson.M{"username": userName}

	cursor, err := collection.Find(
		context.TODO(),
		filter,
		options.Find().SetSort(bson.M{"_id": -1}).SetLimit(1),
	)

	if cursor == nil {
		log.Fatal("Cursor is nil")
		return err
	}

	if err != nil {
		log.Fatal(err)
		return err
	}
	var devTimeLogs []DevTimeLog
	if err = cursor.All(context.TODO(), &devTimeLogs); err != nil {
		log.Fatal(err)
		return err
	}
	log.Println("---------2", devTimeLogs)
	if len(devTimeLogs) != 1 {
		log.Fatal("No devTimeLogs found")
		return err
	}
	devTimeLog := devTimeLogs[0]

	now := time.Now()
	update := bson.D{{Key: "$set", Value: bson.D{{Key: "endtime", Value: now}}}}
	updateFilter := bson.D{{Key: "_id", Value: devTimeLog.ID}}

	_, err = collection.UpdateOne(context.TODO(), updateFilter, update)

	if err != nil {
		log.Fatal(err)
	}
	return err
}
