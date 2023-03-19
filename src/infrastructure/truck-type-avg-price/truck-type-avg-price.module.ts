import { Module } from '@nestjs/common';
import {TruckTypeAvgPriceService} from './truck-type-avg-price.service'
import {I_TRUCK_TYPE_AVG_PRICE_SERVICE_TOKEN} from "../../domain/adapters/truck-type-avg-price.service.interface";

@Module({
    providers: [{provide: I_TRUCK_TYPE_AVG_PRICE_SERVICE_TOKEN, useClass: TruckTypeAvgPriceService}],
    exports: [I_TRUCK_TYPE_AVG_PRICE_SERVICE_TOKEN]
})
export class TruckTypeAvgPriceModule {}
