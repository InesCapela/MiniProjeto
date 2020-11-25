package controllers

import (
	"api/model"
	"api/services"
)

func AddPlace(user *model.Users, place *model.Places) {
	var exists model.Places
	services.Db.Model(&user).Association("Places").Find(&exists)

	if exists.ID != 0 {
		services.Db.Model(&user).Association("Places").Append(&place)
		services.Db.Save(&user)
	}
}

func RemovePlace(user *model.Users, place *model.Places) {
	var exists model.Places
	services.Db.Model(&user).Association("Places").Find(&exists)

	if exists.ID != 0 {
		services.Db.Model(&user).Association("Places").Delete(&place)
		services.Db.Save(&user)
	}
}
