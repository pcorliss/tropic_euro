import { Building } from "../state/Building";
import { Good } from "../state/Good";

export class SmallSugarMill extends Building {
    name = "Small Sugar Mill";
    production = true;
    productionType: Good = "sugar";
    description = "";
    staffSpots = 1;
    size = 1;
    staff = 0;
    points = 1;
    cost = 2;
    phase = "production";
}