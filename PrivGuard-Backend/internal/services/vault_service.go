package services

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/SAURABH-CHOUDHARI/privguard-backend/internal/models"
	"github.com/SAURABH-CHOUDHARI/privguard-backend/pkg/crypto"
	"github.com/SAURABH-CHOUDHARI/privguard-backend/pkg/storage"
	"github.com/google/uuid"
)

const vaultTTL = 7 * 24 * time.Hour // 7 days

func AddPasswordToVault(repo storage.Repository, userID string, serviceName, domain, logo, rawPassword, notes string, strengthScore int8) error {
	log.Println("🔧 Starting AddPasswordToVault...")

	ctx := context.Background()
	db := repo.DB
	redis := repo.RedisClient

	// Step 1: Parse userID
	parsedUserID, err := uuid.Parse(userID)
	if err != nil {
		log.Printf(" Invalid UUID: %v\n", err)
		return fmt.Errorf("invalid user ID: %w", err)
	}

	// Step 2: Find user
	var user models.User
	if err := db.Where("id = ?", parsedUserID).First(&user).Error; err != nil {
		log.Printf(" Failed to find user: %v\n", err)
		return fmt.Errorf("failed to find user with ID %s: %w", parsedUserID, err)
	}

	// Step 3: Get or create vault
	var vault models.Vault
	if err := db.FirstOrCreate(&vault, models.Vault{UserID: user.ID}).Error; err != nil {
		log.Printf(" Failed to get/create vault: %v\n", err)
		return fmt.Errorf("failed to find/create vault: %w", err)
	}

	// Step 4: Load encryption key
	key, err := crypto.LoadAESKey()
	if err != nil {
		log.Printf(" Failed to load AES key: %v\n", err)
		return fmt.Errorf("failed to load encryption key: %w", err)
	}

	// Step 5: Encrypt password
	encryptedPass, iv, err := crypto.EncryptAES([]byte(rawPassword), key)
	if err != nil {
		log.Printf(" Encryption failed: %v\n", err)
		return fmt.Errorf("failed to encrypt password: %w", err)
	}

	// Step 6: Create service entry
	service := models.Service{
		ID:                uuid.New(),
		VaultID:           vault.ID,
		ServiceName:       serviceName,
		ServiceDomain:     domain,
		LogoURL:           logo,
		EncryptedPassword: encryptedPass,
		Notes:             notes,
		StrengthScore:     strengthScore,
		IV:                iv,
		CreatedAt:         time.Now(),
		UpdatedAt:         time.Now(),
	}

	// Step 7: Save to DB
	if err := db.Create(&service).Error; err != nil {
		log.Printf(" Failed to save service: %v\n", err)
		return fmt.Errorf("failed to save password: %w", err)
	}

	// Step 8: Invalidate cached vault
	cacheKey := fmt.Sprintf("vault:%s", user.ClerkID)
	if err := redis.Del(ctx, cacheKey).Err(); err != nil {
		log.Printf(" Failed to invalidate Redis cache: %v\n", err)
	}

	log.Println(" Password saved and cache cleared")

	return nil
}

func GetOrCreateVault(repo storage.Repository, userID string) (uuid.UUID, error) {
	ctx := context.Background()
	db := repo.DB
	redis := repo.RedisClient

	parsedUserID, err := uuid.Parse(userID)
	if err != nil {
		return uuid.Nil, fmt.Errorf("invalid user ID: %w", err)
	}

	cacheKey := fmt.Sprintf("vault:%s", userID)
	var cached models.Vault

	// Try Redis
	data, err := redis.Get(ctx, cacheKey).Bytes()
	if err == nil {
		if err := json.Unmarshal(data, &cached); err == nil {
			log.Println(" Vault fetched from Redis")
			return cached.ID, nil
		}
	}

	// Not in Redis, get/create from DB
	var vault models.Vault
	err = db.Where("user_id = ?", parsedUserID).First(&vault).Error

	if err != nil {
		if err.Error() == "record not found" {
			vault = models.Vault{
				ID:     uuid.New(),
				UserID: parsedUserID,
			}
			if err := db.Create(&vault).Error; err != nil {
				return uuid.Nil, err
			}
		} else {
			return uuid.Nil, err
		}
	}

	// Cache in Redis
	serialized, err := json.Marshal(vault)
	if err == nil {
		if err := redis.Set(ctx, cacheKey, serialized, vaultTTL).Err(); err != nil {
			log.Printf(" Failed to cache vault: %v\n", err)
		}
	}

	log.Println(" Vault fetched from DB and cached")
	return vault.ID, nil
}

