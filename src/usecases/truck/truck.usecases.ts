import {ILogger, ILOGGER_TOCKEN} from '../../domain/logger/logger.interface';
import {TRUCK_REPO, TruckRepository} from '../../domain/repositories/track.repository.interface';
import {LocationEnum, Truck} from "../../domain/model/truck";
import {
    I_TRUCK_TYPE_AVG_PRICE_SERVICE_TOKEN,
    ITruckTypeAvgPriceService,
    TypeToPrice
} from "../../domain/adapters/truck-type-avg-price.service.interface";
import {Inject, Injectable} from "@nestjs/common";

@Injectable()
export class TruckUseCases {
    constructor(
        @Inject(ILOGGER_TOCKEN)
        private readonly logger: ILogger,
        @Inject(TRUCK_REPO)
        private readonly truckRepository: TruckRepository,
        @Inject(I_TRUCK_TYPE_AVG_PRICE_SERVICE_TOKEN)
        private readonly avgPriceService: ITruckTypeAvgPriceService
    ) {}

    // TODO add pagination
    async getTrucks(location? : LocationEnum): Promise<Truck[]> {
        const trucks: Truck[] = await this.truckRepository.find();
        if (location) {
            trucks.map((truck: Truck) => {
                if (truck.isFromClientLocation(location)) truck.score += 0.5;
            })
        }
        this.logger.log('getTrucks executes', `trucks.length = ${trucks.length}`);
        return  trucks;
    }

    async getTruckScore(id: number, location?: LocationEnum): Promise<Truck> {
        const truck: Truck = await this.truckRepository.findById(id);
        if (location && truck.isFromClientLocation(location)) {
            truck.score += 0.5;
        }
        this.logger.log('getTruckScore execute', `truck: ${JSON.stringify(truck)}`);
        return truck
    }

    async insertTruck(): Promise<void> {
        // TODO must calculate score without clientLocation
        this.logger.error('insertTruck', 'NOT IMPLEMENTED!');
    }

    async updatePrice(id: number, price: number): Promise<void> {
        await this.truckRepository.updatePrice(id, price);
        this.logger.log('updatePrice execute', `Truck ${id} have been updated with price ${price}`);
    }

    async updateTruckScores(): Promise<Truck[]> {
        const avgPriceByTruckType: TypeToPrice = await this.avgPriceService.getTypeToPrice();
        const trucks : Truck[] = await this.truckRepository.find();
        const trucksWithNewScores : Truck[] = [];

        //TODO can be optimized
        for await (const truck of trucks) {
            truck.score = truck.recalculateInitialTruckScore(avgPriceByTruckType);
            await this.truckRepository.updateScore(truck.id, truck.score)
            trucksWithNewScores.push(truck);
        }
        // request agvPrices csv from service
        // calculate scores without location
        // persist scores TO DB
        // return scores to controller or to command executor
        this.logger.log('updateTruckScores UseCase execute', `updated successfully`);
        return trucksWithNewScores;
    }
}
