package models

import (
	"github.com/google/uuid"
	"time"
)

// pkg/models/webauthn_credential.go
type WebAuthnCredential struct {
	ID              uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	UserID          string    `gorm:"index;not null"`
	CredentialID    string    `gorm:"unique;not null"`
	PublicKey       []byte    `gorm:"not null"`
	AttestationType string
	AAGUID          string
	SignCount       uint32
	CloneWarning    bool
	BackupEligible  bool   `gorm:"default:false"`
	Name            string // ← friendly name supplied by client
	CreatedAt       time.Time
	UpdatedAt       time.Time
}
