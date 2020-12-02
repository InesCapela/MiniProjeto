package controllers

import (
	"api/model"
	"api/services"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func AddPersonToPlace(c *gin.Context) {
	services.OpenDatabase()

	var place = &model.Places{}
	var data = model.SocketInfo{}
	c.BindJSON(&data)
	services.Db.Where("name = ?", data.Place).First(&place)

	if place.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"status": http.StatusNotFound, "message": "Place not found!"})
		return
	}

	place.People = place.People + 1
	services.Db.Save(&place)

	defer services.Db.Close()
	c.JSON(http.StatusOK, gin.H{"status": http.StatusOK, "placeID": place.ID, "placeName": place.Name, "people": place.People})
}

func SubPersonFromPlace(c *gin.Context) {
	services.OpenDatabase()

	var place = &model.Places{}
	var data = model.SocketInfo{}
	c.BindJSON(&data)
	services.Db.Where("name = ?", data.Place).First(&place)

	if place.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"status": http.StatusNotFound, "message": "Place not found!"})
		return
	}

	if place.People > 0 {
		place.People = place.People - 1
		services.Db.Save(&place)
	}

	defer services.Db.Close()
	c.JSON(http.StatusOK, gin.H{"status": http.StatusOK, "placeID": place.ID, "placeName": place.Name, "people": place.People})
}

func ChangeUserToPlace(c *gin.Context) {
	services.OpenDatabase()

	//////////////////////////
	// Find user
	var user model.Users
	uname, exists := c.Get("username")

	services.Db.Where("username = ?", uname).First(&user)
	if exists == false {
		c.JSON(http.StatusNotFound, gin.H{"status": http.StatusNotFound, "message": "User not found!"})
		return
	}

	//////////////////////////
	// Find place
	var place model.Places
	var data model.SocketInfo
	c.BindJSON(&data)
	services.Db.Where("name = ?", data.Place).First(&place)

	if place.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"status": http.StatusNotFound, "message": "Place not found!"})
		return
	}

	//////////////////////////
	// Add place
	//user.CurrentPlace = &place

	users := []model.Users{}
	var existsUser model.Users
	services.Db.Model(&place).Association("ActiveStaff").Find(&existsUser)

	//if existsUser.ID == 0 {
	fmt.Println("ADDED")
	services.Db.Model(&place).Association("ActiveStaff").Append(&user)
	services.Db.Save(&place)

	services.Db.Model(&place).Association("ActiveStaff").Find(&users)
	//}

	defer services.Db.Close()
	c.JSON(http.StatusOK, gin.H{"status": http.StatusOK, "users": users})

}

func DisconnectUser(c *gin.Context) {
	services.OpenDatabase()

	//////////////////////////
	// Find user
	var user model.Users
	uname, exists := c.Get("username")

	services.Db.Where("username = ?", uname).First(&user)
	if exists == false {
		fmt.Println("USER INVALID")
		c.JSON(http.StatusNotFound, gin.H{"status": http.StatusNotFound, "message": "User not found!"})
		return
	}

	//////////////////////////
	// Find place
	var place model.Places
	var data model.SocketInfo
	c.BindJSON(&data)
	services.Db.Where("name = ?", data.Place).First(&place)

	if place.ID == 0 {
		fmt.Println("PLACE INVALID")
		c.JSON(http.StatusNotFound, gin.H{"status": http.StatusNotFound, "message": "Place not found!"})
		return
	}

	//////////////////////////
	// Add place
	//user.CurrentPlace = &place

	users := []model.Users{}
	var existsUser model.Users
	services.Db.Model(&place).Association("ActiveStaff").Find(&existsUser)

	if existsUser.ID != 0 {
		fmt.Println("REMOVED")
		services.Db.Model(&place).Association("ActiveStaff").Delete(&user)
		services.Db.Save(&place)

		services.Db.Model(&place).Association("ActiveStaff").Find(&users)
	}

	defer services.Db.Close()
	c.JSON(http.StatusOK, gin.H{"status": http.StatusOK, "users": users})

}
