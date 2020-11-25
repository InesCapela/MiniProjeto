package main

import (
	"api/model"
	"api/routes"
	"api/services"
	"fmt"

	"github.com/gin-gonic/gin"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"github.com/swaggo/gin-swagger/swaggerFiles"

	socketio "github.com/googollee/go-socket.io"
	ginSwagger "github.com/swaggo/gin-swagger"
)

var identityKey = "id"

func init() {
	services.OpenDatabase()

	// Clear tables db
	services.Db.DropTableIfExists(&model.Users{})
	services.Db.DropTableIfExists(&model.Places{})

	// Create tables
	services.Db.AutoMigrate(&model.Users{})
	services.Db.AutoMigrate(&model.Places{})

	// Load mockup data
	services.LoadMockupData()

	defer services.Db.Close()
}

func initializeRoutes(router *gin.Engine) {
	authRoutes(router)
	backofficeRoutes(router)
	frontofficeRoutes(router)
	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
}

func authRoutes(router *gin.Engine) {
	auth := router.Group("/auth")
	{
		auth.POST("/login", routes.GenerateToken)
		auth.POST("/register", services.AdminAuthorizationRequired(), routes.RegisterUser)
		auth.PUT("/refresh_token", services.AdminAuthorizationRequired(), routes.RefreshToken)
	}
}

func backofficeRoutes(router *gin.Engine) {
	back := router.Group("/back")
	back.Use(services.AdminAuthorizationRequired())
	{
		back.GET("/users", routes.GetAllUsers)
		back.GET("/users/:id", routes.GetUserByID)
		back.PUT("/users/:id", routes.UpdateUser)
		back.DELETE("/users/:id", routes.DeleteUser)

		back.GET("/places/:id", routes.GetUsersFromPlace)
		back.GET("/places", routes.GetAllPlaces)
		back.POST("/places", routes.CreatePlace)
		back.PUT("/places/:id", routes.UpdatePlace)
		back.DELETE("/places/:id", routes.DeletePlace)
	}
}

func frontofficeRoutes(router *gin.Engine) {
	front := router.Group("/front")
	front.Use(services.UserAuthorizationRequired())
	{
		front.GET("/users/places", routes.GetPlacesFromUser)
		front.GET("/places/:id", routes.GetPlaceByID)
	}
}

func socketioRoutes(server *socketio.Server) {

}

func main() {
	services.FormatSwagger()

	router := gin.New()
	router.Use(gin.Logger())
	router.Use(gin.Recovery())
	router.Use(services.GinMiddleware("*"))

	//router.Use(services.ReactMiddleware())
	//router.Use(services.GinMiddleware("http://127.0.0.1:8081"))

	// Initialize routes
	initializeRoutes(router)

	// Socket io

	router.Run(":8080")
}
