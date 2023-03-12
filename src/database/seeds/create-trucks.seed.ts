import { Factory, Seeder } from 'typeorm-seeding';
import { Truck } from '../../truck/truck.entity';
import { TruckScore } from '../../truck-score/truck-score.entity';

export default class CreateTrucks implements Seeder {
  public async run(factory: Factory): Promise<any> {
    const trucks = await factory(Truck)().createMany(20);

    const runs = trucks.map((truck: Truck) => {
      return factory(TruckScore)().create({
        truck_id: truck.id,
        score: 0,
      });
    });
    await Promise.all(runs);
  }
}
