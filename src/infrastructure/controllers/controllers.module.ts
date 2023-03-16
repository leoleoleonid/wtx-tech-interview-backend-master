import { Module } from '@nestjs/common';
import {TruckController} from "./truck/truck.controller";
import {TruckUseCases} from "../../usecases/truck/truck.usecases";
import {LoggerService} from "../logger/logger.service";
import {DatabaseTruckRepository} from "../repositories/track.repository";
import {TruckTypeAvgPriceService} from "../truck-type-avg-price/truck-type-avg-price.service";
import {RepositoriesModule} from "../repositories/repositories.module";
import {TruckTypeAvgPriceModule} from "../truck-type-avg-price/truck-type-avg-price.module";
import {LoggerModule} from "../logger/logger.module";

@Module({
  imports: [ LoggerModule, RepositoriesModule, TruckTypeAvgPriceModule],
  controllers: [TruckController],
  providers: [
      TruckUseCases,
      LoggerService,
      DatabaseTruckRepository,
      TruckTypeAvgPriceService
  ]
})
export class ControllersModule {}
