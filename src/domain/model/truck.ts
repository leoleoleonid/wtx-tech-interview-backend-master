import {TypeToPrice} from "../adapters/truck-type-avg-price.service.interface";

export enum LocationEnum {
    JORDAN = 'Jordan',
    LISBON = 'Lisbon',
    COLOGNE = 'Cologne',
}

// TODO remove enum , can be unpredictable value
export enum TruckBrandsEnum {
    MERCEDES = 'Mercedes-benz',
    VOLVO = 'Volvo',
    SCANIA = 'Scania',
}

export class Truck {
    id: number;
    truck_brand: string;
    truck_type: number;
    price: number;
    location: LocationEnum;
    score: number;

    recalculateInitialTruckScore(avgPricePerType: TypeToPrice): number {
        // INITIAL SCORE - means that wo don't use client location for calculation
        let score: number = 0;
        if (this.isPriceLessThenAVG(avgPricePerType)) score += 0.5;
        if (this.isFromJordan()) score += 0.5;
        if (this.isBrandMercedes()) score += 0.5;

        return score
    }
    isFromClientLocation(clientLocation?: LocationEnum): boolean {
        if (!clientLocation) return false;
        return this.location === clientLocation
    }
    isFromJordan(): boolean {
        return this.location === LocationEnum.JORDAN
    }
    isPriceLessThenAVG(avgPricePerType: TypeToPrice): boolean {
        const avgPrice = avgPricePerType[String(this.truck_type)]
        return this.price < avgPrice
    }

    isBrandMercedes(): boolean {
        return this.truck_brand === TruckBrandsEnum.MERCEDES
    }
}
