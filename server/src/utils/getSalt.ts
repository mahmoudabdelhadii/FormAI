
import prisma from "./prisma";
import { User, Token } from '@prisma/client';

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