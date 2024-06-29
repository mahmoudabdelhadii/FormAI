// Code generated by mockery v2.16.0. DO NOT EDIT.

package mocks

import (
	context "context"

	V1Domains "github.com/mahmoudabdelhadii/FormAI/go-rest-api/internal/business/domains/v1"
	mock "github.com/stretchr/testify/mock"
)

// UserRepository is an autogenerated mock type for the UserRepository type
type UserRepository struct {
	mock.Mock
}

// ChangeActiveUser provides a mock function with given fields: ctx, inDom
func (_m *UserRepository) ChangeActiveUser(ctx context.Context, inDom *V1Domains.UserDomain) error {
	ret := _m.Called(ctx, inDom)

	var r0 error
	if rf, ok := ret.Get(0).(func(context.Context, *V1Domains.UserDomain) error); ok {
		r0 = rf(ctx, inDom)
	} else {
		r0 = ret.Error(0)
	}

	return r0
}

// GetByEmail provides a mock function with given fields: ctx, inDom
func (_m *UserRepository) GetByEmail(ctx context.Context, inDom *V1Domains.UserDomain) (V1Domains.UserDomain, error) {
	ret := _m.Called(ctx, inDom)

	var r0 V1Domains.UserDomain
	if rf, ok := ret.Get(0).(func(context.Context, *V1Domains.UserDomain) V1Domains.UserDomain); ok {
		r0 = rf(ctx, inDom)
	} else {
		r0 = ret.Get(0).(V1Domains.UserDomain)
	}

	var r1 error
	if rf, ok := ret.Get(1).(func(context.Context, *V1Domains.UserDomain) error); ok {
		r1 = rf(ctx, inDom)
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}

// Store provides a mock function with given fields: ctx, inDom
func (_m *UserRepository) Store(ctx context.Context, inDom *V1Domains.UserDomain) error {
	ret := _m.Called(ctx, inDom)

	var r0 error
	if rf, ok := ret.Get(0).(func(context.Context, *V1Domains.UserDomain) error); ok {
		r0 = rf(ctx, inDom)
	} else {
		r0 = ret.Error(0)
	}

	return r0
}

type mockConstructorTestingTNewUserRepository interface {
	mock.TestingT
	Cleanup(func())
}

// NewUserRepository creates a new instance of UserRepository. It also registers a testing interface on the mock and a cleanup function to assert the mocks expectations.
func NewUserRepository(t mockConstructorTestingTNewUserRepository) *UserRepository {
	mock := &UserRepository{}
	mock.Mock.Test(t)

	t.Cleanup(func() { mock.AssertExpectations(t) })

	return mock
}
