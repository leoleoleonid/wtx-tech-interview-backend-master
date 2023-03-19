import { IsOptional, IsEnum } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";
import {LocationEnum} from "../../../../domain/model/truck";

export class LocationDto {
  @IsEnum(LocationEnum)
  @IsOptional()
  @ApiProperty({required: false,  enum: LocationEnum})
  location?: LocationEnum;
}
