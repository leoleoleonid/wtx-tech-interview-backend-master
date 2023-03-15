import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TruckScoreController } from './truck-score.controller';
import { TruckScore } from './truck-score.entity';
import { TruckScoreService } from './truck-score.service';

@Module({
    imports: [TypeOrmModule.forFeature([TruckScore])],
    controllers: [TruckScoreController],
    providers: [TruckScoreService],
    exports: [TruckScoreService]
})
export class TruckScoreModule { }
