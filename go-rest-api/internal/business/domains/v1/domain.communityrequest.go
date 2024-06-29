package v1

import "time"

type CommunityRequestDomain struct {
	ID int
	User string
	Community int
	RequestedAt time.Time
	Message string
}
