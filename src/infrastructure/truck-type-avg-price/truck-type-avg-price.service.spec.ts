import { Test, TestingModule } from '@nestjs/testing';
import {TruckTypeAvgPriceService} from "./truck-type-avg-price.service";
import {ConfigModule} from "@nestjs/config";
import {HttpService} from "@nestjs/axios";
import {TypeToPrice} from "../../domain/adapters/truck-type-avg-price.service.interface";
import {LoggerModule} from "../logger/logger.module";

describe('TruckTypeAvgPriceService', () => {
    let service: TruckTypeAvgPriceService;
    let httpServiceMock;

    beforeEach(async () => {
        httpServiceMock = {
            axiosRef: {
                get : jest.fn()
            }
        }

        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    isGlobal: true,
                    envFilePath: '.env.test'
                }),
                LoggerModule
            ],
            providers: [
                TruckTypeAvgPriceService,
                {
                    provide: HttpService,
                    useValue: httpServiceMock,
                },
            ],
        }).compile();

        service = module.get<TruckTypeAvgPriceService>(TruckTypeAvgPriceService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });


    it('should return correct value', async () => {
        const csv =
            'truck_type,avg_truck_price\n' +
            '1,25890\n' +
            '2,20806\n' +
            '3,26748\n';

        const expected: TypeToPrice = {
            "1": 25890,
            "2":20806,
            "3":26748
        };

        (httpServiceMock.axiosRef.get as jest.Mock).mockResolvedValueOnce({data:csv});
        const typeToPrice: TypeToPrice = await service.getTypeToPrice();
        console.log('!!!', typeToPrice)
        expect(Object.keys(typeToPrice).length).toEqual(Object.keys(expected).length);
        Object.keys(expected).map(key => {
            expect(typeToPrice[key]).toEqual(expected[key]);
        })
    });
});
