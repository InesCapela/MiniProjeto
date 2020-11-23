package routes

import (
	"api/controllers"

	"github.com/gin-gonic/gin"
)

// @Summary Listar lugares
// @Description Lista todos os lugares
// @Accept  json
// @Produce  json
// @Router /places/ [get]
// @Success 200 {object} model.Places
// @Failure 404 "Not found"
// @Failure 401 "Unauthorized"
func GetAllPlaces(c *gin.Context) {
	controllers.GetAllPlaces(c)
}

// @Summary Lista lugar
// @Description Lista um lugar pelo ID
// @Accept  json
// @Produce  json
// @Router /places/# [get]
// @Success 200 {object} model.Places
// @Failure 404 "Not found"
// @Failure 401 "Unauthorized"
func GetPlaceByID(c *gin.Context) {
	controllers.GetPlaceByID(c)
}

// @Summary Criar lugar
// @Description Cria um novo lugar
// @Accept  json
// @Produce  json
// @Router /places [post]
// @Success 200 {object} model.Places
// @Failure 400 "Not found"
// @Failure 401 "Unauthorized"
func CreatePlace(c *gin.Context) {
	controllers.CreatePlace(c)
}

// @Summary Atualizar lugar
// @Description Atualizar um lugar já existente
// @Accept  json
// @Produce  json
// @Router /places/# [put]
// @Success 200 {object} model.Places
// @Failure 404 "Not found"
// @Failure 401 "Unauthorized"
func UpdatePlace(c *gin.Context) {
	controllers.UpdatePlace(c)
}

// @Summary Apagar um lugar
// @Description Apagar um lugar existente
// @Accept  json
// @Produce  json
// @Router /places/# [delete]
// @Success 200 {object} model.Places
// @Failure 404 "Not found"
// @Failure 401 "Unauthorized"
func DeletePlace(c *gin.Context) {
	controllers.DeletePlace(c)
}
