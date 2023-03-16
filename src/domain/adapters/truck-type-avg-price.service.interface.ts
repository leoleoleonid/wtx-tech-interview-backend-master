export type TypeToPrice = {[key: string]: number};
export interface ITruckTypeAvgPriceService {
    getTypeToPrice(): Promise<TypeToPrice>
}