
import prisma from "./prisma";

async function getSalt(username: string) {
  const user = await prisma.user.findUnique({
    where: { username: username },
    include: { Token: true },
  });
  if (!user || !user.Token) {
    throw new Error('User or token not found');
  }
  return user.Token.salt;
}