import { IsOptional, IsString } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";
import {LocationEnum} from "../../../../domain/model/truck";

export class LocationDto {
  @IsString()
  @IsOptional()
  @ApiProperty({required: false})
  location?: LocationEnum;
}
