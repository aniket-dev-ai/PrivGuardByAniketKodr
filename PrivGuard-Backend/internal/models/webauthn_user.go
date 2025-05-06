package models

import (
	"encoding/base64"

	"github.com/go-webauthn/webauthn/webauthn"
	"github.com/go-webauthn/webauthn/protocol"
)

type WebAuthnUser struct {
	User *User
	Repo interface {
		FindCredentialsByUserID(userID string) ([]WebAuthnCredential, error)
	}
}

func (u *WebAuthnUser) WebAuthnID() []byte {
	return []byte(u.User.ID.String())
}

func (u *WebAuthnUser) WebAuthnName() string {
	return u.User.Email
}

func (u *WebAuthnUser) WebAuthnDisplayName() string {
	return u.User.Email
}

func (u *WebAuthnUser) WebAuthnIcon() string {
	return ""
}

func (u *WebAuthnUser) WebAuthnCredentials() []webauthn.Credential {
	creds, _ := u.Repo.FindCredentialsByUserID(u.User.ID.String())
	out := make([]webauthn.Credential, 0, len(creds))

	for _, c := range creds {
		decodedID, err := base64.RawURLEncoding.DecodeString(c.CredentialID)
		if err != nil {
			continue
		}

		out = append(out, webauthn.Credential{
			ID:              decodedID,
			PublicKey:       c.PublicKey,
			AttestationType: c.AttestationType,
			Authenticator: webauthn.Authenticator{
				AAGUID:       []byte(c.AAGUID),
				SignCount:    c.SignCount,
				CloneWarning: c.CloneWarning,
			},
			Flags: webauthn.CredentialFlags{
               
                BackupEligible: c.BackupEligible,
             
            },

		})
	}

	return out
}

// WebAuthnUser must have this method so we can pass allowed credentials during login
func (w *WebAuthnUser) CredentialDescriptors() []protocol.CredentialDescriptor {
	creds, err := w.Repo.FindCredentialsByUserID(w.User.ID.String())
	if err != nil {
		return nil
	}

	if len(creds) == 0 {
		return nil
	}

	descriptors := make([]protocol.CredentialDescriptor, len(creds))
	for i, cred := range creds {
		credID, err := base64.RawURLEncoding.DecodeString(cred.CredentialID)
		if err != nil {
			continue
		}
		descriptors[i] = protocol.CredentialDescriptor{
			Type:         protocol.PublicKeyCredentialType,
			CredentialID: credID,
		}
	}
	return descriptors
}
