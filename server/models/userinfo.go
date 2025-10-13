package models

import (
	"context"
	"log"

	"github.com/madhuwantha/devtime/server/mongostorage"
	"github.com/madhuwantha/devtime/server/utils"
	"go.mongodb.org/mongo-driver/v2/bson"
)

// After (fixed):
type UserInfo struct {
	ID       bson.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"` // Both JSON and BSON tags
	Username string        `json:"username"`                           // Proper field mapping
	Email    string        `json:"email"`                              // Consistent naming
}

func InsertUserInfo(userInfo UserInfo) (string, error) {
	collection := mongostorage.GetClient().Database(mongostorage.DB).Collection(mongostorage.USER_COLLECTION)
	_userInfo := UserInfo{
		Username: userInfo.Username,
		Email:    userInfo.Email,
	}
	res, err := collection.InsertOne(context.TODO(), _userInfo)
	if err != nil {
		log.Fatal(err)
		return "", err
	}
	idStr := utils.GetIdStringFromInsertOneResult(res)
	return idStr, err
}

func GetAllUsers() ([]UserInfo, error) {
	collection := mongostorage.GetClient().Database(mongostorage.DB).Collection(mongostorage.USER_COLLECTION)

	cursor, err := collection.Find(context.TODO(), bson.M{})
	if err != nil {
		log.Printf("Error finding users: %v", err)
		return nil, err
	}
	defer cursor.Close(context.TODO())

	var users []UserInfo
	for cursor.Next(context.TODO()) {
		var user UserInfo
		if err := cursor.Decode(&user); err != nil {
			log.Printf("Error decoding user: %v", err)
			continue
		}
		users = append(users, user)
	}

	if err := cursor.Err(); err != nil {
		log.Printf("Cursor error: %v", err)
		return nil, err
	}

	log.Printf("GetAllUsers: Found %d users", len(users))
	return users, nil
}
