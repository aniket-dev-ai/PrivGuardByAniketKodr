package handlers

import (
	"github.com/SAURABH-CHOUDHARI/privguard-backend/internal/services"
	"github.com/SAURABH-CHOUDHARI/privguard-backend/pkg/storage"
	"github.com/gofiber/fiber/v2"
)

func UpdateServiceNotesHandler(repo storage.Repository) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID := c.Locals("user_id").(string)
		serviceID := c.Params("id")

		var req struct {
			Notes string `json:"notes"`
		}


		if err := c.BodyParser(&req); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid request body",
			})
		}

		if serviceID == "" || req.Notes == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Service ID and notes are required",
			})
		}

		err := services.UpdateServiceNotes(repo, userID, serviceID, req.Notes)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"message": "Service notes updated successfully",
		})
	}
}

