import { Building } from "../state/Building";

export class Harbor extends Building {
    name = "Harbor";
    production = false;
    description = "+VP with shipping";
    staffSpots = 1;
    size = 1;
    staff = 0;
    points = 3;
    cost = 8;
}