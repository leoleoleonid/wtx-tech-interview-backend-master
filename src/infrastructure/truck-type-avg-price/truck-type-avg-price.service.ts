import {Injectable} from '@nestjs/common';
import {
    ITruckTypeAvgPriceService, TypeToPrice
} from "../../domain/adapters/truck-type-avg-price.service.interface";
import {ConfigService} from "@nestjs/config";
import * as fastcsv from "fast-csv";
import {HttpService} from "@nestjs/axios";

export class TruckTypeAvgPrice {
    truck_type: number;
    avg_truck_price: number;
}

@Injectable()
export class TruckTypeAvgPriceService implements ITruckTypeAvgPriceService {
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService

    ) {
    }
    async getTypeToPrice(): Promise<TypeToPrice> {
        const avgPriceByTruckType: TypeToPrice = {};

        const { data } = await this.httpService.axiosRef.get(this.configService.get('AVG_PRICE_BY_TYPE_URL'));
        await new Promise((resolve, reject) => {
            fastcsv
                .parseString(data, { headers: true })
                .on('error', (error) => reject(error))
                .on('data', (data: TruckTypeAvgPrice) => {
                    avgPriceByTruckType[String(data.truck_type)] = Number(data.avg_truck_price)
                })
                .on('end', resolve);
        });

        return avgPriceByTruckType;
    }
}
