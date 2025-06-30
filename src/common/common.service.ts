import { Injectable } from '@nestjs/common';
import { HealthResponseDto } from './dto';

@Injectable()
export class CommonService {
  health(): HealthResponseDto {
    const timestamp = new Date(Date.now());

    const response = new HealthResponseDto({
      message: 'OK',
      timestamp,
    });

    return response;
  }
}
