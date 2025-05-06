package routes

import (
    "github.com/gofiber/fiber/v2"
    "github.com/go-webauthn/webauthn/webauthn"
    
    "github.com/SAURABH-CHOUDHARI/privguard-backend/pkg/storage"
)

// SetupRoutes configures all application routes
func SetupRoutes(app *fiber.App, repo storage.Repository, wa *webauthn.WebAuthn) {
    // Base API group
	api := app.Group("/api")
    
    
    PasskeyRoutes(api, repo, wa)
    
    VaultRoutes(api, repo)

    TotpRoutes(api, repo)

    AssesmentRoutes(api, repo)

}