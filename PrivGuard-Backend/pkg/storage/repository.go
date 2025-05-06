package storage

import (
	"context"
	"errors"
	"time"
	
	"github.com/redis/go-redis/v9"

	"github.com/SAURABH-CHOUDHARI/privguard-backend/internal/models"
)

func (r *Repository) FindUserByClerkID(clerkID string) (*models.User, error) {
	var user models.User
	if err := r.DB.Where("clerk_id = ?", clerkID).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *Repository) FindUserByEmail(email string) (*models.User, error) {
	var user models.User
	if err := r.DB.Where("email = ?", email).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *Repository) StoreCredential(cred *models.WebAuthnCredential) error {
	return r.DB.Create(cred).Error
}

// Cache wrappers for session storage
func (r *Repository) SetCache(key string, value string) error {
	ttl := 5 * time.Minute
	return r.RedisClient.Set(context.Background(), key, value, ttl).Err()
}

func (r *Repository) GetCache(key string) (string, error) {
	val, err := r.RedisClient.Get(context.Background(), key).Result()
	if err == redis.Nil {
		return "", errors.New("key not found")
	}
	return val, err
}
func (r *Repository) FindCredentialsByUserID(userID string) ([]models.WebAuthnCredential, error) {
	var creds []models.WebAuthnCredential
	err := r.DB.Where("user_id = ?", userID).Find(&creds).Error
	return creds, err
}

func (r *Repository) UpdateCredential(cred *models.WebAuthnCredential) error {
	return r.DB.Model(&models.WebAuthnCredential{}).
		Where("credential_id = ?", cred.CredentialID).
		Updates(cred).Error
}

func (r *Repository) DeleteCache(key string) error {
    return r.RedisClient.Del(context.Background(), key).Err()
}

func (r *Repository) DeletePasswordFromVault(vaultID string, serviceID string) error {
	return r.DB.
		Where("vault_id = ? AND id = ?", vaultID, serviceID).
		Delete(&models.Service{}).Error
}

func (r *Repository) FindCredentialByUserID(id string) (*models.WebAuthnCredential, error) {
	var cred models.WebAuthnCredential
	if err := r.DB.Where("id = ?", id).First(&cred).Error; err != nil {
		return nil, err
	}
	return &cred, nil
}


func (r *Repository) DeleteCredential(id string) error {
	return r.DB.Where("id = ?", id).Delete(&models.WebAuthnCredential{}).Error
}
