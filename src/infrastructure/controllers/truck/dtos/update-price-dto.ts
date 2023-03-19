import { IsNumber } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class UpdatePriceDto {
  @ApiProperty({ required: true })
  @IsNumber()
  price: number;
}
