import { Building } from "../state/Building";

export class SmallSugarMill extends Building {
    name = "Small Sugar Mill";
    production = true;
    productionType = "sugar";
    description = "";
    staffSpots = 1;
    size = 1;
    staff = 0;
    points = 1;
    cost = 2;
    phase = "production";
}