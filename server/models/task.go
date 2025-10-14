package models

import (
	"context"
	"fmt"
	"log"

	"github.com/madhuwantha/devtime/server/mongostorage"
	"github.com/madhuwantha/devtime/server/taskusertypes"
	"github.com/madhuwantha/devtime/server/utils"
	"go.mongodb.org/mongo-driver/v2/bson"
)

type TaskUser struct {
	UserId bson.ObjectID `json:"userId,omitempty" bson:"userId,omitempty"`
	Role   string        `json:"role,omitempty" bson:"role,omitempty"`
}

type Task struct {
	ID        bson.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Name      string        `json:"name"`
	ProjectID bson.ObjectID `json:"projectId" bson:"projectId"`
	Users     []TaskUser    `json:"users" bson:"users"`
}

func InsertTask(task Task, projectId string, ownerUserId string) (string, error) {
	task.ProjectID, _ = bson.ObjectIDFromHex(projectId)

	// Convert ownerUserId to ObjectID
	ownerObjectID, err := bson.ObjectIDFromHex(ownerUserId)
	if err != nil {
		log.Printf("Error converting user ID to ObjectID: %v", err)
		return "", err
	}

	// Add the owner as the first user with OWNER role
	task.Users = []TaskUser{
		{
			UserId: ownerObjectID,
			Role:   taskusertypes.OWNER,
		},
	}

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

func AddUserToTask(taskId string, userId string, role string) error {
	taskObjID, err := bson.ObjectIDFromHex(taskId)
	if err != nil {
		log.Fatal(err)
	}
	userObjID, err := bson.ObjectIDFromHex(userId)
	if err != nil {
		log.Fatal(err)
	}
	userTaskRole := role
	if role == "" {
		userTaskRole = taskusertypes.ASSIGNEE
	}

	collection := mongostorage.GetClient().Database(mongostorage.DB).Collection(mongostorage.TASK_COLLECTION)
	update := bson.D{{Key: "$push", Value: bson.D{{Key: "users", Value: bson.D{{Key: "UserId", Value: userObjID}, {Key: "Role", Value: userTaskRole}}}}}}
	_, err = collection.UpdateByID(context.TODO(), taskObjID, update)
	if err != nil {
		log.Fatal(err)
	}
	return err
}

func GetUserTasks(userId string) ([]Task, error) {
	userObjID, err := bson.ObjectIDFromHex(userId)
	if err != nil {
		log.Print("Error converting user ID to ObjectID: ", err)
		return []Task{}, err
	}
	collection := mongostorage.GetClient().Database(mongostorage.DB).Collection(mongostorage.TASK_COLLECTION)
	filter := bson.M{"users.userId": userObjID}
	cursor, err := collection.Find(context.TODO(), filter)
	if err != nil {
		log.Print("Error getting user tasks: ", err)
		return []Task{}, err
	}
	var tasks []Task
	for cursor.Next(context.TODO()) {
		var task Task
		err := cursor.Decode(&task)
		if err != nil {
			log.Print("Error decoding task: ", err)
			continue
		}
		fmt.Println(task)
		tasks = append(tasks, task)
	}
	return tasks, err
}
