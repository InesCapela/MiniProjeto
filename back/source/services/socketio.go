package services

import (
	"api/model"

	"github.com/dgrijalva/jwt-go"
)

func ParseToken(token string) *model.SocketInfo {
	// Verify token
	claims := &model.Claims{}
	tkn, err := jwt.ParseWithClaims(token, claims, func(token *jwt.Token) (interface{}, error) {
		return JwtKey, nil
	})

	if err != nil {
		if err == jwt.ErrSignatureInvalid { // || err.Error() == err2
			return nil
		}
	}

	if !tkn.Valid {
		return nil
	}

	socketInfo := &model.SocketInfo{
		Username: claims.Username,
		Place:    "", // ""
	}

	defer Db.Close()
	return socketInfo
}

func AddPersonToPlace(socketInfo model.SocketInfo) (string, uint) {
	OpenDatabase()

	var place = &model.Places{}
	Db.Where("name = ?", socketInfo.Place).First(&place)

	if place.ID == 0 {
		return "", 0
	}

	place.People = place.People + 1
	Db.Save(&place)

	defer Db.Close()
	return place.Name, place.People
}

func SubPersonFromPlace(socketInfo model.SocketInfo) (string, uint) {
	OpenDatabase()

	var place = &model.Places{}
	Db.Where("name = ?", socketInfo.Place).First(&place)

	if place.ID == 0 {
		return "", 0
	}

	if place.People > 0 {
		place.People = place.People - 1
		Db.Save(&place)
	}

	defer Db.Close()
	return place.Name, place.People
}

func ChangeUserToPlace(socketInfo *model.SocketInfo, newPlace string) {
	OpenDatabase()
	var user = &model.Users{}
	Db.Where("username = ?", socketInfo.Username).First(&user)

	if socketInfo.Place != "" {
		var oldPlace = &model.Places{}
		Db.Where("name = ?", newPlace).First(&oldPlace)

		if oldPlace.ID == 0 || user.ID == 0 {
			return
		}

		var newActive []*model.Users
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
			Db.Save(oldPlace)
		}
	}

	var place = &model.Places{}
	Db.Where("name = ?", newPlace).First(&place)

	if place.ID == 0 {
		return
	}

	socketInfo.Place = place.Name
	place.ActiveStaff = append(place.ActiveStaff, user)
	Db.Save(place)

	defer Db.Close()
}
