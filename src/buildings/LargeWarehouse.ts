import { SmallWarehouse } from "./SmallWarehouse";

export class LargeWarehouse extends SmallWarehouse {
    name = "Large Warehouse";
    production = false;
    description = "+2 good types may be stored";
    staffSpots = 1;
    size = 1;
    staff = 0;
    points = 2;
    cost = 6;
    phase = "spoilOptions";
    maxGoodRecords = 2;
}