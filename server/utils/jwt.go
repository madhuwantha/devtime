package utils

import (
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/v2/bson"
)

type TokenPayload struct {
	ID    bson.ObjectID `json:"id,omitempty" bson:"id,omitempty"`
	Email string        `json:"email,omitempty" bson:"email,omitempty"`
}

func GenerateJWT(payload TokenPayload) (string, error) {
	generateToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub":   payload.ID.Hex(),
		"email": payload.Email,
		"exp":   time.Now().Add(time.Hour * 24).Unix(),
	})
	token, err := generateToken.SignedString([]byte(os.Getenv("SECRET")))
	if err != nil {
		return "", err
	}
	return token, nil
}
