package models

import (
	"context"
	"log"

	"github.com/madhuwantha/devtime/server/mongostorage"
	"github.com/madhuwantha/devtime/server/usertypes"
	"github.com/madhuwantha/devtime/server/utils"
	"go.mongodb.org/mongo-driver/v2/bson"
)

type ProjectUser struct {
	UserId bson.ObjectID `json:"userId,omitempty" bson:"userId,omitempty"`
	Role   string        `json:"email"`
}

type Project struct {
	ID    bson.ObjectID   `json:"_id,omitempty" bson:"_id,omitempty"`
	Name  string          `json:"name"`
	Code  string          `json:"code"`
	Tasks []bson.ObjectID `json:"tasks" bson:"tasks"` // only store Task IDs
	Users []ProjectUser   `json:"users" bson:"users"`
}

func InsertProject(project Project, ownerUserId string) (string, error) {
	collection := mongostorage.GetClient().Database(mongostorage.DB).Collection(mongostorage.PROJECT_COLLECTION)

	// Convert ownerUserId to ObjectID
	ownerObjectID, err := bson.ObjectIDFromHex(ownerUserId)
	if err != nil {
		log.Printf("Error converting user ID to ObjectID: %v", err)
		return "", err
	}

	_project := Project{
		Name:  project.Name,
		Code:  project.Code,
		Tasks: []bson.ObjectID{},
		Users: []ProjectUser{
			{
				UserId: ownerObjectID,
				Role:   "OWNER",
			},
		},
	}

	res, err := collection.InsertOne(context.TODO(), _project)
	if err != nil {
		log.Printf("Error inserting project: %v", err)
		return "", err
	}
	idStr := utils.GetIdStringFromInsertOneResult(res)

	return idStr, nil
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

func AddTaskToProject(projectId string, taskId string) error {
	objID, err := bson.ObjectIDFromHex(projectId)
	if err != nil {
		log.Fatal(err)
	}
	taskObjId, err := bson.ObjectIDFromHex(taskId)
	if err != nil {
		log.Fatal(err)
	}
	collection := mongostorage.GetClient().Database(mongostorage.DB).Collection(mongostorage.PROJECT_COLLECTION)
	update := bson.D{{Key: "$push", Value: bson.D{{Key: "tasks", Value: taskObjId}}}}
	_, err = collection.UpdateByID(context.TODO(), objID, update)
	if err != nil {
		log.Fatal(err)
	}
	return err
}

func AddUserToProject(projectId string, userId string, role string) error {
	objID, err := bson.ObjectIDFromHex(projectId)
	if err != nil {
		log.Fatal(err)
	}
	userObjID, err := bson.ObjectIDFromHex(userId)
	if err != nil {
		log.Fatal(err)
	}
	collection := mongostorage.GetClient().Database(mongostorage.DB).Collection(mongostorage.PROJECT_COLLECTION)
	userRole := role
	if role == "" {
		userRole = usertypes.MEMBER
	}
	update := bson.D{{Key: "$push", Value: bson.D{{Key: "users", Value: bson.D{{Key: "UserId", Value: userObjID}, {Key: "Role", Value: userRole}}}}}}
	_, err = collection.UpdateByID(context.TODO(), objID, update)
	if err != nil {
		log.Fatal(err)
	}
	return err
}

func GetUserProjects(userId string) ([]Project, error) {
	collection := mongostorage.GetClient().Database(mongostorage.DB).Collection(mongostorage.PROJECT_COLLECTION)
	objID, err := bson.ObjectIDFromHex(userId)
	if err != nil {
		log.Fatal(err)
	}
	filter := bson.M{"users.userId": objID}
	cursor, err := collection.Find(context.TODO(), filter)
	if err != nil {
		log.Fatal(err)
	}
	var projects []Project = []Project{}
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

func GetAllProjects() ([]Project, error) {
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
