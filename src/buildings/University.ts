import { Building } from "../state/Building";

export class University extends Building {
    name = "University";
    production = false;
    description = "+1 colonist with building";
    staffSpots = 1;
    size = 1;
    staff = 0;
    points = 3;
    cost = 8;
    phase = "building";
}