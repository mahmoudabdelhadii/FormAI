import { PrismaClient } from '../../generated/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

const prisma = mockDeep<PrismaClient>();

export default prisma;
