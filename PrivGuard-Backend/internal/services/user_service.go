package services

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/SAURABH-CHOUDHARI/privguard-backend/internal/models"
	"github.com/SAURABH-CHOUDHARI/privguard-backend/pkg/storage"

	"gorm.io/gorm"
)

const userCacheTTL = 7 * 24 * time.Hour // 7 days

func GetOrCreateUser(repo storage.Repository, clerkID, email, firstName, lastName string) (*models.User, error) {
	ctx := context.Background()
	cacheKey := fmt.Sprintf("user:%s", clerkID)

	// 1. 🔍 Try Redis
	cachedUser, err := repo.RedisClient.Get(ctx, cacheKey).Result()
	if err == nil {
		var user models.User
		if err := json.Unmarshal([]byte(cachedUser), &user); err == nil {
			return &user, nil
		}
	}

	var user models.User

	// 2. 🐘 Try DB
	err = repo.DB.Where("clerk_id = ?", clerkID).First(&user).Error
	if err == nil {
		cacheUser(repo, ctx, cacheKey, &user)
		return &user, nil
	}
	if err != gorm.ErrRecordNotFound {
		return nil, err // ❌ unexpected error
	}

	// 3. 🆕 Create new user
	newUser := models.User{
		ClerkID:   clerkID,
		Email:     email,
		FirstName: firstName,
		LastName:  lastName,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	if err := repo.DB.Create(&newUser).Error; err != nil {
		return nil, err
	}

	// Optional: reload user
	if err := repo.DB.First(&user, "clerk_id = ?", clerkID).Error; err != nil {
		return nil, err
	}

	// 4. 📌 Cache new user
	cacheUser(repo, ctx, cacheKey, &user)

	return &user, nil
}

func cacheUser(repo storage.Repository, ctx context.Context, key string, user *models.User) {
	jsonData, err := json.Marshal(user)
	if err != nil {
		fmt.Printf("❌ Failed to marshal user for Redis: %v\n", err)
		return
	}
	if err := repo.RedisClient.Set(ctx, key, jsonData, userCacheTTL).Err(); err != nil {
		fmt.Printf("❌ Failed to cache user in Redis: %v\n", err)
	}
}
