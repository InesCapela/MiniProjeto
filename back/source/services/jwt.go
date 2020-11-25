package services

import (
	"fmt"
	"io/ioutil"
	"strings"
	"time"

	"api/model"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

var JwtKey = GetSecretKey()

func GetSecretKey() []byte {
	b, err := ioutil.ReadFile("config/secretKey.key")
	if err != nil {
		fmt.Print(err)
	}
	secretKey := string(b)
	return []byte(secretKey)
}

func GenerateTokenJWT(credentials model.Users) (string, time.Time, bool) {
	expirationTime := time.Now().Add(60 * time.Minute)

	claims := &model.Claims{
		Username: credentials.Username,
		IsAdmin:  credentials.IsAdmin,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(JwtKey)

	if err != nil {
		return "", time.Now(), false
	}

	return tokenString, expirationTime, claims.IsAdmin
}

func ValidateTokenJWT(c *gin.Context) bool {
	token, b, done := getAuthorizationToken(c)
	if done {
		return b
	}

	parts := strings.Split(token, ".")
	if len(parts) != 3 {
		return false
	}

	claims := &model.Claims{}
	tkn, err := jwt.ParseWithClaims(token, claims, func(token *jwt.Token) (interface{}, error) {
		return JwtKey, nil
	})

	if err != nil {
		if err == jwt.ErrSignatureInvalid { // || err.Error() == err2
			return false
		}
	}

	if !tkn.Valid {
		return false
	}

	return true
}

func getAuthorizationToken(c *gin.Context) (string, bool, bool) {
	var token string

	reqToken := c.Request.Header.Get("Authorization")

	if strings.TrimSpace(reqToken) != "" {
		if strings.Contains(reqToken, "Bearer") {
			splitToken := strings.Split(reqToken, "Bearer")
			token = strings.TrimSpace(splitToken[1])
			return token, false, false
		} else {
			token = strings.TrimSpace(reqToken)
			return token, false, false
		}
	} else {
		return "", false, true
	}

}
