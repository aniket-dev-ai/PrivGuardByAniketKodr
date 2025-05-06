package models

import(
	"time"
)


// internal/models/totp_secret.go

type TOTPSecret struct {
    UserID      string    `gorm:"primaryKey"`
    Secret      string    // base32‑encoded
    Enabled     bool      // “enforced” flag, can stay false for now
    IsConfirmed bool      // ← New: true only after a successful Verify
    CreatedAt   time.Time
}
