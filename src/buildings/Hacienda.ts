import { Building } from "../state/Building";

export class Hacienda extends Building {
    name = "Hacienda";
    production = false;
    description = "+1 plantation in settler phase";
    staffSpots = 1;
    size = 1;
    staff = 0;
    points = 1;
    cost = 2;
}