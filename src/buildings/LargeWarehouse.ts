import { Building } from "../state/Building";

export class LargeWarehouse extends Building {
    name = "Large Warehouse";
    production = false;
    description = "+2 good types may be stored";
    staffSpots = 1;
    size = 1;
    staff = 0;
    points = 2;
    cost = 6;
}