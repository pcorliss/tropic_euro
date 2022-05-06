import { Action } from "../state/Action";
import { GameState } from "../state/GameState";
import { Player } from "../state/Player";
import { Building } from "../state/Building";

export class Hacienda extends Building {
    name = "Hacienda";
    production = false;
    description = "+1 plantation in settler phase";
    staffSpots = 1;
    size = 1;
    staff = 0;
    points = 1;
    cost = 2;
    phase = "freePlantation";
    lastUse = -1;

    freePlantation(gs: GameState, player: Player): Action {
        if (gs.roundCounter <= this.lastUse) {
            return;
        }
        return new Action(
            "chooseRandom",
            (gs: GameState, player: Player): void => {
                player.board.plantations.push(gs.plantationSupply.pop());
                this.lastUse = gs.roundCounter;
                return;
            }
        );
    }
}