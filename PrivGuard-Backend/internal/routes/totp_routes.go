package routes

import (
	"github.com/gofiber/fiber/v2"
	"time"

	"github.com/SAURABH-CHOUDHARI/privguard-backend/api/handlers"
	"github.com/SAURABH-CHOUDHARI/privguard-backend/internal/middleware"
	"github.com/SAURABH-CHOUDHARI/privguard-backend/pkg/storage"
)

func TotpRoutes(router fiber.Router, repo storage.Repository) {
	auth := router.Group("/auth", middleware.AuthMiddleware(repo))

	// TOTP setup & verify
	auth.Get("/totp/setup",
		middleware.UserRateLimit(repo, 10, 1*time.Minute, "totp_setup"),
		handlers.GetTOTPSetupHandler(repo))

	auth.Post("/totp/verify",
		middleware.UserRateLimit(repo, 20, 1*time.Minute, "totp_verify"),
		handlers.VerifyTOTPHandler(repo))

	//Check TOTP exist or not	
	auth.Get("/totp/status",
		middleware.UserRateLimit(repo, 20, 1*time.Minute, "totp_check"),
		handlers.GetTOTPStatusHandler(repo))
		
}

