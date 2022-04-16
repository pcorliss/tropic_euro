import { Building } from "../state/Building";

export class SmallIndigoPlant extends Building {
    name = "Small Indigo Plant";
    production = true;
    productionType = "indigo";
    description = "";
    staffSpots = 1;
    size = 1;
    staff = 0;
    points = 1;
    cost = 1;
    phase = "production";
}