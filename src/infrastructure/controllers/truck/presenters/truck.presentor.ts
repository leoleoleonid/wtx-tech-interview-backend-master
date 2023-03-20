import { ApiProperty } from '@nestjs/swagger';
import {LocationEnum} from "../../../../domain/model/truck";

export class TruckPresenter {
    @ApiProperty()
    id: number;
    @ApiProperty()
    truck_brand: string;
    @ApiProperty()
    truck_type: number;
    @ApiProperty()
    price: number;
    @ApiProperty()
    location: LocationEnum;
    @ApiProperty()
    score: number;
}
