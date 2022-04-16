import { Building } from "../state/Building";

export class Office extends Building {
    name = "Office";
    production = false;
    description = "sell good already in trading house";
    staffSpots = 1;
    size = 1;
    staff = 0;
    points = 2;
    cost = 5;
}