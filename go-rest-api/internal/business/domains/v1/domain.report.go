package v1

import "time"

type ReportDomain struct {
	ID int
	ReportedBy string
	Post int
	Community int
	ReportReason string
	ReportDate time.Time
}
