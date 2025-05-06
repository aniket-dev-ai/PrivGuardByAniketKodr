package models

import (
	"time"

	"github.com/google/uuid"
)

type Service struct {
	ID                uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	VaultID           uuid.UUID `gorm:"not null;index"`
	ServiceName       string    `gorm:"not null;index"`
	ServiceDomain     string
	LogoURL           string
	EncryptedPassword string `gorm:"not null"`
	IV                string `gorm:"not null"`
	Notes             string
	StrengthScore 	  int8	 `gorm:"not null;comment:Password strength score (0-100)"`
	CreatedAt time.Time `gorm:"autoCreateTime"`
	UpdatedAt time.Time `gorm:"autoUpdateTime"`

	// Relations
	Vault Vault `gorm:"foreignKey:VaultID"`
}
