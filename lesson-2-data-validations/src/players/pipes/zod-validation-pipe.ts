import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ZodObject } from 'zod';
import { fromZodError } from 'zod-validation-error';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodObject<any>) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      this.schema.strict().parse(value);
      //   this.schema.passthrough().parse(value);
    } catch (error) {
      throw new BadRequestException('Validation failed' + fromZodError(error));
    }
    return value;
  }
}
