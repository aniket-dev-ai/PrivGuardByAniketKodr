package middleware

import (
	"fmt"

	"github.com/SAURABH-CHOUDHARI/privguard-backend/internal/services"
	"github.com/SAURABH-CHOUDHARI/privguard-backend/pkg/clerk"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
	"github.com/SAURABH-CHOUDHARI/privguard-backend/pkg/storage"
)

// AuthMiddleware checks Clerk token and syncs user to DB (create if first time)
func AuthMiddleware(repo storage.Repository) fiber.Handler {
	return func(c *fiber.Ctx) error {
		tokenString := c.Get("Authorization")
		if tokenString == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Missing Authorization Header",
			})
		}

		token, err := clerk.VerifyToken(tokenString)
		if err != nil {
			fmt.Println(" Token verification failed:", err)
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Invalid Token",
			})
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Invalid token claims",
			})
		}


		clerkID, ok := claims["sub"].(string)
		if !ok || clerkID == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Missing user ID (sub)",
			})
		}

		email, _ := claims["email"].(string)
		firstName, _ := claims["firstName"].(string)
		lastName, _ := claims["lastName"].(string)

		

		user, err := services.GetOrCreateUser(repo, clerkID, email, firstName, lastName)

		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "User check failed"})
		}

		c.Locals("user_id", user.ID.String())
		c.Locals("clerk_id", user.ClerkID)
		c.Locals("user_email", user.Email)
		c.Locals("firstName", user.FirstName)
		c.Locals("lastName", user.LastName)

		return c.Next()
	}
}
