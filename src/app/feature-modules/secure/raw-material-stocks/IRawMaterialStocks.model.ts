import { IStockDetails } from './IStockDetails.model';
import { RawMaterialStockDetails } from './IRawMaterialStockDetails.model';

export class RawMaterialStocks {
    RawMaterialStocks: RawMaterialStockDetails;
    RMStockLotDetails: IStockDetails[];
}
