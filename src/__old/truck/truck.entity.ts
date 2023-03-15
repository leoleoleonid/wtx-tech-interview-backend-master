import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { TruckScore } from '../truck-score/truck-score.entity';

export enum LocationEnum {
  JORDAN = 'Jordan',
  LISBON = 'Lisbon',
  COLOGNE = 'Cologne',
}

@Entity()
export class Truck {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  truck_brand: string;

  @Column()
  truck_type: number;

  @Column()
  price: number;

  @Column({
    type: 'enum',
    enum: LocationEnum,
  })
  location: LocationEnum;

  @OneToOne(() => TruckScore, (truckScore) => truckScore.truck_id)
  score: TruckScore;
}
