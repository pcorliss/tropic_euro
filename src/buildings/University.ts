import { GameState } from "../state/GameState";
import { Player } from "../state/Player";
import { Building } from "../state/Building";

export class University extends Building {
    name = "University";
    production = false;
    description = "+1 colonist with building";
    staffSpots = 1;
    size = 1;
    staff = 0;
    points = 3;
    cost = 8;
    phase = "building";

    building(gs: GameState, p: Player, b: Building): void {
        // not all buildings accept a colonist
        if (b.staffSpots == 0) { return ;}
        const colonists = gs.takeColonists(1);
        b.staff = colonists;
        return;
    }
}