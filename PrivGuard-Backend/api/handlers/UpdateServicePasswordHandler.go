package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/SAURABH-CHOUDHARI/privguard-backend/pkg/storage"
	"github.com/SAURABH-CHOUDHARI/privguard-backend/internal/services"
)

func UpdateServicePasswordHandler(repo storage.Repository) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID := c.Locals("user_id").(string)
		serviceID := c.Params("id")

		var req struct {
			Password string `json:"password"`
			Strength int `json:"strength"`
		}

		if err := c.BodyParser(&req); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid request body",
			})
		}

		if serviceID == "" || req.Password == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Service ID and new password are required",
			})
		}

		err := services.UpdateServicePassword(repo, userID, serviceID, req.Password, int8(req.Strength))
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"message": "Service password updated successfully",
		})
	}
}
