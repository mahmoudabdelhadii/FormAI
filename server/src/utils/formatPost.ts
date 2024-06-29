import dayjs from "dayjs";
export const formatPost = (post: any) => ({
    ...post,
    createdAt: dayjs(post.createdAt).fromNow(),
  });
  