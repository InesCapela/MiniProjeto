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
	mu.Lock()
	controllers.SubPersonFromPlace(c)
	defer mu.Unlock()
}

func ChangeUserToPlace(c *gin.Context) {
	mu.Lock()
	controllers.ChangeUserToPlace(c)
	defer mu.Unlock()
}

func DisconnectUser(c *gin.Context) {
	mu.Lock()
	controllers.DisconnectUser(c)
	defer mu.Unlock()
}
