import { Building } from "../state/Building";

export class Wharf extends Building {
    name = "Wharf";
    production = false;
    description = "your own ship";
    staffSpots = 1;
    size = 1;
    staff = 0;
    points = 3;
    cost = 9;
    phase = "shipping";
}