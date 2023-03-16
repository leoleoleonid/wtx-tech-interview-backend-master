import { define } from 'typeorm-seeding';
import {Truck} from "../../src/infrastructure/entities/truck.entity";
import {LocationEnum} from "../../src/domain/model/truck";


const TRUCK_BRANDS = ['Mercedes-benz', 'Volvo', 'Scania'];
const LOCATIONS = ['Jordan', 'Lisbon', 'Cologne'];

const getTruckBrand = () => {
  return TRUCK_BRANDS[generateNumberBetween(0, TRUCK_BRANDS.length - 1)];
};

const generateNumberBetween = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

define(Truck, () => {
  const truck = new Truck();

  truck.truck_brand = getTruckBrand();
  truck.truck_type = generateNumberBetween(1, 3);
  truck.price = generateNumberBetween(20000, 30000);
  truck.location = LOCATIONS[
    generateNumberBetween(0, LOCATIONS.length - 1)
  ] as LocationEnum;
  truck.score = 0;

  return truck;
});
