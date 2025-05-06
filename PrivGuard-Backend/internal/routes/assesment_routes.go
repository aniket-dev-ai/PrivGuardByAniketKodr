package routes

import (
	"time"

	"github.com/SAURABH-CHOUDHARI/privguard-backend/api/handlers"
	"github.com/SAURABH-CHOUDHARI/privguard-backend/internal/middleware"
	"github.com/SAURABH-CHOUDHARI/privguard-backend/pkg/storage"
	"github.com/gofiber/fiber/v2"
)

func AssesmentRoutes(router fiber.Router, repo storage.Repository){
	auth:= router.Group("/auth", middleware.AuthMiddleware(repo))

	auth.Get("/assesment",
	middleware.UserRateLimit(repo, 20, 1*time.Minute, "passkey_list"),
	handlers.GetAssessmentHandler(repo))

}