import {Test} from '@nestjs/testing';
import {ConfigModule} from "@nestjs/config";
import {NotFoundException} from "@nestjs/common";
import {LocationEnum, Truck, TruckBrandsEnum} from '../../domain/model/truck';
import {LoggerModule} from "../../infrastructure/logger/logger.module";
import {ExceptionsModule} from "../../infrastructure/exceptions/exceptions.module";
import {TruckUseCases} from "./truck.usecases";
import {TRUCK_REPOSITORY_TOKEN, TruckRepository} from "../../domain/repositories/track.repository.interface";
import {
  ITruckTypeAvgPriceService,
  TypeToPrice,
  I_TRUCK_TYPE_AVG_PRICE_SERVICE_TOKEN
} from "../../domain/adapters/truck-type-avg-price.service.interface";

const TYPE_TO_PRICE : TypeToPrice = {};
TYPE_TO_PRICE["1"] = 11111;
TYPE_TO_PRICE["2"] = 22222;
TYPE_TO_PRICE["3"] = 33333;
describe('TruckUseCases', function () {
  let truckUseCases: TruckUseCases;
  let truckRepositoryMock: TruckRepository;
  let avgPriceServiceMock: ITruckTypeAvgPriceService;

  beforeEach(async function () {

    truckRepositoryMock = {
      insert: jest.fn(),
      find: jest.fn(),
      findById: jest.fn(),
      updatePrice: jest.fn(),
      updateScore: jest.fn(),
    };

    avgPriceServiceMock = {
      getTypeToPrice: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test'
        }),
        LoggerModule,
        ExceptionsModule,
      ],
      providers: [
        {
          provide: TRUCK_REPOSITORY_TOKEN,
          useValue: truckRepositoryMock,
        },
        {
          provide: I_TRUCK_TYPE_AVG_PRICE_SERVICE_TOKEN,
          useValue: avgPriceServiceMock,
        },
        TruckUseCases,
      ],
    }).compile();

    truckUseCases = moduleRef.get<TruckUseCases>(TruckUseCases);

    (avgPriceServiceMock.getTypeToPrice as jest.Mock).mockResolvedValueOnce(TYPE_TO_PRICE);
  });

  it('should be defined', () => {
    expect(truckUseCases).toBeDefined();
  });

  describe('getTrucks', () => {
    it('trucks from client location', async() => {

      const truck: Truck = new Truck();
      truck.location = LocationEnum.JORDAN;
      truck.score = 0.5;

      (truckRepositoryMock.find as jest.Mock).mockResolvedValueOnce([truck]);
      const returnedTrucks = await truckUseCases.getTrucks(LocationEnum.JORDAN);
      expect(returnedTrucks[0].score).toEqual(1);

    });

    it('trucks not from client location', async() => {

      const truck: Truck = new Truck();
      truck.location = LocationEnum.JORDAN;
      truck.score = 0.5;

      (truckRepositoryMock.find as jest.Mock).mockResolvedValueOnce([truck]);
      const returnedTrucks = await truckUseCases.getTrucks(LocationEnum.LISBON);
      expect(returnedTrucks[0].score).toEqual(0.5);
    });
  })

  describe('getTruckScore', () => {
    it('truck from client location', async () => {
      const truck: Truck = new Truck();
      truck.id = 1;
      truck.location = LocationEnum.JORDAN;
      truck.score = 0.5;

      (truckRepositoryMock.findById as jest.Mock).mockResolvedValueOnce(truck);
      const returnedTruck = await truckUseCases.getTruckScore(truck.id, LocationEnum.JORDAN);
      expect(returnedTruck.score).toEqual(1);
    });

    it('truck not from client location', async () => {
      const truck: Truck = new Truck();
      truck.id = 1;
      truck.location = LocationEnum.JORDAN;
      truck.score = 0.5;

      (truckRepositoryMock.findById as jest.Mock).mockResolvedValueOnce(truck);
      const returnedTruck = await truckUseCases.getTruckScore(truck.id, LocationEnum.LISBON);
      expect(returnedTruck.score).toEqual(0.5);
    });
  })

  describe('updatePrice', () => {
    it('existed truck', async () => {
      const truck: Truck = new Truck();
      truck.id = 1;
      truck.location = LocationEnum.JORDAN;
      truck.score = 0.5;

      (truckRepositoryMock.findById as jest.Mock).mockResolvedValueOnce(truck);
      await truckUseCases.updatePrice(truck.id, 123123);
      expect(truckRepositoryMock.updatePrice).toHaveBeenCalledWith(truck.id, 123123)
    });

    it('not existed truck', async () => {
      const truck: Truck = new Truck();
      truck.id = 1;
      truck.location = LocationEnum.JORDAN;
      truck.score = 0.5;

      try {
        await truckUseCases.updatePrice(truck.id, 123123);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.response.message).toEqual(`No truck with id: ${truck.id}`);
      }
    });
  })

  describe('updateTruckScores', function () {
    describe('price smaller then avg', () => {
      describe('From Jordan', () => {
        describe('Brand is Mercedes', () => {
          it('should be 1.5', async () => {
            const truck: Truck = new Truck();
            truck.id = 1;
            truck.truck_brand = TruckBrandsEnum.MERCEDES;
            truck.truck_type = 2;
            truck.price = 11111;
            truck.location = LocationEnum.JORDAN;
            truck.score = 0;

            const EXPECTED_SCORE = 1.5;

            (truckRepositoryMock.find as jest.Mock).mockResolvedValueOnce([truck]);
            const trucks: Truck[] = await truckUseCases.updateTruckScores();
            const truckWithRecalculatedScore = trucks[0];
            expect(truckWithRecalculatedScore.score).toEqual(EXPECTED_SCORE);
            expect(truckRepositoryMock.updateScore).toHaveBeenCalledWith(truck.id, EXPECTED_SCORE)

          })
        })
        describe('Brand is not Mercedes', () => {
          it('should be 1', async () => {
            const truck: Truck = new Truck();
            truck.id = 1;
            truck.truck_brand = TruckBrandsEnum.VOLVO;
            truck.truck_type = 2;
            truck.price = 11111;
            truck.location = LocationEnum.JORDAN;
            truck.score = 0;

            const EXPECTED_SCORE = 1;

            (truckRepositoryMock.find as jest.Mock).mockResolvedValueOnce([truck]);
            const trucks: Truck[] = await truckUseCases.updateTruckScores();
            const truckWithRecalculatedScore = trucks[0];
            expect(truckWithRecalculatedScore.score).toEqual(EXPECTED_SCORE);
            expect(truckRepositoryMock.updateScore).toHaveBeenCalledWith(truck.id, EXPECTED_SCORE)
          })
        })
      })
      describe('Not From Jordan', () => {
        describe('Brand is Mercedes', () => {
          it('should return 1', async () => {

            const truck: Truck = new Truck();
            truck.id = 1;
            truck.truck_brand = TruckBrandsEnum.MERCEDES;
            truck.truck_type = 2;
            truck.price = 11111;
            truck.location = LocationEnum.LISBON;
            truck.score = 0;

            const EXPECTED_SCORE = 1;

            (truckRepositoryMock.find as jest.Mock).mockResolvedValueOnce([truck]);
            const trucks: Truck[] = await truckUseCases.updateTruckScores();
            const truckWithRecalculatedScore = trucks[0];
            expect(truckWithRecalculatedScore.score).toEqual(EXPECTED_SCORE);
            expect(truckRepositoryMock.updateScore).toHaveBeenCalledWith(truck.id, EXPECTED_SCORE)
          })
        })
        describe('Brand is not Mercedes', () => {
          it('should return 0.5', async () => {

            const truck: Truck = new Truck();
            truck.id = 1;
            truck.truck_brand = TruckBrandsEnum.VOLVO;
            truck.truck_type = 2;
            truck.price = 11111;
            truck.location = LocationEnum.LISBON;
            truck.score = 0;

            const EXPECTED_SCORE = 0.5;

            (truckRepositoryMock.find as jest.Mock).mockResolvedValueOnce([truck]);
            const trucks: Truck[] = await truckUseCases.updateTruckScores();
            const truckWithRecalculatedScore = trucks[0];
            expect(truckWithRecalculatedScore.score).toEqual(EXPECTED_SCORE);
            expect(truckRepositoryMock.updateScore).toHaveBeenCalledWith(truck.id, EXPECTED_SCORE)
          })
        })
      })
    })
    describe('price higher then avg', () => {
      describe('From Jordan', () => {
        describe('Brand is Mercedes', () => {
          it('should return 1', async () => {
            const truck: Truck = new Truck();
            truck.id = 1;
            truck.truck_brand = TruckBrandsEnum.MERCEDES;
            truck.truck_type = 2;
            truck.price = 33333;
            truck.location = LocationEnum.JORDAN;
            truck.score = 0;

            const EXPECTED_SCORE = 1;

            (truckRepositoryMock.find as jest.Mock).mockResolvedValueOnce([truck]);
            const trucks: Truck[] = await truckUseCases.updateTruckScores();
            const truckWithRecalculatedScore = trucks[0];
            expect(truckWithRecalculatedScore.score).toEqual(EXPECTED_SCORE);
            expect(truckRepositoryMock.updateScore).toHaveBeenCalledWith(truck.id, EXPECTED_SCORE)
          })
        })
        describe('Brand is not Mercedes', () => {
          it('should return 0.5', async () => {
            const truck: Truck = new Truck();
            truck.id = 1;
            truck.truck_brand = TruckBrandsEnum.SCANIA;
            truck.truck_type = 2;
            truck.price = 33333;
            truck.location = LocationEnum.JORDAN;
            truck.score = 0;

            const EXPECTED_SCORE = 0.5;

            (truckRepositoryMock.find as jest.Mock).mockResolvedValueOnce([truck]);
            const trucks: Truck[] = await truckUseCases.updateTruckScores();
            const truckWithRecalculatedScore = trucks[0];
            expect(truckWithRecalculatedScore.score).toEqual(EXPECTED_SCORE);
            expect(truckRepositoryMock.updateScore).toHaveBeenCalledWith(truck.id, EXPECTED_SCORE)
          })
        })
      })
      describe('Not From Jordan', () => {
        describe('Brand is Mercedes', () => {
          it('should return 0.5', async () => {
            const truck: Truck = new Truck();
            truck.id = 1;
            truck.truck_brand = TruckBrandsEnum.MERCEDES;
            truck.truck_type = 2;
            truck.price = 33333;
            truck.location = LocationEnum.LISBON;
            truck.score = 0;

            const EXPECTED_SCORE = 0.5;

            (truckRepositoryMock.find as jest.Mock).mockResolvedValueOnce([truck]);
            const trucks: Truck[] = await truckUseCases.updateTruckScores();
            const truckWithRecalculatedScore = trucks[0];
            expect(truckWithRecalculatedScore.score).toEqual(EXPECTED_SCORE);
            expect(truckRepositoryMock.updateScore).toHaveBeenCalledWith(truck.id, EXPECTED_SCORE)
          })
        })
        describe('Brand is not Mercedes', () => {
          it('should return 0', async () => {
            const truck: Truck = new Truck();
            truck.id = 1;
            truck.truck_brand = TruckBrandsEnum.VOLVO;
            truck.truck_type = 2;
            truck.price = 33333;
            truck.location = LocationEnum.LISBON;
            truck.score = 0;

            const EXPECTED_SCORE = 0;

            (truckRepositoryMock.find as jest.Mock).mockResolvedValueOnce([truck]);
            const trucks: Truck[] = await truckUseCases.updateTruckScores();
            const truckWithRecalculatedScore = trucks[0];
            expect(truckWithRecalculatedScore.score).toEqual(EXPECTED_SCORE);
            expect(truckRepositoryMock.updateScore).toHaveBeenCalledWith(truck.id, EXPECTED_SCORE)
          })
        })
      })
    })
  })

})
