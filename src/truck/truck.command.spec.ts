import { TruckCommand } from './truck.command';
import { AppModule } from '../app.module';
import { NestFactory } from '@nestjs/core';
import * as fastcsv from 'fast-csv';
import {
  factory,
  tearDownDatabase,
  useRefreshDatabase,
  useSeeding,
} from 'typeorm-seeding';
import { TruckScore } from '../truck-score/truck-score.entity';
import { TruckScoreController } from '../truck-score/truck-score.controller';
import { LocationEnum, Truck } from './truck.entity';
import { EntityProperty } from 'typeorm-seeding/dist/types';

type OutputCsvRow = {
  truck_id: number;
  score: number;
};

describe('Truck Command (e2e)', () => {
  let truckScoreController: TruckScoreController;
  let truckCommand: TruckCommand;

  beforeEach(async () => {
    const app = await NestFactory.create(AppModule);
    await useRefreshDatabase();

    truckScoreController = app.get(TruckScoreController);
    truckCommand = app.get(TruckCommand);

    await seedTestScenarioDB();
  });

  it("doesn't update score when price is above average", async () => {
    const TRUCK_ID = 2;
    const initialTruck = await truckScoreController.findScoreByTruckId(
      TRUCK_ID,
      {},
    );
    expect(initialTruck.score).toBe(0);

    await truckCommand.update();

    const updatedTruck = await truckScoreController.findScoreByTruckId(
      TRUCK_ID,
      {},
    );
    expect(updatedTruck.score).toBe(0);

    const truckScoreFromFile = await getTruckFromCsv(TRUCK_ID);
    expect(truckScoreFromFile.score).toBe(0);
  });

  it('does update score to 0.5 when price is under the average', async () => {
    const TRUCK_ID = 1;
    const initialTruck = await truckScoreController.findScoreByTruckId(
      TRUCK_ID,
      {},
    );
    expect(initialTruck.score).toBe(0);

    await truckCommand.update();

    const updatedTruck = await truckScoreController.findScoreByTruckId(
      TRUCK_ID,
      {},
    );
    expect(updatedTruck.score).toBe(0.5);

    const truckScoreFromFile = await getTruckFromCsv(TRUCK_ID);
    expect(truckScoreFromFile.score).toBe(0.5);
  });

  it('does update score to 1 when price is under the average AND location is Jordan', async () => {
    const TRUCK_ID = 3;
    const initialTruck = await truckScoreController.findScoreByTruckId(
      TRUCK_ID,
      {},
    );
    expect(initialTruck.score).toBe(0);

    await truckCommand.update();

    const updatedTruck = await truckScoreController.findScoreByTruckId(
      TRUCK_ID,
      {},
    );
    expect(updatedTruck.score).toBe(1);

    const truckScoreFromFile = await getTruckFromCsv(TRUCK_ID);
    expect(truckScoreFromFile.score).toBe(1);
  });

  afterAll(async () => {
    await tearDownDatabase();
  });
});

// ****** UTILS

const MOCK_TUCKS: EntityProperty<Truck>[] = [
  { id: 1, truck_type: 1, price: 24000, location: LocationEnum.LISBON }, // Below avg price
  { id: 2, truck_type: 2, price: 22000, location: LocationEnum.COLOGNE }, // Above avg price
  { id: 3, truck_type: 3, price: 25000, location: LocationEnum.JORDAN }, // Below avg price & located in Jordan
];

const seedTestScenarioDB = async () => {
  await useSeeding();

  return MOCK_TUCKS.reduce(async (promise, mockTruck) => {
    await promise;
    await factory(Truck)().create({ ...mockTruck });
    return factory(TruckScore)().create({ truck_id: mockTruck.id, score: 0 });
  }, Promise.resolve(null));
};

const getParsedCsv = async () => {
  const avgPriceByTruckType: OutputCsvRow[] = [];
  await new Promise((resolve, reject) => {
    fastcsv
      .parseFile('trucks_updated.csv', { headers: true })
      .on('error', (error) => reject(error))
      .on('data', (data) => {
        avgPriceByTruckType.push({
          truck_id: Number(data.truck_id),
          score: Number(data.score),
        });
      })
      .on('end', resolve);
  });

  return avgPriceByTruckType;
};

const getTruckFromCsv = async (truckId: number) => {
  const csv = await getParsedCsv();
  return csv.find((truck) => truck.truck_id === truckId);
};
