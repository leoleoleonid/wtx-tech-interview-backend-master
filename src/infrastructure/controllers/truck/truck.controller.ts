import {Body, Controller, Get, Param, Patch, Query} from '@nestjs/common';
// import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
// import {UpdateResult} from "typeorm";
import {TruckUseCases} from "../../../usecases/truck/truck.usecases";
import {LocationEnum, Truck} from "../../../domain/model/truck";
import {UpdatePriceDto} from "./dtos/update-price-dto";
import {TruckScoreByIdDto} from "./dtos/get-truck-score.dto";

@Controller('trucks')
export class TruckController {

  constructor(private readonly truckUseCases: TruckUseCases) {}

  @Get()
  async getTrucks(): Promise<Truck[]> {
    return this.truckUseCases.getTrucks();
  }

  @Patch(':id')
  async updatePrice(
      @Param('id') id: number,
      @Body() body: UpdatePriceDto,
  ): Promise<string> {
    await this.truckUseCases.updatePrice(id, body.price);
    return 'success'
  }

  @Get('score/:truckId')
  findScoreByTruckId(
      @Param('truckId') truckId: number,
      @Query() queryString: TruckScoreByIdDto,
  ) {
    return this.truckUseCases.getTruckScore(truckId, queryString.location as LocationEnum);
  }
}
