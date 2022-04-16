import { Building } from "../state/Building";

export class LargeSugarMill extends Building {
    name = "Large Sugar Mill";
    production = true;
    productionType = "sugar";
    description = "";
    staffSpots = 3;
    size = 1;
    staff = 0;
    points = 2;
    cost = 4;
}