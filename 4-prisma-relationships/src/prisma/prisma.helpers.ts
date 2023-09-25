import { NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export function isPrismaError(
  error,
): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError;
}

export function prismaErrorHandler(
  error: Prisma.PrismaClientKnownRequestError,
) {
  if (error.code === 'P2025') return new NotFoundException(error.meta.cause);
}
