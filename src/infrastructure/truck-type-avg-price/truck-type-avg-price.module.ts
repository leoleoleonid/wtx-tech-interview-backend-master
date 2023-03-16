import { Module } from '@nestjs/common';
import {TruckTypeAvgPriceService} from './truck-type-avg-price.service'

@Module({
    providers: [TruckTypeAvgPriceService],
    exports: [TruckTypeAvgPriceService]
})
export class TruckTypeAvgPriceModule {}
