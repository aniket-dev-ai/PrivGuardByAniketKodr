package routes

import (
	"github.com/go-webauthn/webauthn/webauthn"
	"github.com/gofiber/fiber/v2"
	"time"

	"github.com/SAURABH-CHOUDHARI/privguard-backend/api/handlers"
	"github.com/SAURABH-CHOUDHARI/privguard-backend/internal/middleware"
	"github.com/SAURABH-CHOUDHARI/privguard-backend/pkg/storage"
)

func PasskeyRoutes(router fiber.Router, repo storage.Repository, wa *webauthn.WebAuthn) {

	auth := router.Group("/auth", middleware.AuthMiddleware(repo))

	//Get Passkeys
	auth.Get("/passkeys", 
	middleware.UserRateLimit(repo, 60, 1*time.Minute, "passkey_list"),
	handlers.GetPasskeysHandler(repo))

	//Delete Passkey
	auth.Delete("/passkeys/:id", 
	middleware.UserRateLimit(repo, 20, 1*time.Minute, "passkey_delete"), 
	handlers.DeletePasskeyHandler(repo))

	//Passkey Register & Login
	auth.Post("/register/start",
		middleware.UserRateLimit(repo, 20, 1*time.Minute, "register_start"),
		handlers.StartRegistrationHandler(repo, wa))

	auth.Post("/register/finish",
		middleware.UserRateLimit(repo, 20, 1*time.Minute, "register_finish"),
		handlers.FinishRegistrationHandler(repo, wa))

	auth.Post("/login/start",
		middleware.UserRateLimit(repo, 100, 1*time.Minute, "login_start"),
		handlers.StartLoginHandler(repo, wa))

	auth.Post("/login/finish",
		middleware.UserRateLimit(repo, 100, 1*time.Minute, "login_finish"),
		handlers.FinishLoginHandler(repo, wa))

}
