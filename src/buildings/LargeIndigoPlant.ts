import { Building } from "../state/Building";
import { Good } from "../state/Good";

export class LargeIndigoPlant extends Building {
    name = "Large Indigo Plant";
    production = true;
    productionType: Good = "indigo";
    description = "";
    staffSpots = 3;
    size = 1;
    staff = 0;
    points = 2;
    cost = 3;
    phase = "production";
}