package middleware

import (
	"context"
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/SAURABH-CHOUDHARI/privguard-backend/pkg/storage"
)

func UserRateLimit(repo storage.Repository, limit int, duration time.Duration, route string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		ctx := context.Background()

		userID := c.Locals("user_id")
		if userID == nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Unauthorized - user_id missing",
			})
		}

		key := fmt.Sprintf("ratelimit:%s:%s", userID.(string), route)

		// Use a Lua script to safely handle increment+expiry (avoids race conditions)
		luaScript := `
			local current = redis.call("INCR", KEYS[1])
			if tonumber(current) == 1 then
				redis.call("EXPIRE", KEYS[1], ARGV[1])
			end
			return current
		`

		count, err := repo.RedisClient.Eval(ctx, luaScript, []string{key}, int(duration.Seconds())).Result()
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Rate limiter failed"})
		}

		if countInt, ok := count.(int64); ok && countInt > int64(limit) {
			ttl, _ := repo.RedisClient.TTL(ctx, key).Result()
			return c.Status(fiber.StatusTooManyRequests).JSON(fiber.Map{
				"error":       "Rate limit exceeded",
				"retry_after": int(ttl.Seconds()),
			})
		}

		return c.Next()
	}
}
