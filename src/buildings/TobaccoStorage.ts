import { Good } from "../state/Good";
import { Building } from "../state/Building";

export class TobaccoStorage extends Building {
    name = "Tobacco Storage";
    production = true;
    productionType: Good = "tobacco";
    description = "";
    staffSpots = 3;
    size = 1;
    staff = 0;
    points = 3;
    cost = 5;
    phase = "production";
}