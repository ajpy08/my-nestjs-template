import { Test, TestingModule } from '@nestjs/testing';
import { CommonService } from '../common.service';
import { HealthResponseDto } from '../dto/health-response.dto';

describe('CommonService', () => {
  let service: CommonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommonService],
    }).compile();

    service = module.get<CommonService>(CommonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('health', () => {
    it('should return health status with message and timestamp', () => {
      const result = service.health();

      expect(result).toBeInstanceOf(HealthResponseDto);
      expect(result.message).toBe('OK');
      expect(result.timestamp).toBeInstanceOf(Date);
    });

    it('should return current timestamp', () => {
      const beforeCall = new Date();
      const result = service.health();
      const afterCall = new Date();

      expect(result.timestamp.getTime()).toBeGreaterThanOrEqual(
        beforeCall.getTime(),
      );
      expect(result.timestamp.getTime()).toBeLessThanOrEqual(
        afterCall.getTime(),
      );
    });
  });
});
