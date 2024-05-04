package v1

import "time"

type TokenDomain struct {
	ID int
	User string
	RefreshToken string
	AccessToken string
	CreatedAt time.Time
}
