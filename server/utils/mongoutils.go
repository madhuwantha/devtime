package utils

import (
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

func GetIdStringFromInsertOneResult(res *mongo.InsertOneResult) string {
	idStr := ""
	if oid, ok := res.InsertedID.(bson.ObjectID); ok {
		idStr = oid.Hex()
	} else if str, ok := res.InsertedID.(string); ok {
		idStr = str
	} else {
		idStr = ""
	}
	return idStr
}
