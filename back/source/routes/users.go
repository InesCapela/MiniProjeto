package routes

import (
	"api/controllers"

	"github.com/gin-gonic/gin"
)

func GetAllUsers(c *gin.Context) {
	controllers.GetAllUsers(c)
}

func GetUserByID(c *gin.Context) {
	controllers.GetUserByID(c)
}

func UpdateUser(c *gin.Context) {
	controllers.UpdateUser(c)
}

func DeleteUser(c *gin.Context) {
	controllers.DeleteUser(c)
}

func GetPlacesFromUser(c *gin.Context) {
	controllers.GetPlacesFromUser(c)
}

func GetPlacesFromUserID(c *gin.Context) {
	controllers.GetPlacesFromUserID(c)
}

func AddPlaceToUser(c *gin.Context) {
	controllers.AddPlaceToUser(c)
}

func RemovePlaceFromUser(c *gin.Context) {
	controllers.RemovePlaceFromUser(c)
}
