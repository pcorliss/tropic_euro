import { Building } from "../state/Building";

export class CoffeeRoaster extends Building {
    name = "Coffee Roaster";
    production = true;
    productionType = "coffee";
    description = "";
    staffSpots = 2;
    size = 1;
    staff = 0;
    points = 3;
    cost = 6;
    phase = "production";
}