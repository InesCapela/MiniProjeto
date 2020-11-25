package controllers

import (
	"api/model"
	"api/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetAllPlaces(c *gin.Context) {
	var places []model.Places

	services.OpenDatabase()

	services.Db.Find(&places)

	defer services.Db.Close()

	c.JSON(http.StatusOK, gin.H{"status": http.StatusOK, "data": places})
}

func GetPlaceByID(c *gin.Context) {
	var place model.Places
	id := c.Param("id")

	services.Db.First(&place, id)
	if place.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"status": http.StatusNotFound, "message": "Place not found!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": http.StatusOK, "data": place})
}

func GetUsersFromPlace(c *gin.Context) {
	var place model.Places
	id := c.Param("id")

	services.Db.First(&place, id)
	if place.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"status": http.StatusNotFound, "message": "Place not found!"})
		return
	}

	users := []model.Users{}
	services.Db.Model(&place).Association("Users").Find(&users)

	c.JSON(http.StatusOK, gin.H{"status": http.StatusAccepted, "data": users})
}

func CreatePlace(c *gin.Context) {
	var place model.Places

	if err := c.ShouldBindJSON(&place); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": http.StatusBadRequest, "message": "Check syntax!"})
		return
	}

	services.Db.Save(&place)
	c.JSON(http.StatusCreated, gin.H{"status": http.StatusCreated, "message": "Create successful!", "resourceId": place.ID})
}

func UpdatePlace(c *gin.Context) {
	var place model.Places

	id := c.Param("id")
	services.Db.First(&place, id)

	if place.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"status": http.StatusNotFound, "message": "Place not found!"})
		return
	}

	if err := c.ShouldBindJSON(&place); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": http.StatusBadRequest, "message": "Check request!"})
		return
	}

	services.Db.Save(place)
	c.JSON(http.StatusOK, gin.H{"status": http.StatusOK, "message": "Update succeeded!"})
}

func DeletePlace(c *gin.Context) {
	var place model.Places

	id := c.Param("id")
	services.Db.First(&place, id)

	if place.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"status": http.StatusNotFound, "message": "None found!"})
		return
	}

	services.Db.Delete(&place)
	c.JSON(http.StatusOK, gin.H{"status": http.StatusOK, "message": "Delete succeeded!"})
}