func DeleteServiceFromVault(repo storage.Repository, userID, serviceID string) error {
	ctx := context.Background()
	db := repo.DB
	redis := repo.RedisClient

	// Parse UUIDs
	parsedUserID, err := uuid.Parse(userID)
	if err != nil {
		return fmt.Errorf("invalid user ID: %w", err)
	}

	parsedServiceID, err := uuid.Parse(serviceID)
	if err != nil {
		return fmt.Errorf("invalid service ID: %w", err)
	}

	// Get or create vault
	var vault models.Vault
	if err := db.Where("user_id = ?", parsedUserID).First(&vault).Error; err != nil {
		return fmt.Errorf("failed to find vault: %w", err)
	}

	// Delete the service
	if err := db.Where("id = ? AND vault_id = ?", parsedServiceID, vault.ID).Delete(&models.Service{}).Error; err != nil {
		return fmt.Errorf("failed to delete service: %w", err)
	}

	// Invalidate Redis cache
	cacheKey := fmt.Sprintf("vault:%s", userID)
	if err := redis.Del(ctx, cacheKey).Err(); err != nil {
		log.Printf("Failed to invalidate Redis cache after deletion: %v", err)
	}

	return nil
}

func UpdateServiceNotes(repo storage.Repository, userID, serviceID, newNotes string) error {
	ctx := context.Background()
	db := repo.DB
	redis := repo.RedisClient

	parsedUserID, err := uuid.Parse(userID)
	if err != nil {
		return fmt.Errorf("invalid user ID: %w", err)
	}

	parsedServiceID, err := uuid.Parse(serviceID)
	if err != nil {
		return fmt.Errorf("invalid service ID: %w", err)
	}

	var vault models.Vault
	if err := db.Where("user_id = ?", parsedUserID).First(&vault).Error; err != nil {
		return fmt.Errorf("failed to find vault: %w", err)
	}

	
	// Update notes
	if err := db.Model(&models.Service{}).
		Where("id = ? AND vault_id = ?", parsedServiceID, vault.ID).
		Update("notes", newNotes).Error; err != nil {
		return fmt.Errorf("failed to update notes: %w", err)
	}

	// Invalidate Redis cache
	cacheKey := fmt.Sprintf("vault:%s", userID)
	if err := redis.Del(ctx, cacheKey).Err(); err != nil {
		log.Printf("Failed to invalidate Redis cache after note update: %v", err)
	}

	return nil
}

func UpdateServicePassword(repo storage.Repository, userID, serviceID, newRawPassword string, strength int8) error {
	ctx := context.Background()
	db := repo.DB
	redis := repo.RedisClient

	parsedUserID, err := uuid.Parse(userID)
	if err != nil {
		return fmt.Errorf("invalid user ID: %w", err)
	}

	parsedServiceID, err := uuid.Parse(serviceID)
	if err != nil {
		return fmt.Errorf("invalid service ID: %w", err)
	}

	var vault models.Vault
	if err := db.Where("user_id = ?", parsedUserID).First(&vault).Error; err != nil {
		return fmt.Errorf("failed to find vault: %w", err)
	}

	// Load encryption key
	key, err := crypto.LoadAESKey()
	if err != nil {
		return fmt.Errorf("failed to load encryption key: %w", err)
	}

	encryptedPass, iv, err := crypto.EncryptAES([]byte(newRawPassword), key)
	if err != nil {
		return fmt.Errorf("encryption failed: %w", err)
	}

	// Update the encrypted password and IV
	if err := db.Model(&models.Service{}).
		Where("id = ? AND vault_id = ?", parsedServiceID, vault.ID).
		Updates(map[string]interface{}{
			"encrypted_password": encryptedPass,
			"iv":                 iv,
			"updated_at":         time.Now(),
			"StrengthScore":       strength, 
		}).Error; err != nil {
		return fmt.Errorf("failed to update encrypted password: %w", err)
	}

	// Invalidate Redis cache
	cacheKey := fmt.Sprintf("vault:%s", userID)
	if err := redis.Del(ctx, cacheKey).Err(); err != nil {
		log.Printf("Failed to invalidate Redis cache after password update: %v", err)
	}

	return nil
}
