package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/SAURABH-CHOUDHARI/privguard-backend/pkg/storage"
	"github.com/SAURABH-CHOUDHARI/privguard-backend/internal/models"
	"github.com/SAURABH-CHOUDHARI/privguard-backend/pkg/crypto"
)

// GetPasswordDetailHandler returns decrypted password for a single service entry
func GetPasswordDetailHandler(repo storage.Repository) fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Step 1: Extract entry ID from URL
		entryIDStr := c.Params("id")
		entryID, err := uuid.Parse(entryIDStr)
		if err != nil {
			return fiber.NewError(fiber.StatusBadRequest, "Invalid entry ID")
		}

		// Step 2: Fetch service entry from DB
		var service models.Service
		err = repo.DB.First(&service, "id = ?", entryID).Error
		if err != nil {
			return fiber.NewError(fiber.StatusNotFound, "Password entry not found")
		}

		// Step 3: Load AES key and decrypt
		key, err := crypto.LoadAESKey()
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, "Encryption key error")
		}

		decrypted, err := crypto.DecryptAES(service.EncryptedPassword, service.IV, key)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, "Decryption failed")
		}

		// Step 4: Return decrypted data
		return c.JSON(fiber.Map{
			"id":       service.ID,
			"service":  service.ServiceName,
			"domain":   service.ServiceDomain,
			"logo":     service.LogoURL,
			"notes":    service.Notes,
			"password": decrypted,
		})
	}
}
