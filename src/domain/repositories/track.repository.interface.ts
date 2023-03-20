import { Truck } from '../model/truck';

export const TRUCK_REPOSITORY_TOKEN = "TRUCK_REPO";
export interface TruckRepository {
    insert(truck: Truck): Promise<Truck>;
    find(): Promise<Truck[]>;
    findById(id: number): Promise<Truck>;
    updatePrice(id: number, price: number): Promise<void>;
    updateScore(id: number, score: number): Promise<void>;
}
