package controllers

import (
	"net/http"

	"api/model"
	"api/services"

	"github.com/gin-gonic/gin"
)

func LoginHandler(c *gin.Context) {
	var creds model.Users
	var usr model.Users

	if err := c.ShouldBindJSON(&creds); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": http.StatusBadRequest, "message": "Bad request!"})
		return
	}
	services.OpenDatabase()
	services.Db.Find(&usr, "username = ? and password = ?", creds.Username, creds.Password)
	if usr.Username == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"status": http.StatusUnauthorized, "message": "Invalid User!"})
		return
	}

	// Changed 'creds' to 'usr' so it can access the field 'IsAdmin'
	token, expirationTime, isAdmin := services.GenerateTokenJWT(usr)

	if token == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"status": http.StatusUnauthorized, "message": "Access denied!"})
		return
	}
	defer services.Db.Close()
	c.JSON(http.StatusOK, gin.H{"status": http.StatusOK, "message": "Success!", "username": creds.Username, "token": token, "expirationTime": expirationTime, "isAdmin": isAdmin})
}

func RegisterHandler(c *gin.Context) {
	var creds model.Users
	var users model.Users

	if err := c.ShouldBindJSON(&creds); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": http.StatusBadRequest, "message": "Bad request!"})
		return
	}
	services.OpenDatabase()

	// search on db for duplicate username (must be unique)
	result := services.Db.Where("username = ?", creds.Username).First(&users)

	// if the query(by username) comes without a error, it means that the query found a user with that username
	if result.Error == nil {
		defer services.Db.Close()
		c.JSON(http.StatusConflict, gin.H{"status": http.StatusBadRequest, "message": "User with username '" + creds.Username + "' already exists!"})
	} else {
		services.Db.Save(&creds)
		defer services.Db.Close()
		c.JSON(http.StatusOK, gin.H{"status": http.StatusOK, "message": "Success!", "User ID": creds.ID})
	}
}

func RefreshHandler(c *gin.Context) {

	user := model.Users{
		Username: c.GetHeader("username"),
	}

	token, expirationTime, isAdmin := services.GenerateTokenJWT(user)

	if token == "" || user.Username == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"status": http.StatusUnauthorized, "message": "Access denied!"})
		return
	}

	defer services.Db.Close()
	c.JSON(http.StatusOK, gin.H{"status": http.StatusNoContent, "message": "Token updated sucessful!", "token": token, "expirationTime": expirationTime, "isAdmin": isAdmin})
}
