package model

import (
	"time"
)

type Users struct {
	ID        uint       `gorm:"primary_key"`
	CreatedAt time.Time  `json:"-"`
	UpdatedAt time.Time  `json:"-"`
	DeletedAt *time.Time `json:"-" sql:"index"`

	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
	IsAdmin  bool   `json:"isAdmin" gorm:"default:false"`

	CurrentPlace string
	Places       []*Places `gorm:"many2many:users_places;" json:"-"`
}
