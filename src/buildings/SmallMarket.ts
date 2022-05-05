import { Player } from "../state/Player";
import { Building } from "../state/Building";

export class SmallMarket extends Building {
    name = "Small Market";
    production = false;
    description = "+1 doubloon with sale";
    staffSpots = 1;
    size = 1;
    staff = 0;
    points = 1;
    cost = 1;
    phase = "tradingBonus";

    tradingBonus(p: Player): void {
        p.doubloons++;
       return; 
    }
}