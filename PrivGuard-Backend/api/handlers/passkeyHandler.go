package handlers

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"net/http"

	"github.com/go-webauthn/webauthn/protocol"
	"github.com/go-webauthn/webauthn/webauthn"
	"github.com/gofiber/fiber/v2"

	"github.com/SAURABH-CHOUDHARI/privguard-backend/internal/models"
	"github.com/SAURABH-CHOUDHARI/privguard-backend/pkg/storage"
)

// Convert Fiber context to *http.Request for go-webauthn
func convertRequest(c *fiber.Ctx) (*http.Request, error) {
	req, err := http.NewRequest(string(c.Method()), c.OriginalURL(), bytes.NewReader(c.Body()))
	if err != nil {
		return nil, err
	}
	c.Request().Header.VisitAll(func(key, value []byte) {
		req.Header.Set(string(key), string(value))
	})
	return req, nil
}

// --- Register Start ---
func StartRegistrationHandler(repo storage.Repository, wa *webauthn.WebAuthn) fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Get the userID from the request context
		userID, ok := c.Locals("clerk_id").(string)
		if !ok || userID == "" {
			return c.Status(http.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
		}

		// Find the user by their Clerk ID
		user, err := repo.FindUserByClerkID(userID)
		if err != nil {
			return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
		}

		// Check the number of credentials already registered for this user
		registeredCredentials, err := repo.FindCredentialsByUserID(user.ID.String())
		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to retrieve user credentials"})
		}

		// Limit the number of registered devices to 2
		if len(registeredCredentials) >= 2 {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Maximum device registration limit reached"})
		}

		// Begin the registration process
		opts, sessionData, err := wa.BeginRegistration(
			&models.WebAuthnUser{User: user, Repo: &repo},
			webauthn.WithAuthenticatorSelection(protocol.AuthenticatorSelection{
				AuthenticatorAttachment: protocol.Platform,
				ResidentKey:             protocol.ResidentKeyRequirementRequired,
				UserVerification:        protocol.VerificationRequired,
			}),
			webauthn.WithConveyancePreference(protocol.PreferDirectAttestation),
		)
		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Begin registration failed", "details": err.Error()})
		}

		// Store session data in cache for later use
		data, _ := json.Marshal(sessionData)
		_ = repo.SetCache("webauthn:register:"+user.ID.String(), string(data))

		// Return the public key options to the client for registration
		return c.JSON(fiber.Map{"publicKey": opts})
	}
}

// --- Register Finish ---
func FinishRegistrationHandler(repo storage.Repository, wa *webauthn.WebAuthn) fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Get the userID from the request context
		userID, ok := c.Locals("clerk_id").(string)
		if !ok || userID == "" {
			return c.Status(http.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
		}

		// Find the user by their Clerk ID
		user, err := repo.FindUserByClerkID(userID)
		if err != nil {
			return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
		}

		// Retrieve session data from cache
		data, err := repo.GetCache("webauthn:register:" + user.ID.String())
		if err != nil {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "No session found"})
		}

		var sessionData webauthn.SessionData
		if err := json.Unmarshal([]byte(data), &sessionData); err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to unmarshal session data"})
		}

		// Convert the Fiber context to an http.Request
		req, err := convertRequest(c)
		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to convert request"})
		}

		// Finish registration and get the credential
		cred, err := wa.FinishRegistration(&models.WebAuthnUser{User: user, Repo: &repo}, sessionData, req)
		if err != nil {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Finish registration failed", "details": err.Error()})
		}

		// Check if the device is already registered
		registeredCredentials, err := repo.FindCredentialsByUserID(user.ID.String())
		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to retrieve user credentials"})
		}

		for _, credInDb := range registeredCredentials {
			if credInDb.CredentialID == base64.RawURLEncoding.EncodeToString(cred.ID) {
				return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Device already registered"})
			}
		}


		//  Extract name from body
		var body struct {
			Name string `json:"name"`
		}
		if err := c.BodyParser(&body); err != nil || body.Name == "" {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Missing passkey name"})
		}

		// Store the new credential
		newCred := models.WebAuthnCredential{
			UserID:          user.ID.String(),
			Name:            body.Name, 
			CredentialID:    base64.RawURLEncoding.EncodeToString(cred.ID),
			PublicKey:       cred.PublicKey,
			AttestationType: cred.AttestationType,
			AAGUID:          base64.StdEncoding.EncodeToString(cred.Authenticator.AAGUID),
			SignCount:       cred.Authenticator.SignCount,
			CloneWarning:    cred.Authenticator.CloneWarning,
			BackupEligible:  cred.Flags.BackupEligible,	
		}
		_ = repo.StoreCredential(&newCred)

		// Remove session data from cache
		_ = repo.DeleteCache("webauthn:register:" + user.ID.String())

		return c.JSON(fiber.Map{"status": "registered"})
	}
}

