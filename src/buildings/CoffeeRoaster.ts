import { Building } from "../state/Building";
import { Good } from "../state/Good";

export class CoffeeRoaster extends Building {
    name = "Coffee Roaster";
    production = true;
    productionType: Good = "coffee";
    description = "";
    staffSpots = 2;
    size = 1;
    staff = 0;
    points = 3;
    cost = 6;
    phase = "production";
}