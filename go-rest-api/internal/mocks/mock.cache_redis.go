// Code generated by mockery v2.16.0. DO NOT EDIT.

package mocks

import mock "github.com/stretchr/testify/mock"

// RedisCache is an autogenerated mock type for the RedisCache type
type RedisCache struct {
	mock.Mock
}

// Del provides a mock function with given fields: key
func (_m *RedisCache) Del(key string) error {
	ret := _m.Called(key)

	var r0 error
	if rf, ok := ret.Get(0).(func(string) error); ok {
		r0 = rf(key)
	} else {
		r0 = ret.Error(0)
	}

	return r0
}

// Get provides a mock function with given fields: key
func (_m *RedisCache) Get(key string) (string, error) {
	ret := _m.Called(key)

	var r0 string
	if rf, ok := ret.Get(0).(func(string) string); ok {
		r0 = rf(key)
	} else {
		r0 = ret.Get(0).(string)
	}

	var r1 error
	if rf, ok := ret.Get(1).(func(string) error); ok {
		r1 = rf(key)
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}

// Set provides a mock function with given fields: key, value
func (_m *RedisCache) Set(key string, value interface{}) error {
	ret := _m.Called(key, value)

	var r0 error
	if rf, ok := ret.Get(0).(func(string, interface{}) error); ok {
		r0 = rf(key, value)
	} else {
		r0 = ret.Error(0)
	}

	return r0
}

type mockConstructorTestingTNewRedisCache interface {
	mock.TestingT
	Cleanup(func())
}

// NewRedisCache creates a new instance of RedisCache. It also registers a testing interface on the mock and a cleanup function to assert the mocks expectations.
func NewRedisCache(t mockConstructorTestingTNewRedisCache) *RedisCache {
	mock := &RedisCache{}
	mock.Mock.Test(t)

	t.Cleanup(func() { mock.AssertExpectations(t) })

	return mock
}