import { ApiProperty } from '@nestjs/swagger';

export class HealthResponseDto {
  @ApiProperty({ example: 'OK' })
  message: string;

  @ApiProperty({ example: '1721432532428' })
  timestamp: Date;

  constructor(data: HealthResponseDto) {
    this.message = data.message;
    this.timestamp = data.timestamp;
  }
}
