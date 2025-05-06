package handlers

import (
	"errors"
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/SAURABH-CHOUDHARI/privguard-backend/pkg/storage"
	"github.com/SAURABH-CHOUDHARI/privguard-backend/internal/services"
	"github.com/SAURABH-CHOUDHARI/privguard-backend/internal/models"
	"gorm.io/gorm"
)

// GetTOTPSetupHandler checks for the user's TOTP setup and generates a new QR code if necessary
func GetTOTPSetupHandler(repo storage.Repository) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID := c.Locals("user_id").(string)

		// Fetch TOTPSecret from the DB
		var ts models.TOTPSecret
		err := repo.DB.Where("user_id = ?", userID).First(&ts).Error
		if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
			return c.Status(500).JSON(fiber.Map{"error": "DB error"})
		}

		// If not found, generate a new secret and save it
		if errors.Is(err, gorm.ErrRecordNotFound) {
			secret, uri, err := services.GenerateTOTP(userID)
			if err != nil {
				return c.Status(500).JSON(fiber.Map{"error": "TOTP generation failed"})
			}

			// Create new TOTPSecret record
			ts = models.TOTPSecret{
				UserID:      userID,
				Secret:      secret,
				IsConfirmed: false,
				Enabled:     false,
				CreatedAt:   time.Now(),
			}

			if err := repo.DB.Create(&ts).Error; err != nil {
				return c.Status(500).JSON(fiber.Map{"error": "DB save failed"})
			}

			// Return the provisioning URI (QR code)
			return c.JSON(fiber.Map{"provisioning_uri": uri})
		}

		// If exists but not yet confirmed, re-issue the same QR code
		if !ts.IsConfirmed {
			uri := fmt.Sprintf("otpauth://totp/PrivGuard:%s?secret=%s&issuer=PrivGuard", userID, ts.Secret)
			return c.JSON(fiber.Map{"provisioning_uri": uri})
		}

		// Already confirmed — notify client they don’t need QR code
		return c.JSON(fiber.Map{"message": "TOTP already configured"})
	}
}

// VerifyTOTPHandler verifies the provided TOTP code and enables it if valid
func VerifyTOTPHandler(repo storage.Repository) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID := c.Locals("user_id").(string)
		var body struct{ Code string `json:"code"` }

		// Parse the TOTP code from the request body
		if err := c.BodyParser(&body); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "bad request"})
		}

		// Fetch the TOTP secret for the user
		var ts models.TOTPSecret
		if err := repo.DB.First(&ts, "user_id = ?", userID).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return c.Status(404).JSON(fiber.Map{"error": "TOTP not set up"})
			}
			return c.Status(500).JSON(fiber.Map{"error": "DB error"})
		}

		// Verify the provided code
		if !services.VerifyTOTP(ts.Secret, body.Code) {
			return c.Status(400).JSON(fiber.Map{"error": "invalid code"})
		}

		// Mark the TOTP as confirmed and enabled
		ts.IsConfirmed = true
		ts.Enabled = true
		if err := repo.DB.Save(&ts).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "failed to update TOTP status"})
		}

		return c.JSON(fiber.Map{"message": "TOTP verified and enabled"})
	}
}

// GetTOTPStatusHandler retrieves the current TOTP setup status for the user
func GetTOTPStatusHandler(repo storage.Repository) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID := c.Locals("user_id").(string)

		// Fetch the TOTP secret for the user
		var ts models.TOTPSecret
		if err := repo.DB.First(&ts, "user_id = ?", userID).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				// If no TOTP secret found, return false for both isConfirmed and enabled
				return c.JSON(fiber.Map{"isConfirmed": false, "enabled": false})
			}
			return c.Status(500).JSON(fiber.Map{"error": "DB error"})
		}

		// Return TOTP status (confirmed and enabled)
		return c.JSON(fiber.Map{
			"isConfirmed": ts.IsConfirmed,
			"enabled":     ts.Enabled,
		})
	}
}
