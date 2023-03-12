import { Test, TestingModule } from '@nestjs/testing';
import { TruckScoreByIdDto } from './dtos/get-truck-score.dto';
import { TruckScoreService } from './truck-score.service';

class ApiServiceMock {
  findOne = (id: string) => Promise.resolve([]);
  findByTruckId = () => Promise.resolve([]);
  save = (truckScore) => Promise.resolve([]);
}
describe.only('TruckScoreService', () => {
  let truckScoreService: TruckScoreService;

  beforeEach(async () => {
    const ApiServiceProvider = {
      provide: TruckScoreService,
      useClass: ApiServiceMock,
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [TruckScoreService, ApiServiceProvider],
    }).compile();
    truckScoreService = module.get<TruckScoreService>(TruckScoreService);
  });

  it('should call findOne method ', async () => {
    const findOneSpy = jest.spyOn(truckScoreService, 'findOne');
    truckScoreService.findOne(1);
    expect(findOneSpy).toHaveBeenCalledWith(1);
  });

  it('should call findByTruckId method with expected param', async () => {
    const findByTruckIdSpy = jest.spyOn(truckScoreService, 'findByTruckId');
    const dto = new TruckScoreByIdDto();
    truckScoreService.findByTruckId(1, dto);
    expect(findByTruckIdSpy).toHaveBeenCalledWith(1, dto);
  });

  it('should call save method ', async () => {
    const saveSpy = jest.spyOn(truckScoreService, 'save');
    const truckScore = { truck_id: 1, score: 0.5 };
    truckScoreService.save(truckScore);
    expect(saveSpy).toHaveBeenCalledWith(truckScore);
  });
});
