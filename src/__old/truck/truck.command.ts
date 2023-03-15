import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import * as fastcsv from 'fast-csv';
import * as fs from 'fs';
import { InjectRepository } from '@nestjs/typeorm';
import { Truck } from './truck.entity';
import { Repository } from 'typeorm';
import axios from 'axios';
import { TruckScoreService } from '../truck-score/truck-score.service';

export class TruckTypeAvgPrice {
  truck_type: number;
  avg_price: number;
}

@Injectable()
export class TruckCommand {
  constructor(
    @InjectRepository(Truck)
    private truckRepository: Repository<Truck>,
    private truckScoreService: TruckScoreService,
  ) {}

  @Command({
    command: 'trucks:update',
    describe: 'Update trucks',
  })
  async update() {
    const trucks = await this.truckRepository.find({
      relations: {
        score: true,
      },
    });

    const avgPriceByTruckType = [];

    await axios
      .get('https://bit.ly/avg-price-by-truck-type')
      .then(async ({ data }) => {
        await new Promise((resolve, reject) => {
          fastcsv
            .parseString(data, { headers: true })
            .on('error', (error) => reject(error))
            .on('data', (data: TruckTypeAvgPrice) =>
              avgPriceByTruckType.push(data),
            )
            .on('end', resolve);
        });
      });

    const trucksWithAvgPrice = [];

    trucks.forEach((truck: any) => {
      trucksWithAvgPrice.push({
        ...truck,
        ...avgPriceByTruckType.find(
          (truckAvgPrice) => truckAvgPrice.truck_type == truck.truck_type,
        ),
      });
    });

    const csv = [];
    for await (const truck of trucksWithAvgPrice) {
      if (truck.price < Number(truck.avg_truck_price)) {
        csv.push(
          await this.truckScoreService.save({
            truck_id: truck.id,
            score:
              truck.location === 'Jordan'
                ? truck?.score?.score + 1
                : truck?.score?.score + 0.5,
          }),
        );
      } else {
        csv.push({ truck_id: truck.id, score: 0 });
      }
    }

    const ws = fs.createWriteStream('trucks_updated.csv');
    fastcsv.write(csv, { headers: true }).pipe(ws);
  }
}
