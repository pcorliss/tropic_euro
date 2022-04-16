import { Building } from "../state/Building";

export class CustomsHouse extends Building {
    name = "Customs House";
    production = false;
    description = "+1 VP for each of your 4 VP";
    staffSpots = 1;
    size = 2;
    staff = 0;
    points = 4;
    cost = 10;
}