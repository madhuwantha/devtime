package models

import (
	"context"
	"log"

	"github.com/madhuwantha/devtime/server/mongostorage"
	"github.com/madhuwantha/devtime/server/utils"
)

type UserInfo struct {
	ID       string `bson:"_id,omitempty"`
	Username string `bson:"username"`
	Email    string `bson:"email"`
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
