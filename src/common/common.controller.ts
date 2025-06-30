import { Controller, Get, HttpStatus } from '@nestjs/common';
import { Public } from './decorators';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthResponseDto } from './dto';

@Controller({
  path: '/common',
  version: '1',
})
export class CommonController {
  @Public()
  @Get('health')
  @ApiOperation({ summary: 'Endpoint for health check' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: HealthResponseDto,
  })
  health(): HealthResponseDto {
    return {
      message: 'OK',
      timestamp: new Date(Date.now()),
    };
  }
}

