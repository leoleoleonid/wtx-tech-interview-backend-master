export type TypeToPrice = {[key: string]: number};

export const I_TRUCK_TYPE_AVG_PRICE_SERVICE_TOKEN = 'I_TRUCK_TYPE_AVG_PRICE_SERVICE';
export interface ITruckTypeAvgPriceService {
    getTypeToPrice(): Promise<TypeToPrice>
}