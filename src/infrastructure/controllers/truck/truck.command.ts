import {
    Injectable,
} from '@nestjs/common';
import {Command} from "nestjs-command";
import {TruckUseCases} from "../../../usecases/truck/truck.usecases";
import {Truck} from "../../../domain/model/truck";
import {createWriteStream} from "fs";
import * as fastcsv from 'fast-csv';

@Injectable()
export class TruckCommand {
    constructor(
        private readonly truckUseCases: TruckUseCases
    ) {}

    @Command({
        command: 'trucks:update',
        describe: 'Update trucks',
    })
    async update() {
        const trucks: Truck[] = await this.truckUseCases.recalculateTruckScores();
        console.log(trucks)


        const ws = createWriteStream('trucks_updated.csv');
        fastcsv.write(trucks, { headers: true }).pipe(ws);


    }
}
