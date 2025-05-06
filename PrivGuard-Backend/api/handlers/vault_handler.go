package handlers

import (
	"github.com/SAURABH-CHOUDHARI/privguard-backend/internal/services"
	"github.com/SAURABH-CHOUDHARI/privguard-backend/pkg/storage"
	"github.com/SAURABH-CHOUDHARI/privguard-backend/internal/models"
	"github.com/gofiber/fiber/v2"
	
)

func VaultHandler(repo storage.Repository) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userIDStr, ok := c.Locals("user_id").(string)
		if !ok || userIDStr == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Unauthorized: User ID not found",
			})
		}

		// Step 1: Get or create vault using service
		vaultID, err := services.GetOrCreateVault(repo, userIDStr)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to retrieve or create vault",
			})
		}

		// Step 2: Load full vault with services
		var vault models.Vault
		err = repo.DB.Preload("Services").Where("id = ?", vaultID).First(&vault).Error
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to load vault services",
			})
		}

		// Step 3: Return service metadata
		services := make([]fiber.Map, 0, len(vault.Services))
		for _, s := range vault.Services {
			services = append(services, fiber.Map{
				"id":        s.ID,
				"service":   s.ServiceName,
				"domain":    s.ServiceDomain,
				"logo":      s.LogoURL,
				"notes":     s.Notes,
				"encrypted": true,
			})
		}

		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"message": "Vault ready",
			"vault":   services,
		})
	}
}
