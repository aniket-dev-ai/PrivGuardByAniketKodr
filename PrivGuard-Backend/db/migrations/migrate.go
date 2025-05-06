package migrations

import (
	"log"

	"gorm.io/gorm"

	"github.com/SAURABH-CHOUDHARI/privguard-backend/internal/models"
)

func AutoMigrate(db *gorm.DB) {
	err := db.AutoMigrate(
		&models.User{},
		&models.Vault{},
		&models.Service{},
		&models.WebAuthnCredential{}, 
		&models.TOTPSecret{},
	)

	if err != nil {
		log.Fatalf("Migration failed: %v", err)
	}

	log.Println("✅ Database migrated successfully")
}
