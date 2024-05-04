package v1

type SuspiciousLoginDomain struct {
	ID int
	User string
	IP string
	Country string
	City string
	OS string
	Device string
	DeviceType string
	IsTrusted bool
	UnverifiedAttempts int
	IsBlocked bool
}
