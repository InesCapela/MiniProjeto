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
		back.POST("/users-places/:id", routes.AddPlaceToUser)
		back.DELETE("/users-places/:id", routes.RemovePlaceFromUser)
		back.GET("/users-places/:id", routes.GetPlacesFromUserID)

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
	// User connected
	server.OnConnect("/", func(s socketio.Conn) error {
		fmt.Println("socket.io> new connection ...")

		// AUTH
		server.OnEvent("", "set-token", func(s socketio.Conn, data string) {
			s.SetContext(services.ParseToken(data))

			if s.Context() == nil {
				fmt.Println("socket.io> invalid token!")
				s.Close()
			}

			inter := s.Context()
			fmt.Println("socket.io> username:", inter.(*model.SocketInfo).Username)
			fmt.Println("socket.io> place:", inter.(*model.SocketInfo).Place)
		})

		return nil
	})

	// Add people to room
	server.OnEvent("/", "add-people", func(s socketio.Conn, data string) {
		socketInfo := s.Context().(*model.SocketInfo)
		fmt.Println("socket.io> (", socketInfo.Username, ") added one person to:", socketInfo.Place)

		placeName, people := services.AddPersonToPlace(*socketInfo)

		if placeName != "" {
			// BROADCAST GERAL IN ROOM
			s.Emit("update-place", people)
			fmt.Println("socketio> new values ", placeName, " - ", people)
		}
	})

	// Sub people to room
	server.OnEvent("/", "sub-people", func(s socketio.Conn, data string) {
		socketInfo := s.Context().(*model.SocketInfo)
		fmt.Println("socket.io> (", socketInfo.Username, ") subtracted one person from:", socketInfo.Place)

		placeName, people := services.SubPersonFromPlace(*socketInfo)

		if placeName != "" {
			// BROADCAST GERAL IN ROOM
			fmt.Println("socket.io> new values", placeName, "-", people)
		}
	})

	// Change room
	server.OnEvent("/", "change-place", func(s socketio.Conn, data string) {
		socketInfo := s.Context().(*model.SocketInfo)
		fmt.Println("socket.io> (", socketInfo.Username, ") wants to change place from:", socketInfo.Place, "to:", data)
		services.ChangeUserToPlace(socketInfo, data)
	})

	//  User disconnected
	server.OnDisconnect("/", func(s socketio.Conn, err string) {
		//socketInfo := s.Context().(*model.SocketInfo)
		//fmt.Println("socket.io> (", socketInfo.Username, ") disconnected! Last seen on:", socketInfo.Place)
	})

}

func main() {
	services.FormatSwagger()

	router := gin.New()
	router.Use(gin.Logger())
	router.Use(gin.Recovery())
	router.Use(services.GinMiddleware("*"))

	//router.Use(services.ReactMiddleware())
	// router.Use(services.GinMiddleware("http://localhost:3000"))

	// Initialize routes
	initializeRoutes(router)

	// Socket io
	server := socketio.NewServer(nil)
	socketioRoutes(server)

	router.GET("/socket.io/*any", gin.WrapH(server))
	router.POST("/socket.io/*any", gin.WrapH(server))

	go server.Serve()
	defer server.Close()

	router.Run(":8080")
}
