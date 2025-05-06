package main

import (
	"log"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/limiter"
	"github.com/joho/godotenv"

	"github.com/SAURABH-CHOUDHARI/privguard-backend/config"
	"github.com/SAURABH-CHOUDHARI/privguard-backend/db/migrations"
	"github.com/SAURABH-CHOUDHARI/privguard-backend/internal/routes"
	"github.com/SAURABH-CHOUDHARI/privguard-backend/pkg/storage"
	"github.com/SAURABH-CHOUDHARI/privguard-backend/pkg/webauthnutil"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}

	// Initialize Redis
	redisClient := config.InitRedis()

	// Initialize WebAuthn
	webauthn := webauthnutil.New()

	// Connect to Postgres
	db, err := storage.NewConnection()
	if err != nil {
		log.Fatal("❌ Could not connect to DB")
	}

	db.Exec(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`)


	// Conditional migration
	if os.Getenv("RUN_MIGRATIONS") == "true" {
		migrations.AutoMigrate(db)
	}

	// Set up Repository with both DB and Redis
	vaultRoutes := storage.Repository{
		DB:          db,
		RedisClient: redisClient,
	}

	// Set up Fiber app
	app := fiber.New()
	app.Use(logger.New())

	// Global Rate Limiting: 100 requests per minute per IP
	app.Use(limiter.New(limiter.Config{
		Max:        100,
		Expiration: 1 * time.Minute,
	}))

	

	app.Use(cors.New(cors.Config{
		AllowOriginsFunc: func(origin string) bool {
			return origin == "http://localhost:5173" || origin == "https://privguard.netlify.app"
		},
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		AllowCredentials: true,
		AllowMethods:     "GET,POST,OPTIONS,DELETE", // include OPTIONS for preflight
	}))

	// Register all routes
	routes.SetupRoutes(app, vaultRoutes, webauthn)


	// Start the server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Fatal(app.Listen(":" + port))
}
