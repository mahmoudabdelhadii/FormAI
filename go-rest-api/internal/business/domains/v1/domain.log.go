package v1

import "time"

type LogDomain struct {
	ID int
	User string
	Context int
	Message string
	Type int
	Level int
	Timestamp time.Time
}
