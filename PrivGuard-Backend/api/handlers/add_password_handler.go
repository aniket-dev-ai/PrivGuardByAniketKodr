package handlers

import (
	"github.com/SAURABH-CHOUDHARI/privguard-backend/internal/services"
	"github.com/SAURABH-CHOUDHARI/privguard-backend/pkg/storage"
	"github.com/gofiber/fiber/v2"
)

type AddPasswordRequest struct {
	ServiceName string `json:"service"`
	Domain      string `json:"domain"`
	Logo        string `json:"logo"`
	Password    string `json:"password"`
	Notes       string `json:"notes"`
	StrengthScore int  `json:"strength"`
}

func AddPasswordHandler(repo storage.Repository) fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Get userID from context (assuming you set it in middleware)
		userIDInterface := c.Locals("user_id")
		userID, ok := userIDInterface.(string)
		if !ok {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "User ID not available in context",
			})
		}
		

		var req AddPasswordRequest
		if err := c.BodyParser(&req); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
		}

		err := services.AddPasswordToVault(repo, userID, req.ServiceName, req.Domain, req.Logo, req.Password, req.Notes, int8(req.StrengthScore))

		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to save password"})
		}

		return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "Password saved successfully"})
	}
}