// --- Login Start ---
func StartLoginHandler(repo storage.Repository, wa *webauthn.WebAuthn) fiber.Handler {
	return func(c *fiber.Ctx) error {
		email, ok := c.Locals("user_email").(string)
		if !ok || email == "" {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Missing authenticated email"})
		}

		user, err := repo.FindUserByEmail(email)
		if err != nil {
			return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
		}

		userObj := &models.WebAuthnUser{User: user, Repo: &repo}

		opts, sessionData, err := wa.BeginLogin(userObj, webauthn.WithAllowedCredentials(userObj.CredentialDescriptors()))
		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Begin login failed", "details": err.Error()})
		}

		data, _ := json.Marshal(sessionData)
		_ = repo.SetCache("webauthn:login:"+user.ID.String(), string(data))

		return c.JSON(opts)
	}
}

// --- Login Finish ---
func FinishLoginHandler(repo storage.Repository, wa *webauthn.WebAuthn) fiber.Handler {
	return func(c *fiber.Ctx) error {
		email, ok := c.Locals("user_email").(string)
		if !ok || email == "" {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Missing authenticated email"})
		}

		user, err := repo.FindUserByEmail(email)
		if err != nil {
			return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
		}

		data, err := repo.GetCache("webauthn:login:" + user.ID.String())
		if err != nil {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "No session found"})
		}

		var sessionData webauthn.SessionData
		if err := json.Unmarshal([]byte(data), &sessionData); err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to unmarshal session data"})
		}

		req, err := convertRequest(c)
		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to convert request"})
		}

		webUser := &models.WebAuthnUser{User: user, Repo: &repo}

		cred, err := wa.FinishLogin(webUser, sessionData, req)
		if err != nil {
			return c.Status(http.StatusUnauthorized).JSON(fiber.Map{"error": "Login failed", "details": err.Error()})
		}

		updateCred := &models.WebAuthnCredential{
			CredentialID: base64.StdEncoding.EncodeToString(cred.ID),
			PublicKey:    cred.PublicKey,
			AAGUID:       string(cred.Authenticator.AAGUID),
			SignCount:    cred.Authenticator.SignCount,
			CloneWarning: cred.Authenticator.CloneWarning,
		}
		if err := repo.UpdateCredential(updateCred); err != nil {
		}

		if err := repo.DeleteCache("webauthn:login:" + user.ID.String()); err != nil {
		}

		return c.JSON(fiber.Map{
			"status": "authenticated",
			"userId": user.ID.String(),
		})
	}
}

// --- Get Passkeys ---
func GetPasskeysHandler(repo storage.Repository) fiber.Handler {
    return func(c *fiber.Ctx) error {
        userID, _ := c.Locals("clerk_id").(string)
        user, err := repo.FindUserByClerkID(userID)
        if err != nil {
            return c.Status(http.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
        }

        creds, err := repo.FindCredentialsByUserID(user.ID.String())
        if err != nil {
            return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Could not fetch credentials"})
        }

        var resp []fiber.Map
        for _, cred := range creds {
            resp = append(resp, fiber.Map{
                "id":         cred.ID,
                "name":       cred.Name,           // friendly name
                "createdAt":  cred.CreatedAt,
            })
        }
        return c.JSON(resp)
    }
}

func DeletePasskeyHandler(repo storage.Repository) fiber.Handler {
    return func(c *fiber.Ctx) error {
        userID, _ := c.Locals("clerk_id").(string)
        user, err := repo.FindUserByClerkID(userID)
        if err != nil {
            return c.Status(http.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
        }

        passkeyID := c.Params("id") // assuming the route is /api/passkeys/:id

        cred, err := repo.FindCredentialByUserID(passkeyID)
        if err != nil {
            return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "Passkey not found"})
        }

        // Make sure the passkey belongs to the requesting user
        if cred.UserID != user.ID.String() {
            return c.Status(http.StatusForbidden).JSON(fiber.Map{"error": "You do not have permission to delete this passkey"})
        }

        if err := repo.DeleteCredential(passkeyID); err != nil {
            return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete passkey"})
        }

        return c.JSON(fiber.Map{"success": true, "message": "Passkey deleted successfully"})
    }
}
