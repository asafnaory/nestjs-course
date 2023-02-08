import { HttpException, InternalServerErrorException } from '@nestjs/common';
import { isPrismaError, prismaErrorHandler } from 'src/prisma/prisma.helpers';

export function isNestException(error: unknown): error is HttpException {
  return error instanceof HttpException;
}
export function isError(error: unknown): error is Error {
  return error instanceof Error;
}

export function handleErrors(e: unknown) {
  if (isNestException(e)) throw e;
  else if (isPrismaError(e)) {
    throw prismaErrorHandler(e);
  } else if (isError(e)) {
    throw new InternalServerErrorException(e.message);
  } else {
    throw new InternalServerErrorException(e);
  }
}
