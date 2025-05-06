package passkey

import (
	"context"
	"encoding/json"
	"time"

	"github.com/redis/go-redis/v9"
)

var ctx = context.Background()

func StoreChallenge(rdb *redis.Client, key string, value any, ttl time.Duration) error {
	bytes, err := json.Marshal(value)
	if err != nil {
		return err
	}
	return rdb.Set(ctx, key, bytes, ttl).Err()
}

func GetChallenge[T any](rdb *redis.Client, key string) (T, error) {
	var value T
	data, err := rdb.Get(ctx, key).Result()
	if err != nil {
		return value, err
	}
	err = json.Unmarshal([]byte(data), &value)
	return value, err
}

func DeleteChallenge(rdb *redis.Client, key string) error {
	return rdb.Del(ctx, key).Err()
}
