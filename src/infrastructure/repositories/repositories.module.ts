import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Truck } from '../entities/truck.entity';

import { DatabaseTruckRepository } from './track.repository';
import { TRUCK_REPO } from "../../domain/repositories/track.repository.interface";

@Module({
  imports: [TypeOrmModule.forFeature([Truck])],
  providers: [{provide: TRUCK_REPO, useClass: DatabaseTruckRepository}],
  exports: [TRUCK_REPO, TypeOrmModule],
})
export class RepositoriesModule {}
