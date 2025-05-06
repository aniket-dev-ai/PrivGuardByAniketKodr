package handlers

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/SAURABH-CHOUDHARI/privguard-backend/pkg/storage"
	"github.com/SAURABH-CHOUDHARI/privguard-backend/internal/services"
)

func DeletePasswordHandler(repo storage.Repository) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID := c.Locals("user_id")
		if userID == nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Missing user ID in context",
			})
		}

		passwordID := c.Params("id")
		if passwordID == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Password ID is required",
			})
		}

		err := services.DeleteServiceFromVault(repo, userID.(string), passwordID)
		if err != nil {
			log.Println("❌ Failed to delete password:", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to delete password",
			})
		}

		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"message": "Password deleted successfully",
		})
	}
}