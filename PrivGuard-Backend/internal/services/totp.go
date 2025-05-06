package services

import (
    "github.com/pquerna/otp/totp"
)

// Generate a new TOTP secret + provisioning URI
func GenerateTOTP(userID string) (secret, uri string, err error) {
    key, err := totp.Generate(totp.GenerateOpts{
        Issuer:      "PrivGuard",
        AccountName: userID,
    })
    if err != nil {
        return "", "", err
    }
    return key.Secret(), key.URL(), nil
}

// Verify a user‑supplied code
func VerifyTOTP(secret, code string) bool {
    return totp.Validate(code, secret)
}