import { PrismaClient } from '@prisma/client';
import { prismaTransactional } from '@transactional/prisma';

export const prisma = new PrismaClient().$extends(prismaTransactional);
