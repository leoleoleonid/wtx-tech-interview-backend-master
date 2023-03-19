import {Body, Controller, Get, Param, Patch, Query} from '@nestjs/common';
import {TruckUseCases} from "../../../usecases/truck/truck.usecases";
import {Truck} from "../../../domain/model/truck";
import {UpdatePriceDto} from "./dtos/update-price-dto";
import {LocationDto} from "./dtos/location.query-param.dto";
import {ApiOkResponse} from "@nestjs/swagger";
import {TruckPresenter} from "./presenters/truck.presentor";

const TRUCK_PRICE_UPDATED = 'The price has been successfully updated.';

@Controller('trucks')
export class TruckController {

  constructor(private readonly truckUseCases: TruckUseCases) {}

  @Get()
  @ApiOkResponse({type: TruckPresenter, isArray: true})
  async getTrucks(@Query() queryString: LocationDto): Promise<Truck[]> {
    return this.truckUseCases.getTrucks(queryString.location);
  }

  @Patch(':id')
  @ApiOkResponse({description: TRUCK_PRICE_UPDATED})
  async updatePrice(
      @Param('id') id: number,
      @Body() body: UpdatePriceDto,
  ): Promise<string> {
    await this.truckUseCases.updatePrice(id, body.price);
    return TRUCK_PRICE_UPDATED
  }

  @Get('score/:truckId')
  @ApiOkResponse({type: TruckPresenter, isArray: false})
  findScoreByTruckId(
      @Param('truckId') truckId: number,
      @Query() queryString: LocationDto,
  ) {
    return this.truckUseCases.getTruckScore(truckId, queryString.location);
  }
}
