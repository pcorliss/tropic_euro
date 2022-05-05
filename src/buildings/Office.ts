import { Good } from "../state/Good";
import { Player } from "../state/Player";
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
    phase = "trading";
    trading(p: Player): Good[] {
        return Object.entries(p.goods)
            .filter(([g, n]) => n > 0)
            .map(([g, n]) => g as Good);
    }
}