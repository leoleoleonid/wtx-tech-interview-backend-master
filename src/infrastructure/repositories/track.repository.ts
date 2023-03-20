import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Truck } from '../../domain/model/truck';
import { TruckRepository } from '../../domain/repositories/track.repository.interface';
import { Truck as TruckEntity} from '../entities/truck.entity';

@Injectable()
export class DatabaseTruckRepository implements TruckRepository {
  constructor(
    @InjectRepository(TruckEntity)
    private readonly truckEntityRepository: Repository<TruckEntity>,
  ) {}

  async updatePrice(id: number, price: number): Promise<void> {
    await this.truckEntityRepository.update(
      { id },
      { price },
    );
  }
  async insert(truck: Truck): Promise<Truck> {
    const truckEntity = this.toTruckEntity(truck);
    const result = await this.truckEntityRepository.insert(truckEntity);
    return this.toTruck(result.generatedMaps[0] as TruckEntity);
  }
  async find(): Promise<Truck[]> {
    const trucksEntity = await this.truckEntityRepository.find();
    return trucksEntity.map((truckEntity) => this.toTruck(truckEntity));
  }
  async findById(id: number): Promise<Truck> {
    const truckEntity = await this.truckEntityRepository.findOneBy({id});
    return this.toTruck(truckEntity);
  }

  async updateScore(id: number, score: number): Promise<void> {
    await this.truckEntityRepository.update(
        { id },
        { score },
    )
  }

  private toTruck(truckEntity: TruckEntity): Truck {
    const truck: Truck = new Truck();

    truck.id = truckEntity.id;
    truck.truck_brand = truckEntity.truck_brand;
    truck.truck_type = truckEntity.truck_type;
    truck.price = truckEntity.price;
    truck.location = truckEntity.location;
    truck.score = truckEntity.score;

    return truck;
  }

  private toTruckEntity(truck: Truck): TruckEntity {
    const truckEntity: TruckEntity = new TruckEntity();

    truckEntity.id = truck.id;
    truckEntity.truck_brand = truck.truck_brand;
    truckEntity.truck_type = truck.truck_type;
    truckEntity.price = truck.price;
    truckEntity.location = truck.location;
    truckEntity.score = truck.score;

    return truckEntity;
  }
}
