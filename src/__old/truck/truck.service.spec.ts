import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { TruckService } from './truck.service';

describe.only('TruckService', () => {
  let truckService: TruckService;

  beforeEach(async () => {
    const app = await NestFactory.create(AppModule);

    truckService = app.get<TruckService>(TruckService);
  });

  it('should call findAll method ', async () => {
    const trucks = await truckService.findAll();
    const count = await truckService.count();
    expect(trucks.length).toBe(count);
  });

  it('should call findOne method with expected param', async () => {
    const findOneSpy = jest.spyOn(truckService, 'findOne');
    truckService.findOne(1);
    expect(findOneSpy).toHaveBeenCalledWith(1);
  });

  it('should update prices', async () => {
    const NEW_PRICE = 15000;

    await truckService.updatePrice(1, { price: NEW_PRICE });
    const truck = await truckService.findOne(1);
    expect(truck.price).toBe(NEW_PRICE);
  });
});
