SELECT
  l.id,
  l.community,
  ls."user",
  ls."entryUrl",
  ls.rank,
  lst.type,
  ls."verifiedBy",
  ls.weight
FROM
  (
    (
      "Leaderboard" l
      JOIN "LeaderboardSubmission" ls ON ((l.community = ls.community))
    )
    JOIN "LeaderboardSubmissionType" lst ON ((ls.type = lst.id))
  );