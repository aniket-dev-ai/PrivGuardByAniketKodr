package clerk

import (
	"errors"
	"fmt"
	"net/http"
	"crypto/rsa"
	"os"
	"sync"

	"github.com/golang-jwt/jwt/v4"
	"github.com/lestrrat-go/jwx/jwk"
)

var (
	clerkJWKS     jwk.Set
	jwksFetchOnce sync.Once
	jwksFetchErr  error
)

const clerkJWKEnvVar = "CLERK_JWK_URL"

func getClerkJWKS() error {
	jwksFetchOnce.Do(func() {
		url := os.Getenv(clerkJWKEnvVar)
		if url == "" {
			jwksFetchErr = fmt.Errorf("%s environment variable not set", clerkJWKEnvVar)
			return
		}

		resp, err := http.Get(url)
		if err != nil {
			jwksFetchErr = fmt.Errorf("failed to fetch Clerk JWKS: %w", err)
			return
		}
		defer resp.Body.Close()

		clerkJWKS, jwksFetchErr = jwk.ParseReader(resp.Body)
	})
	return jwksFetchErr
}

func VerifyToken(tokenString string) (*jwt.Token, error) {
	if err := getClerkJWKS(); err != nil {
		return nil, err
	}

	return jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodRSA); !ok {
			return nil, errors.New("unexpected signing method")
		}

		kid, ok := token.Header["kid"].(string)
		if !ok {
			return nil, errors.New("missing 'kid' header")
		}

		key, found := clerkJWKS.LookupKeyID(kid)
		if !found {
			return nil, errors.New("matching JWK not found")
		}

		var rsaPublicKey rsa.PublicKey
		if err := key.Raw(&rsaPublicKey); err != nil {
			return nil, fmt.Errorf("failed to parse RSA public key: %w", err)
		}

		return &rsaPublicKey, nil
	})
}