import { Building } from "../state/Building";

export class Residence extends Building {
    name = "Residence";
    production = false;
    description = "+4/5/6/7 VP for 1-9/10/11/12 filled island spaces";
    staffSpots = 1;
    size = 2;
    staff = 0;
    points = 4;
    cost = 10;
}