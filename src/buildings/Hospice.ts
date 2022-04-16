import { Building } from "../state/Building";

export class Hospice extends Building {
    name = "Hospice";
    production = false;
    description = "+1 colonist in settler phase";
    staffSpots = 1;
    size = 1;
    staff = 0;
    points = 2;
    cost = 4;
}