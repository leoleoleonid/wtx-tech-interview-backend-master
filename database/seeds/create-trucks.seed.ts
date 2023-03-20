import { Factory, Seeder } from 'typeorm-seeding';
import {Truck} from "../../src/infrastructure/entities/truck.entity";

export default class CreateTrucks implements Seeder {
  public async run(factory: Factory): Promise<any> {
    const trucks = await factory(Truck)().createMany(20);
    console.log(trucks)
    // const runs = trucks.map((truck: Truck) => {
    //   return factory(TruckScore)().create({
    //     truck_id: truck.id,
    //     score: 0,
    //   });
    // });
    // await Promise.all(runs);
    // await Promise.all(trucks);
  }
}
