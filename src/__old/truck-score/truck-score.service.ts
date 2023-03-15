import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { TruckScore } from './truck-score.entity';
import { TruckScoreByIdDto } from './dtos/get-truck-score.dto';
import { Truck } from 'src/__old/truck/truck.entity';

@Injectable()
export class TruckScoreService {
  constructor(
    @InjectRepository(TruckScore)
    private truckScoreRepository: Repository<TruckScore>,
  ) {}

  findOne(
    id: number,
    options: Omit<FindOneOptions<TruckScore>, 'where'> = {},
  ): Promise<TruckScore> {
    return this.truckScoreRepository.findOne({
      where: {
        truck_id: id,
      },
      ...options,
    });
  }

  async findByTruckId(
    id: number,
    { location }: TruckScoreByIdDto,
  ): Promise<TruckScore> {
    const truck = await this.findOne(id, { relations: ['truck_id'] });

    if (!location) {
      return truck;
    }

    const { location: truckLocation } = truck.truck_id as unknown as Truck;

    return {
      ...truck,
      score:
        truck.score +
        (location.toLocaleLowerCase() === truckLocation.toLocaleLowerCase()
          ? 0.5
          : 0),
    };
  }

  async save({ truck_id, score }) {
    const truckScore = await this.truckScoreRepository.findOne({
      where: {
        truck_id,
      },
    });

    if (!truckScore) throw new NotFoundException('Truck score not found');

    await this.truckScoreRepository.update(truckScore, { score });

    return await this.truckScoreRepository.findOneBy({
      truck_id: truckScore.truck_id,
    });
  }
}
