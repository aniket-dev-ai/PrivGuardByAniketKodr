package models

import (
	"github.com/google/uuid"
	"time"
)

type Vault struct {
	ID        uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	UserID    uuid.UUID `gorm:"not null"`
	IsLocked  bool      `gorm:"default:true"`
	CreatedAt time.Time `gorm:"default:now()"`
	UpdatedAt time.Time

	User     User      `gorm:"foreignKey:UserID"`
	Services []Service `gorm:"foreignKey:VaultID"`
}
