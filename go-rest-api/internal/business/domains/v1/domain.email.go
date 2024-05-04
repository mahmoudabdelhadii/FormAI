package v1

import "time"

type EmailDomain struct {
	ID int
	Email string
	VerificationCode string
	MessageId string
	For int
	CreatedAt time.Time
}
