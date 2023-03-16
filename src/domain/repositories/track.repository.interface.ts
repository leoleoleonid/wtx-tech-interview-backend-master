import { Truck } from '../model/truck';

export const TRUCK_REPO = "TRUCK_REPO";
export interface TruckRepository {
    insert(tru: Truck): Promise<Truck>;
    find(): Promise<Truck[]>;
    // findOneBy(id: number): Promise<Truck>;
    findById(id: number): Promise<Truck>;
    updatePrice(id: number, price: number): Promise<void>;
    updateScore(id: number, score: number): Promise<void>;
}
