import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class IdvalidationPipe implements PipeTransform {
  transform(value: any) {
    if (/^[0-9a-fA-F]{24}$/.test(value) === false) {
      throw new BadRequestException('id parameter is malformed');
    }
    return value;
  }
}
