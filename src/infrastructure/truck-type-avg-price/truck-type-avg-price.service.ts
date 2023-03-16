import {Injectable} from '@nestjs/common';
import {
    ITruckTypeAvgPriceService, TypeToPrice
} from "../../domain/adapters/truck-type-avg-price.service.interface";
import {ConfigService} from "@nestjs/config";
import axios from "axios";
import * as fastcsv from "fast-csv";

export class TruckTypeAvgPrice {
    truck_type: number;
    avg_price: number;
}

@Injectable()
export class TruckTypeAvgPriceService implements ITruckTypeAvgPriceService {
    constructor(private readonly configService: ConfigService ) {
    }
    async getTypeToPrice(): Promise<TypeToPrice> {
        const avgPriceByTruckType: TypeToPrice = {};

        await axios
            .get(this.configService.get('AVG_PRICE_BY_TYPE_URL'))
            .then(async ({ data }) => {
                await new Promise((resolve, reject) => {
                    fastcsv
                        .parseString(data, { headers: true })
                        .on('error', (error) => reject(error))
                        .on('data', (data: TruckTypeAvgPrice) =>
                            avgPriceByTruckType[String(data.truck_type)] = data.avg_price,
                        )
                        .on('end', resolve);
                });
            });

        return avgPriceByTruckType;
    }
}
