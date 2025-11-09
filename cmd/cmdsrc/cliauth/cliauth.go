package cliauth

import (
	"bytes"
	"encoding/json"
	"errors"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

const API_URL = "http://localhost:8080/api"

type UserInfo struct {
	ID       string `json:"id"`
	Email    string `json:"email"`
	Username string `json:"username"`
}

func LoginUser(email string, password string) (string, UserInfo, error) {
	urlPars := []string{API_URL, "/users/login"}
	url := strings.Join(urlPars, "")

	reqBody := map[string]string{"email": email, "password": password}
	reqBytes, _ := json.Marshal(reqBody)

	resp, err := http.Post(url, "application/json", bytes.NewBuffer(reqBytes))
	if err != nil {
		log.Println("Error making request to login: ", err)
		return "", UserInfo{}, err
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Println("Error reading response body: ", err)
		return "", UserInfo{}, err
	}

	var loginResponse struct {
		Message string   `json:"message"`
		Token   string   `json:"token"`
		User    UserInfo `json:"user"`
	}
	err = json.Unmarshal(body, &loginResponse)
	if err != nil {
		log.Println("Error unmarshalling login response: ", err)
		return "", UserInfo{}, errors.New("failed to unmarshal login response")
	}

	return loginResponse.Token, loginResponse.User, nil
}

func GetTokenFile() (string, error) {
	home, err := os.UserHomeDir()
	if err != nil {
		return "", err
	}
	return filepath.Join(home, ".devtime", "token"), nil
}

func SaveToken(token string) error {
	tokenFile, err := GetTokenFile()
	if err != nil {
		return err
	}
	err = os.MkdirAll(filepath.Dir(tokenFile), 0700)
	if err != nil {
		return err
	}
	return os.WriteFile(tokenFile, []byte(token), 0600)
}

func GetToken() (string, error) {
	tokenFile, err := GetTokenFile()
	if err != nil {
		return "", err
	}
	token, err := os.ReadFile(tokenFile)
	if err != nil {
		return "", err
	}
	return string(token), nil
}

func GetUserInfoFile() (string, error) {
	home, err := os.UserHomeDir()
	if err != nil {
		return "", err
	}
	return filepath.Join(home, ".devtime", "userinfo"), nil
}

func SaveUserInfo(userInfo UserInfo) error {
	userInfoFile, err := GetUserInfoFile()
	if err != nil {
		return err
	}
	err = os.MkdirAll(filepath.Dir(userInfoFile), 0700)
	if err != nil {
		return err
	}
	userInfoBytes, err := json.Marshal(userInfo)
	if err != nil {
		return err
	}
	return os.WriteFile(userInfoFile, userInfoBytes, 0600)
}

func GetUserInfo() (UserInfo, error) {
	userInfoFile, err := GetUserInfoFile()
	if err != nil {
		return UserInfo{}, err
	}
	userInfoBytes, err := os.ReadFile(userInfoFile)
	if err != nil {
		return UserInfo{}, err
	}
	var userInfo UserInfo
	err = json.Unmarshal(userInfoBytes, &userInfo)
	if err != nil {
		return UserInfo{}, err
	}
	return userInfo, nil
}
