import { Entity, Column, OneToOne, PrimaryColumn, JoinColumn } from 'typeorm';
import { Truck } from '../truck/truck.entity';

@Entity()
export class TruckScore {
  @PrimaryColumn()
  @OneToOne(() => Truck, (truck: Truck) => truck.id)
  @JoinColumn({ name: 'truck_id' })
  truck_id: number;

  @Column({
    default: 0,
    type: 'float'
  })
  score: number;
}
