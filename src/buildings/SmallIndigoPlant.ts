import { Building } from "../state/Building";
import { Good } from "../state/Good";

export class SmallIndigoPlant extends Building {
    name = "Small Indigo Plant";
    production = true;
    productionType: Good = "indigo";
    description = "";
    staffSpots = 1;
    size = 1;
    staff = 0;
    points = 1;
    cost = 1;
    phase = "production";
}