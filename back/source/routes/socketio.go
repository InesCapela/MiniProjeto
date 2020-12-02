package routes

import (
	"api/controllers"
	"sync"

	"github.com/gin-gonic/gin"
)

var mu sync.Mutex

func AddPersonToPlace(c *gin.Context) {
	mu.Lock()
	controllers.AddPersonToPlace(c)
	defer mu.Unlock()
}

func SubPersonFromPlace(c *gin.Context) {
	controllers.SubPersonFromPlace(c)
}

func ChangeUserToPlace(c *gin.Context) {
	//controllers.ChangeUserToPlace(c)
}

func DisconnectUser(c *gin.Context) {
	//controllers.ChangeUserToPlace(c)
}
