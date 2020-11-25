package routes

import (
	"api/controllers"

	"github.com/gin-gonic/gin"
)

func GetAllPlaces(c *gin.Context) {
	controllers.GetAllPlaces(c)
}

func GetPlaceByID(c *gin.Context) {
	controllers.GetPlaceByID(c)
}

func CreatePlace(c *gin.Context) {
	controllers.CreatePlace(c)
}

func UpdatePlace(c *gin.Context) {
	controllers.UpdatePlace(c)
}

func DeletePlace(c *gin.Context) {
	controllers.DeletePlace(c)
}

func GetUsersFromPlace(c *gin.Context) {
	controllers.GetUsersFromPlace(c)
}
