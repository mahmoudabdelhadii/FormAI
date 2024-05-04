SELECT
  p.id AS post_id,
  p."user",
  p."Content" AS "Post_caption",
  p."fileUrl" AS media_url,
  p.community,
  count(DISTINCT l.id) AS like_count,
  count(DISTINCT c.id) AS comment_count,
  row_number() OVER (
    ORDER BY
      p.id
  ) AS id
FROM
  (
    (
      "Post" p
      LEFT JOIN "Like" l ON ((p.id = l.post))
    )
    LEFT JOIN "Comment" c ON ((p.id = c.post))
  )
GROUP BY
  p.id,
  p."user",
  p."Content",
  p."fileUrl",
  p.community;