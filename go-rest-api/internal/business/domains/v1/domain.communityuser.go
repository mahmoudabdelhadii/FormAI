package v1

import "time"

type CommunityUserDomain struct {
	ID int
	Community int
	User string
	Role int
	VerifiedAt time.Time
}
