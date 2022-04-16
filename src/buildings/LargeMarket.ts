import { Building } from "../state/Building";

export class LargeMarket extends Building {
    name = "Large Market";
    production = false;
    description = "+2 doubloons with sale";
    staffSpots = 1;
    size = 1;
    staff = 0;
    points = 2;
    cost = 5;
    phase = "trading";
}