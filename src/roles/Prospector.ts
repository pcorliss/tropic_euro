import { Role } from "../state/Role";
import { Action } from "../state/Action";
import { GameState } from "../state/GameState";
import { Player } from "../state/Player";
export class Prospector extends Role {
    name = "Prospector";
    description = "";
    phase = "prospecting";

    chooseProspector = (gs: GameState, player: Player) => {
        this.chooseThisRole(gs);
        player.doubloons++;
        gs.endRole();
        return;
    };

    get chooseAction(): Action {
        return new Action(
            `choose${this.name}`,
            this.chooseProspector,
        );
    }
}