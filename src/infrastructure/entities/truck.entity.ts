import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import {LocationEnum} from "../../domain/model/truck";

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

  @Column({type: "decimal"})
  score: number;
}
