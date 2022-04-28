import { Building } from "../state/Building";
import { Good } from "../state/Good";

export class LargeSugarMill extends Building {
    name = "Large Sugar Mill";
    production = true;
    productionType: Good = "sugar";
    description = "";
    staffSpots = 3;
    size = 1;
    staff = 0;
    points = 2;
    cost = 4;
    phase = "production";
}