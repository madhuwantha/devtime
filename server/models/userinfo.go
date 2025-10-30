package models

import (
	"context"
	"errors"
	"log"

	"github.com/madhuwantha/devtime/server/mongostorage"
	"github.com/madhuwantha/devtime/server/utils"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

// After (fixed):
type UserInfo struct {
	ID       bson.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"` // Both JSON and BSON tags
	Username string        `json:"username"`                           // Proper field mapping
	Email    string        `json:"email"`                              // Consistent naming
	Password string        `json:"password"`                           // Consistent naming
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

func RegisterUser(userInfo UserInfo) (string, error) {
	collection := mongostorage.GetClient().Database(mongostorage.DB).Collection(mongostorage.USER_COLLECTION)
	userInfo.Password = utils.HashPassword(userInfo.Password)
	res, err := collection.InsertOne(context.TODO(), userInfo)
	if err != nil {
		log.Print("Error registering user: ", err)
		return "", err
	}
	return utils.GetIdStringFromInsertOneResult(res), nil
}

func IsUserExists(email string) (bool, error) {
	collection := mongostorage.GetClient().Database(mongostorage.DB).Collection(mongostorage.USER_COLLECTION)
	filter := bson.M{"email": email}
	var user UserInfo
	res := collection.FindOne(context.TODO(), filter)

	if res.Err() == mongo.ErrNoDocuments {
		return false, nil
	}

	if res.Err() != nil {
		log.Println("Error finding user: ", res.Err())
		return false, res.Err()
	}
	err := res.Decode(&user)
	if err != nil {
		log.Println("Error finding user: ", err)
		return false, err
	}
	return user != UserInfo{}, nil
}

func LoginUser(email string, password string) (string, UserInfo, error) {
	collection := mongostorage.GetClient().Database(mongostorage.DB).Collection(mongostorage.USER_COLLECTION)
	filter := bson.M{"email": email}
	var user UserInfo
	err := collection.FindOne(context.TODO(), filter).Decode(&user)
	if err != nil {
		log.Print("Error finding user: ", err)
		return "", UserInfo{}, err
	}
	if !utils.VerifyPassword(password, user.Password) {
		return "", UserInfo{}, errors.New("invalid password")
	}
	jwtToken, err := utils.GenerateJWT(utils.TokenPayload{
		ID:    user.ID,
		Email: user.Email,
	})
	if err != nil {
		return "", UserInfo{}, errors.New("error generating JWT")
	}
	user.Password = ""
	return jwtToken, user, nil
}
