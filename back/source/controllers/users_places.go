package controllers

import (
	"api/model"
	"api/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

func AddPlaceToUser(c *gin.Context) {
	var user model.Users
	var place model.Places

	id := c.Param("id")
	type t struct {
		UserID uint `json:"user_id" binding:"required"`
	}
	var x t
	c.BindJSON(&x)

	services.Db.First(&user, x.UserID)
	if user.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"status": http.StatusNotFound, "message": "User not found!"})
		return
	}
	services.Db.First(&place, id)
	if place.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"status": http.StatusNotFound, "message": "Place not found!"})
		return
	}

	var alreadyExists model.Places
	services.Db.Model(&user).Association("Places").Find(&place)

	if alreadyExists.ID == 0 {
		services.Db.Model(&user).Association("Places").Append(&place)
		services.Db.Save(&user)
	}

	places := []model.Places{}
	services.Db.Model(&user).Association("Places").Find(&places)

	c.JSON(http.StatusOK, gin.H{"status": http.StatusAccepted, "data": places})
}

func RemovePlaceFromUser(c *gin.Context) {
	var user model.Users
	var place model.Places

	id := c.Param("id")
	type t struct {
		UserID uint `json:"user_id" binding:"required"`
	}
	var x t
	c.BindJSON(&x)

	services.Db.First(&user, x.UserID)
	if user.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"status": http.StatusNotFound, "message": "User not found!"})
		return
	}

	services.Db.First(&place, id)
	if place.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"status": http.StatusNotFound, "message": "Place not found!"})
		return
	}

	var alreadyExists model.Places
	services.Db.Model(&user).Association("Places").Find(&alreadyExists)

	if alreadyExists.ID != 0 {
		services.Db.Model(&user).Association("Places").Delete(&place)
		services.Db.Save(&user)
	}

	places := []model.Places{}
	services.Db.Model(&user).Association("Places").Find(&places)

	c.JSON(http.StatusOK, gin.H{"status": http.StatusAccepted, "data": places})
}

func AddPlace(user *model.Users, place *model.Places) {
	var exists model.Places
	services.Db.Model(&user).Association("Places").Find(&exists)

	if exists.ID != 0 {
		services.Db.Model(&user).Association("Places").Append(&place)
		services.Db.Save(&user)
	}
}

func RemovePlace(user *model.Users, place *model.Places) {
	var exists model.Places
	services.Db.Model(&user).Association("Places").Find(&exists)

	if exists.ID != 0 {
		services.Db.Model(&user).Association("Places").Delete(&place)
		services.Db.Save(&user)
	}
}
