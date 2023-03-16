// import { Module } from '@nestjs/common';
// import {TruckUseCases} from "../../../usecases/truck/truck.usecases";
// import {ILogger} from "../../../domain/logger/logger.interface";
// import {TruckRepository} from "../../../domain/repositories/track.repository.interface";
// import {LoggerService} from "../../logger/logger.service";
// import {DatabaseTruckRepository} from "../../repositories/track.repository";
// import {TruckTypeAvgPriceService} from "../../services/truck-type-avg-price/truck-type-avg-price.service";
// import {ITruckTypeAvgPriceService} from "../../../domain/adapters/truck-type-avg-price.service.interface";
//
// @Module({
//     imports: [],
//     controllers: [UsersController],
//     providers: [
//         TruckUseCases,
//         LoggerService,
//         DatabaseTruckRepository,
//         TruckTypeAvgPriceService,
//         // { provide: ILogger, useExisting: LoggerService },
//         // { provide: TruckRepository, useClass: DatabaseTruckRepository },
//         // { provide: ITruckTypeAvgPriceService, useClass: TruckTypeAvgPriceService },
//     ],
// })
// export class TruckModule {}
