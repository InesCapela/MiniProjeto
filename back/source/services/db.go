package services

import (
	"api/model"

	"github.com/jinzhu/gorm"
)

const username = "test"
const password = "passw0rd"
const dbHost = "database"
const dbPort = "5432"
const dbName = "apidb"

var Db *gorm.DB

func OpenDatabase() {
	//open a db connection
	//readProperties()
	var err error
	Db, err = gorm.Open("postgres", "postgres://"+username+":"+password+"@"+dbHost+":"+dbPort+"/"+dbName+"?sslmode=disable")
	if err != nil {
		panic("failed to connect database")
	}
}

func LoadMockupData() {
	place1 := model.Places{Name: "Norte Shopping", Latitude: 41.1811917, Longitude: -8.6543736}
	place2 := model.Places{Name: "GuimarãeShopping", Latitude: 41.44222640045345, Longitude: -8.30434453803262}
	place3 := model.Places{Name: "Alameda Shop & Spot", Latitude: 41.16501512697165, Longitude: -8.584361491214967}
	place4 := model.Places{Name: "World Trade Center Porto", Latitude: 41.16100888723494, Longitude: -8.638949806913477}

	places := []*model.Places{&place1, &place2}
	user1 := model.Users{Username: "admin", Password: "password", IsAdmin: true}
	user2 := model.Users{Username: "rui", Password: "password", IsAdmin: false, Places: places}
	user3 := model.Users{Username: "paulo", Password: "password", IsAdmin: false, Places: places}
	user4 := model.Users{Username: "ines", Password: "password", IsAdmin: false}

	// user2.Places = append(user2.Places, &place2)

	Db.Save(&place1)
	Db.Save(&place2)
	Db.Save(&place3)
	Db.Save(&place4)
	Db.Save(&user1)
	Db.Save(&user2)
	Db.Save(&user3)
	Db.Save(&user4)
}
