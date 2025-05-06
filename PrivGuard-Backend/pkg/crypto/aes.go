// pkg/crypto/aes.go
package crypto

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/base64"
	"errors"
	"fmt"
	"io"
	"sync"
	"os"

)

// EncryptAES encrypts plaintext using AES-256 with a given key and returns base64 ciphertext and IV
func EncryptAES(plaintext, key []byte) (string, string, error) {
	if len(key) != 32 {
		return "", "", errors.New("key must be 32 bytes for AES-256")
	}

	block, err := aes.NewCipher(key)
	if err != nil {
		return "", "", err
	}

	aead, err := cipher.NewGCM(block)
	if err != nil {
		return "", "", err
	}

	nonce := make([]byte, aead.NonceSize())
	if _, err := io.ReadFull(rand.Reader, nonce); err != nil {
		return "", "", err
	}

	ciphertext := aead.Seal(nil, nonce, plaintext, nil)

	return base64.StdEncoding.EncodeToString(ciphertext), base64.StdEncoding.EncodeToString(nonce), nil
}


// DecryptAES decrypts a base64 ciphertext using AES-256 with the given key and IV
func DecryptAES(ciphertextB64, nonceB64 string, key []byte) (string, error) {
	if len(key) != 32 {
		return "", errors.New("key must be 32 bytes for AES-256")
	}

	ciphertext, err := base64.StdEncoding.DecodeString(ciphertextB64)
	if err != nil {
		return "", err
	}

	nonce, err := base64.StdEncoding.DecodeString(nonceB64)
	if err != nil {
		return "", err
	}

	block, err := aes.NewCipher(key)
	if err != nil {
		return "", err
	}

	aead, err := cipher.NewGCM(block)
	if err != nil {
		return "", err
	}

	plaintext, err := aead.Open(nil, nonce, ciphertext, nil)
	if err != nil {
		return "", err
	}

	return string(plaintext), nil
}


var (
	cachedKey []byte
	loadOnce  sync.Once
	loadErr   error
)

func LoadAESKey() ([]byte, error) {
	loadOnce.Do(func() {
		// Get key from environment variable
		base64Key := os.Getenv("MASTER_ENCRYPTION_KEY")
		if base64Key == "" {
			loadErr = errors.New("MASTER_ENCRYPTION_KEY environment variable not set")
			return
		}

		key, err := base64.StdEncoding.DecodeString(base64Key)
		if err != nil {
			loadErr = fmt.Errorf("failed to decode MASTER_ENCRYPTION_KEY: %w", err)
			return
		}

		if len(key) != 32 {
			loadErr = errors.New("MASTER_ENCRYPTION_KEY must be exactly 32 bytes after base64 decoding")
			return
		}

		cachedKey = key
	})

	return cachedKey, loadErr
}