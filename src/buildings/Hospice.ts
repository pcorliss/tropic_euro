import { GameState } from "../state/GameState";
import { Player } from "../state/Player";
import { Building } from "../state/Building";
import { Plantation } from "../state/Plantation";


export class Hospice extends Building {
    name = "Hospice";
    production = false;
    description = "+1 colonist in settler phase";
    staffSpots = 1;
    size = 1;
    staff = 0;
    points = 2;
    cost = 4;
    phase = "plantationPlacement";
    plantationPlacement(gs: GameState, pl: Plantation): void {
        if(gs.takeColonists(1) > 0) {
            pl.staffed = true;
        }
        return;
    }
}