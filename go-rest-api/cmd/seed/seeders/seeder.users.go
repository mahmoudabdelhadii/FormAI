package seeders

import (
	"github.com/mahmoudabdelhadii/FormAI/go-rest-api/internal/constants"
	"github.com/mahmoudabdelhadii/FormAI/go-rest-api/internal/datasources/records"
	"github.com/mahmoudabdelhadii/FormAI/go-rest-api/pkg/helpers"
	"github.com/mahmoudabdelhadii/FormAI/go-rest-api/pkg/logger"
	"github.com/sirupsen/logrus"
)

var pass string
var UserData []records.Users

func init() {
	var err error
	pass, err = helpers.GenerateHash("12345")
	if err != nil {
		logger.Panic(err.Error(), logrus.Fields{constants.LoggerCategory: constants.LoggerCategorySeeder})
	}

	UserData = []records.Users{
		{
			Username: "patrick star 7",
			Email:    "patrick@gmail.com",
			Password: pass,
			IsEmailVerified:   true,
			Role:   1,
		},
		{
			Username: "john doe",
			Email:    "johndoe@gmail.com",
			Password: pass,
			IsEmailVerified:   false,
			Role:   2,
		},
	}
}
