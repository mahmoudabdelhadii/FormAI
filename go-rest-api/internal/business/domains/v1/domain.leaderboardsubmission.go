package v1

import "time"

type LeaderboardSubmissionDomain struct {
	ID int
	User string
	Community int
	EntryUrl string
	VerifiedBy int
	Weight string
	Type int
	VerifiedAt time.Time
	Rank int
}
