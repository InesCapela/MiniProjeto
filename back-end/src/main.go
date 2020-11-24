package main

import (
	"api/model"
	"api/routes"
	"api/services"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

var identityKey = "id"

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {

		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Credentials", "true")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Header("Access-Control-Allow-Methods", "POST,HEAD,PATCH, OPTIONS, GET, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

func init() {
	services.OpenDatabase()

	// Clear tables db
	services.Db.DropTableIfExists(&model.Users{})
	services.Db.DropTableIfExists(&model.Places{})

	services.Db.AutoMigrate(&model.Users{})
	services.Db.AutoMigrate(&model.Places{})

	// Admin user
	services.Db.Save(&model.Users{
		Username: "admin",
		Password: "password",
		IsAdmin:  true,
	})

	// users test
	services.Db.Save(&model.Users{
		Username: "user1",
		Password: "password",
		IsAdmin:  false,
	})
	services.Db.Save(&model.Users{
		Username: "user2",
		Password: "password",
		IsAdmin:  false,
	})
	services.Db.Save(&model.Users{
		Username: "user3",
		Password: "password",
		IsAdmin:  false,
	})

	// places test
	services.Db.Save(&model.Places{
		Name:      "place1",
		Latitude:  0,
		Longitude: 0,
		People:    5,
	})
	services.Db.Save(&model.Places{
		Name:      "place2",
		Latitude:  0,
		Longitude: 0,
		People:    10,
	})
	services.Db.Save(&model.Places{
		Name:      "place3",
		Latitude:  0,
		Longitude: 0,
		People:    15,
	})

	defer services.Db.Close()
}

func main() {

	services.FormatSwagger()

	// Creates a gin router with default middleware:
	// logger and recovery (crash-free) middleware
	router := gin.New()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization", "username"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	router.Use(gin.Logger())
	router.Use(gin.Recovery())

	//declareEndpoints(router)

	v1 := router.Group("/api/v1")
	{
		// User Auth
		auth := v1.Group("/auth")
		{
			auth.POST("/login", routes.GenerateToken)
			auth.POST("/register", services.AdminAuthorizationRequired(), routes.RegisterUser)
			auth.PUT("/refresh_token", services.AdminAuthorizationRequired(), routes.RefreshToken)
		}

		// Back office
		back := v1.Group("/back")
		back.Use(services.AdminAuthorizationRequired())
		{
			back.GET("/users", routes.GetAllUsers)
			back.GET("/users/:id", routes.GetUserByID)
			back.PUT("/users/:id", routes.UpdateUser)
			back.DELETE("/users/:id", routes.DeleteUser)

			back.GET("/places", routes.GetAllPlaces)
			back.GET("/places/:id", routes.GetPlaceByID)
			back.POST("/places", routes.CreatePlace)
			back.PUT("/places/:id", routes.UpdatePlace)
			back.DELETE("/places/:id", routes.DeletePlace)
		}

		// Front office

	}

	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	router.Run(":8080")
}
