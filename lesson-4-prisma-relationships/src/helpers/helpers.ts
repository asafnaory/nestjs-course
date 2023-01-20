import { HttpException } from '@nestjs/common';

export function isNestException(error: unknown): error is HttpException {
  return error instanceof HttpException;
}
