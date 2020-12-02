package controllers

import (
	"api/model"
	"api/services"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func AddPersonToPlace(c *gin.Context) {
	services.OpenDatabase()

	var place = &model.Places{}
	var data = model.SocketInfo{}
	c.BindJSON(&data)
	services.Db.Where("name = ?", data.Place).First(&place)

	if place.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"status": http.StatusNotFound, "message": "Place not found!"})
		return
	}

	place.People = place.People + 1
	services.Db.Save(&place)

	defer services.Db.Close()
	c.JSON(http.StatusOK, gin.H{"status": http.StatusOK, "place": place.Name, "people": place.People})
}

func SubPersonFromPlace(c *gin.Context) {
	services.OpenDatabase()

	var place = &model.Places{}
	var data = model.SocketInfo{}
	c.BindJSON(&data)
	services.Db.Where("name = ?", data.Place).First(&place)

	if place.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"status": http.StatusNotFound, "message": "Place not found!"})
		return
	}

	if place.People > 0 {
		place.People = place.People - 1
		services.Db.Save(&place)
	}

	defer services.Db.Close()
	c.JSON(http.StatusOK, gin.H{"status": http.StatusOK, "place": place.Name, "people": place.People})
}

func ChangeUserToPlace(c *gin.Context) {
	services.OpenDatabase()

	//////////////////////////
	// Find user
	var user model.Users
	uname, exists := c.Get("username")

	services.Db.Where("username = ?", uname).First(&user)
	if exists == false {
		c.JSON(http.StatusNotFound, gin.H{"status": http.StatusNotFound, "message": "User not found!"})
		return
	}

	oldPlace := user.CurrentPlace
	//////////////////////////
	// Remove from old place
	if oldPlace != nil || oldPlace.ActiveStaff != nil || user.CurrentPlace.ID != 0 {

		fmt.Println("Active staff:")
		fmt.Println("Active staff:", oldPlace.ActiveStaff)

		/*var newActive []*model.Users



			TODO: REMOVE FROM OLD
			found := false
			for i, u := range oldPlace.ActiveStaff {
				if u.ID == user.ID {
					newActive = append(oldPlace.ActiveStaff[:i], oldPlace.ActiveStaff[i+1:]...)
					found = true
					break
				}
			}


		if found {
			oldPlace.ActiveStaff = newActive
			services.Db.Save(oldPlace)
		}
		*/
	}

	//////////////////////////
	// Add to new place
	var place = &model.Places{}
	var data = model.SocketInfo{}

	c.BindJSON(&data)
	services.Db.Where("name = ?", data.Place).First(&place)

	if place.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"status": http.StatusNotFound, "message": "Place not found!"})
		fmt.Println("Place NOT FOUND")
		return
	}

	user.CurrentPlace = place
	place.ActiveStaff = append(place.ActiveStaff, &user)
	services.Db.Save(place)
	services.Db.Save(user)

	defer services.Db.Close()
	c.JSON(http.StatusOK, gin.H{"status": http.StatusOK, "oldPlace": oldPlace.ActiveStaff, "newPlace": place.ActiveStaff})
}
