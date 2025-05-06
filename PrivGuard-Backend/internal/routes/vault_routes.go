package routes

import (
    "time"

	"github.com/gofiber/fiber/v2"

	"github.com/SAURABH-CHOUDHARI/privguard-backend/internal/middleware"
	"github.com/SAURABH-CHOUDHARI/privguard-backend/api/handlers"
	"github.com/SAURABH-CHOUDHARI/privguard-backend/pkg/storage"
)

func VaultRoutes(router fiber.Router, repo storage.Repository) {
	protected := router.Group("/protected", middleware.AuthMiddleware(repo))

	// Vault routes group
	vault := protected.Group("/vault")

	// Route: GET /vault (list all vault entries)
	vault.Get("/", 
		middleware.UserRateLimit(repo, 300, 10*time.Minute, "vault_list"),
		handlers.VaultHandler(repo),
	)

	// Route: POST /vault/add (add new entry)
	vault.Post("/add", 
		middleware.UserRateLimit(repo, 30, 10*time.Minute, "vault_add"),
		handlers.AddPasswordHandler(repo),
	)

	// Route: GET /vault/:id (fetch one entry)
	vault.Get("/:id", 
		middleware.UserRateLimit(repo, 200, 10*time.Minute, "vault_detail"),
		handlers.GetPasswordDetailHandler(repo),
	)

	// Route: DELETE /vault/:id (delete entry)
	vault.Delete("/:id", 
		middleware.UserRateLimit(repo, 50, 10*time.Minute, "vault_delete"),
		handlers.DeletePasswordHandler(repo),
	)

	// Route: POST /vault/:id/update-note
	vault.Post("/:id/update-note", 
		middleware.UserRateLimit(repo, 100, 10*time.Minute, "vault_update_note"),
		handlers.UpdateServiceNotesHandler(repo),
	)

	// Route: POST /vault/:id/update-password
	vault.Post("/:id/update-password", 
		middleware.UserRateLimit(repo, 50, 10*time.Minute, "vault_update_password"),
		handlers.UpdateServicePasswordHandler(repo),
	)
}

