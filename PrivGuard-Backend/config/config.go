package config

import (
	"context"
	"log"
	"os"
	"time"
	"crypto/tls"


	"github.com/redis/go-redis/v9"
)

var Ctx = context.Background()

func InitRedis() *redis.Client {
	redisAddr := os.Getenv("REDIS_URL")

	rdb := redis.NewClient(&redis.Options{
		Addr:     redisAddr,
		Username: "default", // Upstash requires this
		Password: os.Getenv("DB_PASS"),
		DB:       0,

		TLSConfig:    &tls.Config{},

		// Performance optimizations
		PoolSize:     100,
		MinIdleConns: 20,
		PoolTimeout:  4 * time.Second,
		ReadTimeout:  100 * time.Millisecond,
		WriteTimeout: 100 * time.Millisecond,
		DialTimeout:  200 * time.Millisecond,
	})

	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	_, err := rdb.Ping(ctx).Result()
	if err != nil {
		log.Fatalf(" Could not connect to Redis: %v", err)
	}

	log.Println(" Connected to Redis successfully!")

	return rdb
}
