SELECT
  c.id AS community_id,
  cu."user" AS community_user,
  cu.role AS role_id,
  ur.role,
  cu."verifiedAt",
  row_number() OVER (
    ORDER BY
      c.id,
      cu."user"
  ) AS id
FROM
  (
    (
      (
        (
          "Community" c
          JOIN "CommunityUser" cu ON ((c.id = cu.community))
        )
        JOIN "UserRoles" ur ON (
          (
            (ur.id = cu.role)
            AND (ur.id = cu.role)
          )
        )
      )
      JOIN "User" u ON (((cu."user") :: text = (u.username) :: text))
    )
    LEFT JOIN "BannedUsers" bu ON (
      (
        (cu.community = bu.community)
        AND ((bu."user") :: text = (cu."user") :: text)
      )
    )
  )
WHERE
  (
    (cu."verifiedAt" IS NOT NULL)
    AND (
      (bu.community IS NULL)
      AND (bu."user" IS NULL)
    )
  );