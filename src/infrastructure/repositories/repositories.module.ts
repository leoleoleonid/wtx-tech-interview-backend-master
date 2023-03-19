import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Truck } from '../entities/truck.entity';

import { DatabaseTruckRepository } from './track.repository';
import { TRUCK_REPOSITORY_TOKEN } from "../../domain/repositories/track.repository.interface";

@Module({
  imports: [TypeOrmModule.forFeature([Truck])],
  providers: [{provide: TRUCK_REPOSITORY_TOKEN, useClass: DatabaseTruckRepository}],
  exports: [TRUCK_REPOSITORY_TOKEN, TypeOrmModule],
})
export class RepositoriesModule {}
