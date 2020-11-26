package model

import (
	"time"
)

type Places struct {
	ID        uint       `gorm:"primary_key"`
	CreatedAt time.Time  `json:"-"`
	UpdatedAt time.Time  `json:"-"`
	DeletedAt *time.Time `json:"-" sql:"index"`

	Name      string  `json:"name" binding:"required"`
	Latitude  float64 `json:"latitude" binding:"required"`
	Longitude float64 `json:"longitude" binding:"required"`

	Users []*Users `gorm:"many2many:users_places;" json:"-"`

	ActiveStaff []*Users `json:"activeStaff" gorm:"type:text"`
	People      uint     `json:"people" gorm:"default:0"`
}
