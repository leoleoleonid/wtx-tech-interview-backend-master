import { Test, TestingModule } from '@nestjs/testing';
import { TruckService } from './truck.service';
import { TruckController } from './truck.controller';

describe('TruckController Unit Tests', () => {
  let truckController: TruckController;
  let truckService: TruckService;

  beforeEach(async () => {
    const ApiServiceProvider = {
      provide: TruckService,
      useFactory: () => ({
        findAll: jest.fn(() => []),
      }),
    };
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TruckController],
      providers: [TruckService, ApiServiceProvider],
    }).compile();

    truckController = app.get<TruckController>(TruckController);
    truckService = app.get<TruckService>(TruckService);
  });

  it('calling getTrucks method', () => {
    truckController.getTrucks();
    expect(truckService.findAll).toHaveBeenCalled();
  });
});
