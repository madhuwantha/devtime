package cliauth

import (
	"bytes"
	"encoding/json"
	"errors"
	"io"
	"log"
	"net/http"
	"strings"
)

const API_URL = "http://localhost:8080/api"

func LoginUser(email string, password string) (string, error) {
	urlPars := []string{API_URL, "/users/login"}
	url := strings.Join(urlPars, "")

	reqBody := map[string]string{"email": email, "password": password}
	reqBytes, _ := json.Marshal(reqBody)

	resp, err := http.Post(url, "application/json", bytes.NewBuffer(reqBytes))
	if err != nil {
		log.Println("Error making request to login: ", err)
		return "", err
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Println("Error reading response body: ", err)
		return "", err
	}

	type UserInfo struct {
		ID       string `json:"id"`
		Email    string `json:"email"`
		Username string `json:"username"`
	}

	var loginResponse struct {
		Message string   `json:"message"`
		Token   string   `json:"token"`
		User    UserInfo `json:"user"`
	}
	err = json.Unmarshal(body, &loginResponse)
	if err != nil {
		log.Println("Error unmarshalling login response: ", err)
		return "", errors.New("failed to unmarshal login response")
	}

	return loginResponse.Token, nil
}
