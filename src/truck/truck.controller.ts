import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { UpdateResult } from 'typeorm';
import { UpdatePriceDto } from './dtos/update-price-dto';
import { Truck } from './truck.entity';
import { TruckService } from './truck.service';

@Controller('trucks')
export class TruckController {
  constructor(private readonly truckService: TruckService) {}

  @Get()
  getTrucks(): Promise<Truck[]> {
    return this.truckService.findAll();
  }

  @Patch(':id')
  updatePrice(
    @Param('id') id: number,
    @Body() body: UpdatePriceDto,
  ): Promise<UpdateResult> {
    return this.truckService.updatePrice(id, body);
  }
}
