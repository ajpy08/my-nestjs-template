import { Test, TestingModule } from '@nestjs/testing';
import { CommonController } from '../common.controller';
import { CommonService } from '../common.service';
import { HealthResponseDto } from '../dto/health-response.dto';

describe('CommonController', () => {
  let controller: CommonController;
  let service: CommonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommonController],
      providers: [
        {
          provide: CommonService,
          useValue: {
            health: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CommonController>(CommonController);
    service = module.get<CommonService>(CommonService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('health', () => {
    it('should return health status from service', () => {
      const mockHealthResponse: HealthResponseDto = {
        message: 'OK',
        timestamp: new Date(),
      };

      const mockService = service as jest.Mocked<CommonService>;
      mockService.health.mockReturnValue(mockHealthResponse);

      const result = controller.health();

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockService.health).toHaveBeenCalled();
      expect(result).toEqual(mockHealthResponse);
    });

    it('should call service.health method', () => {
      const mockHealthResponse: HealthResponseDto = {
        message: 'OK',
        timestamp: new Date(),
      };

      const mockService = service as jest.Mocked<CommonService>;
      mockService.health.mockReturnValue(mockHealthResponse);

      controller.health();

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockService.health).toHaveBeenCalledTimes(1);
    });
  });
});
