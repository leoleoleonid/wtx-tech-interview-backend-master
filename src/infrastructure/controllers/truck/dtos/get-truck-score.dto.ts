import { IsOptional, IsString } from 'class-validator';

export class TruckScoreByIdDto {
  @IsString()
  @IsOptional()
  location?: string;
}
