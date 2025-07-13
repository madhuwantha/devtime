package models

import (
	"context"
	"log"

	"github.com/madhuwantha/devtime/server/mongostorage"
	"go.mongodb.org/mongo-driver/v2/bson"
)

type Project struct {
	ID    bson.ObjectID   `json:"_id,omitempty" bson:"_id,omitempty"`
	Name  string          `json:"name"`
	Code  string          `json:"code"`
	Tasks []bson.ObjectID `json:"tasks" bson:"tasks"` // only store Task IDs
}

func InsertProject(project Project) (string, error) {
	collection := mongostorage.GetClient().Database(mongostorage.DB).Collection(mongostorage.PROJECT_COLLECTION)
	_project := Project{
		Name:  project.Name,
		Code:  project.Code,
		Tasks: []bson.ObjectID{},
	}

	res, err := collection.InsertOne(context.TODO(), _project)
	if err != nil {
		log.Fatal(err)
	}
	idStr := ""
	if oid, ok := res.InsertedID.(bson.ObjectID); ok {
		idStr = oid.Hex()
	} else if str, ok := res.InsertedID.(string); ok {
		idStr = str
	} else {
		idStr = ""
	}
	return idStr, err
}

func GetProjectByCode(code string) (Project, error) {
	collection := mongostorage.GetClient().Database(mongostorage.DB).Collection(mongostorage.PROJECT_COLLECTION)
	filter := bson.M{"code": code}
	var project Project
	err := collection.FindOne(context.TODO(), filter).Decode(&project)
	if err != nil {
		log.Fatal(err)
	}
	return project, err
}

func GetProjectById(id string) (Project, error) {
	collection := mongostorage.GetClient().Database(mongostorage.DB).Collection(mongostorage.PROJECT_COLLECTION)
	filter := bson.M{"_id": bson.M{"$eq": bson.M{"$oid": id}}}
	var project Project
	err := collection.FindOne(context.TODO(), filter).Decode(&project)
	if err != nil {
		log.Fatal(err)
	}
	return project, err
}

func GetProjects() ([]Project, error) {
	collection := mongostorage.GetClient().Database(mongostorage.DB).Collection(mongostorage.PROJECT_COLLECTION)
	filter := bson.M{}
	cursor, err := collection.Find(context.TODO(), filter)
	if err != nil {
		log.Fatal(err)
	}
	var projects []Project
	for cursor.Next(context.TODO()) {
		var project Project
		err := cursor.Decode(&project)
		if err != nil {
			log.Fatal(err)
		}
		projects = append(projects, project)
	}
	return projects, err
}

func UpdateProject(project Project) error {
	collection := mongostorage.GetClient().Database(mongostorage.DB).Collection(mongostorage.PROJECT_COLLECTION)
	filter := bson.M{"_id": project.ID}
	update := bson.D{{Key: "$set", Value: bson.D{{Key: "name", Value: project.Name}}}}
	_, err := collection.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		log.Fatal(err)
	}
	return err
}

func DeleteProject(id string) error {
	collection := mongostorage.GetClient().Database(mongostorage.DB).Collection(mongostorage.PROJECT_COLLECTION)
	filter := bson.M{"_id": bson.M{"$eq": bson.M{"$oid": id}}}
	_, err := collection.DeleteOne(context.TODO(), filter)
	if err != nil {
		log.Fatal(err)
	}
	return err
}

func AddTaskToProject(projectId string, task Task) error {
	objID, err := bson.ObjectIDFromHex(projectId)
	if err != nil {
		log.Fatal(err)
	}
	collection := mongostorage.GetClient().Database(mongostorage.DB).Collection(mongostorage.PROJECT_COLLECTION)
	update := bson.D{{Key: "$push", Value: bson.D{{Key: "tasks", Value: task.ID}}}}
	_, err = collection.UpdateByID(context.TODO(), objID, update)
	if err != nil {
		log.Fatal(err)
	}
	return err
}
