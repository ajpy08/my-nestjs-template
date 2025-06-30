import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CommonService } from './common.service';
import { Public } from './decorators';
import { HealthResponseDto } from './dto';

@Controller({
  path: '/common',
  version: '1',
})
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  @Public()
  @Get('health')
  @ApiOperation({ summary: 'Endpoint for health check' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: HealthResponseDto,
  })
  health(): HealthResponseDto {
    return this.commonService.health();
  }
}
