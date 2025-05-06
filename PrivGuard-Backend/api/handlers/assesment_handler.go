package handlers

import (
	"net/http"

	"github.com/SAURABH-CHOUDHARI/privguard-backend/internal/models"
	"github.com/SAURABH-CHOUDHARI/privguard-backend/pkg/storage"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

// getAssessment retrieves user's vault services and passkey count,
// returning service details and average strength score along with passkey count.
func GetAssessmentHandler(repo storage.Repository) fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Authenticate
		userIDStr, ok := c.Locals("user_id").(string)
		if !ok || userIDStr == "" {
			return c.Status(http.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
		}

		userID, err := uuid.Parse(userIDStr)
		if err != nil {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Invalid user ID"})
		}

		// Fetch vault
		var vault models.Vault
		if err := repo.DB.Where("user_id = ?", userID).First(&vault).Error; err != nil {
			return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "Vault not found"})
		}

		// Fetch services
		var services []models.Service
		if err := repo.DB.Where("vault_id = ?", vault.ID).Find(&services).Error; err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch services"})
		}

		// Build response entries and compute average strength
		type serviceEntry struct {
			ServiceName   string `json:"service_name"`
			LogoURL       string `json:"logo_url"`
			StrengthScore int8   `json:"strength_score"`
		}

		var result []serviceEntry
		var totalScore int
		for _, svc := range services {
			result = append(result, serviceEntry{
				ServiceName:   svc.ServiceName,
				LogoURL:       svc.LogoURL,
				StrengthScore: svc.StrengthScore,
			})
			totalScore += int(svc.StrengthScore)
		}

		avgStrength := 0.0
		if len(services) > 0 {
			avgStrength = float64(totalScore) / float64(len(services))
		}

		// Fetch passkey count
		creds, err := repo.FindCredentialsByUserID(userIDStr)
		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch passkeys"})
		}
		passkeyCount := len(creds)

		// Return combined assessment
		return c.JSON(fiber.Map{
			"services":       result,
			"average_score":  avgStrength,
			"service_count":  len(result),
			"passkey_count":  passkeyCount,
		})
	}
}
