SELECT
  upi.id,
  upi."firstName",
  upi."lastName",
  upi."avatarUrl",
  upi.bio,
  upi.height,
  upi.weight,
  upi.age,
  u.username,
  u.email,
  u.password,
  c.id AS "communityId",
  ur.role,
  t."refreshToken",
  t."accessToken"
FROM
  (
    (
      (
        (
          (
            "User" u
            LEFT JOIN "CommunityUser" cu ON (((u.username) :: text = (cu."user") :: text))
          )
          LEFT JOIN "Community" c ON ((c.id = cu.community))
        )
        LEFT JOIN "UserRoles" ur ON (
          (
            (ur.id = cu.role)
            AND (ur.id = cu.role)
          )
        )
      )
      LEFT JOIN "UserPersonalInfo" upi ON ((upi.id = u.id))
    )
    LEFT JOIN "Token" t ON (((u.username) :: text = (t."user") :: text))
  )
WHERE
  (u."isEmailVerified" = TRUE);