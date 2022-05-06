import { Building } from "../state/Building";

export class ConstructionHut extends Building {
    name = "Construction Hut";
    production = false;
    description = "quarry instead of plantation";
    staffSpots = 1;
    size = 1;
    staff = 0;
    points = 1;
    cost = 2;
    phase = "plantationOptions";

    plantationOptions(): string[] {
        return ["quarry"];
    }
}