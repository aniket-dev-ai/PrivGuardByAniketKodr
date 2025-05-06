package storage

import (
	"fmt"
	"os"
	"strconv"
	"time"

	"github.com/redis/go-redis/v9"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// Repository wraps the DB instance
type Repository struct {
	DB          *gorm.DB
	RedisClient *redis.Client
}

func (r Repository) FindCredentialByID(passkeyID string) (any, error) {
	panic("unimplemented")
}

// getEnvInt safely retrieves an integer from the environment, with a fallback default value
func getEnvInt(key string, defaultValue int) int {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	parsedValue, err := strconv.Atoi(value)
	if err != nil {
		return defaultValue
	}
	return parsedValue
}

// NewConnection initializes and returns a GORM DB connection
func NewConnection() (*gorm.DB, error) {
	// Fetch the database connection string from environment
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		return nil, fmt.Errorf("DATABASE_URL is not set in environment")
	}

	// Open a connection to PostgreSQL
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to PostgreSQL: %w", err)
	}

	// Initialize the raw SQL connection for pool management
	sqlDB, err := db.DB()
	if err != nil {
		return nil, fmt.Errorf("failed to initialize connection pool: %w", err)
	}

	// Fetch dynamic configuration for connection pool
	maxIdleConns := getEnvInt("DB_MAX_IDLE_CONNS", 50)       // Default 50
	maxOpenConns := getEnvInt("DB_MAX_OPEN_CONNS", 500)      // Default 500
	connMaxLifetime := getEnvInt("DB_CONN_MAX_LIFETIME", 10) // Default 10 minutes

	// Set the connection pool settings
	sqlDB.SetMaxIdleConns(maxIdleConns)
	sqlDB.SetMaxOpenConns(maxOpenConns)
	sqlDB.SetConnMaxLifetime(time.Duration(connMaxLifetime) * time.Minute)

	// Testing connection
	if err := sqlDB.Ping(); err != nil {
		return nil, fmt.Errorf("unable to ping database: %w", err)
	}

	return db, nil
}
