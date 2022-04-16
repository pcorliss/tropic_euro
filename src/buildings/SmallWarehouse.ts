import { Building } from "../state/Building";

export class SmallWarehouse extends Building {
    name = "Small Warehouse";
    production = false;
    description = "+1 good type may be stored";
    staffSpots = 1;
    size = 1;
    staff = 0;
    points = 1;
    cost = 3;
}