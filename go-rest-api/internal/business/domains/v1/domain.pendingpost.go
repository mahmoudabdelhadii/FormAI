package v1

type PendingPostDomain struct {
	ID int
	Content string
	FileUrl string
	Community int
	User string
	Caption string
	Status int
	ConfirmationToken string
}
