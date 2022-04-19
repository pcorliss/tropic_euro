import { Role } from "../state/Role";
import { Action } from "../state/Action";
import { GameState } from "../state/GameState";
import { Player } from "../state/Player";
export class Prospector extends Role {
    name = "Prospector";
    description = "";
    phase = "prospecting";
    chooseAction = new Action(
        "chooseProspector",
        (gs: GameState, p: Player) => {return;},
    );
}