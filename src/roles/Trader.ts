import { Role } from "../state/Role";
import { Action } from "../state/Action";
import { GameState } from "../state/GameState";
import { Player } from "../state/Player";
export class Trader extends Role {
    name = "Trader";
    description = "";
    phase = "trading";
    chooseAction = new Action(
        "chooseTrader",
        (gs: GameState, p: Player) => {return;},
    );
}