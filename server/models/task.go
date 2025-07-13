package models

import (
	"context"
	"log"

	"github.com/madhuwantha/devtime/server/mongostorage"
	"github.com/madhuwantha/devtime/server/utils"
	"go.mongodb.org/mongo-driver/v2/bson"
)

type Task struct {
	ID        bson.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Name      string        `json:"name"`
	ProjectID bson.ObjectID `json:"projectId" bson:"projectId"`
}

func InsertTask(task Task, projectId string) (string, error) {
	task.ProjectID, _ = bson.ObjectIDFromHex(projectId)
	collection := mongostorage.GetClient().Database(mongostorage.DB).Collection(mongostorage.TASK_COLLECTION)
	saved, err := collection.InsertOne(context.TODO(), task)
	if err != nil {
		log.Fatal(err)
		return "", err
	}
	idStr := utils.GetIdStringFromInsertOneResult(saved)
	err = AddTaskToProject(projectId, idStr)
	if err != nil {
		log.Fatal(err)
	}
	return idStr, err
}
