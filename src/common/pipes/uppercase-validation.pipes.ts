import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class UppercaseValidationPipe implements PipeTransform {
  transform(value: any) {
    if (typeof value !== 'string') {
      throw new BadRequestException('Validation failed: value is not a string');
    }

    if (value !== value.toUpperCase()) {
      throw new BadRequestException(
        'Validation failed: string is not uppercase',
      );
    }

    return value;
  }
}
