import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class IdValidationPipe implements PipeTransform {
  transform(value: any) {
    if (value < 1 || value > 1000) {
      throw new BadRequestException('id parameter is not a valid ID');
    }
    return value;
  }
}
