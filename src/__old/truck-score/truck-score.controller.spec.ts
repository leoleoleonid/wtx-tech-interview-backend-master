import { Test, TestingModule } from '@nestjs/testing';
import { TruckScoreByIdDto } from './dtos/get-truck-score.dto';
import { TruckScoreController } from './truck-score.controller';
import { TruckScoreService } from './truck-score.service';

describe("TruckScoreController Unit Tests", () => {
    let truckScoreController: TruckScoreController;
    let truckScoreService: TruckScoreService;

    beforeEach(async () => {
        const ApiServiceProvider = {
            provide: TruckScoreService,
            useFactory: () => ({
                findByTruckId: jest.fn(() => []),
            })
        }
        const app: TestingModule = await Test.createTestingModule({
            controllers: [TruckScoreController],
            providers: [TruckScoreService, ApiServiceProvider],
        }).compile();

        truckScoreController = app.get<TruckScoreController>(TruckScoreController);
        truckScoreService = app.get<TruckScoreService>(TruckScoreService);
    })

    it("calling findScoreByTruckId method ", () => {
        const dto = new TruckScoreByIdDto();
        truckScoreController.findScoreByTruckId(1, dto);
        expect(truckScoreService.findByTruckId).toHaveBeenCalledWith(1, {});
    })

    it("calling findScoreByTruckId method with query string", () => {
        const dto = new TruckScoreByIdDto();
        dto.location = 'foo'
        truckScoreController.findScoreByTruckId(1, dto);
        expect(truckScoreService.findByTruckId).toHaveBeenCalledWith(1, { location: "foo" });
    })
});
