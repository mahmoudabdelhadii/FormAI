package v1

import (
	"context"

	"github.com/jmoiron/sqlx"
	V1Domains "github.com/mahmoudabdelhadii/FormAI/go-rest-api/internal/business/domains/v1"
	"github.com/mahmoudabdelhadii/FormAI/go-rest-api/internal/datasources/records"
)

type postgreUserRepository struct {
	conn *sqlx.DB
}

func NewUserRepository(conn *sqlx.DB) V1Domains.UserRepository {
	return &postgreUserRepository{
		conn: conn,
	}
}

func (r *postgreUserRepository) Store(ctx context.Context, inDom *V1Domains.UserDomain) (err error) {
	userRecord := records.FromUsersV1Domain(inDom)

	_, err = r.conn.NamedQueryContext(ctx, `INSERT INTO users(username, email, password, isemailverified) VALUES (:username, :email, :password, false)`, userRecord)
	if err != nil {
		return err
	}

	return nil
}

func (r *postgreUserRepository) GetByEmail(ctx context.Context, inDom *V1Domains.UserDomain) (outDomain V1Domains.UserDomain, err error) {
	userRecord := records.FromUsersV1Domain(inDom)

	err = r.conn.GetContext(ctx, &userRecord, `SELECT * FROM public."User" WHERE "email" = $1`, userRecord.Email)
	if err != nil {
		return V1Domains.UserDomain{}, err
	}

	return userRecord.ToV1Domain(), nil
}

func (r *postgreUserRepository) GetByUsername(ctx context.Context, inDom *V1Domains.UserDomain) (outDomain V1Domains.UserDomain, err error) {
	userRecord := records.FromUsersV1Domain(inDom)

	err = r.conn.GetContext(ctx, &userRecord, `SELECT * FROM public."User" WHERE "username" = $1`, userRecord.Username)
	if err != nil {
		return V1Domains.UserDomain{}, err
	}

	return userRecord.ToV1Domain(), nil
}


func (r *postgreUserRepository) ChangeActiveUser(ctx context.Context, inDom *V1Domains.UserDomain) (err error) {
	userRecord := records.FromUsersV1Domain(inDom)

	_, err = r.conn.NamedQueryContext(ctx, `UPDATE users SET isemailverified = :isemailverified WHERE id = :id`, userRecord)

	return
}
