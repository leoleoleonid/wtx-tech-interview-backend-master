import { Controller, Get, Param, Query } from '@nestjs/common';
import { TruckScoreByIdDto } from './dtos/get-truck-score.dto';
import { TruckScoreService } from './truck-score.service';

@Controller('trucks/score')
export class TruckScoreController {
  constructor(private readonly truckScoreService: TruckScoreService) {}

  @Get(':truckId')
  findScoreByTruckId(
    @Param('truckId') truckId: number,
    @Query() queryString: TruckScoreByIdDto,
  ) {
    return this.truckScoreService.findByTruckId(truckId, queryString);
  }
}
