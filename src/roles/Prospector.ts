import { Role } from "../state/Role";
import { Action } from "../state/Action";
import { GameState } from "../state/GameState";
import { Player } from "../state/Player";
export class Prospector extends Role {
    name = "Prospector";
    description = "";
    phase = "prospecting";
    // chooseAction = new Action("chooseProspector", this.chooseThisRole);
    // (gs: GameState, p: Player) => {
    //     return;
        // this.chooseThisRole(gs, p);
        // // add a money on role function
        // // p.doubloons += this.money;
        // // this.money = 0;
        // p.doubloons++;
        // // Encapsulate this in a endRole function
        // gs.currentPlayerIdx++;
        // gs.currentPlayerIdx %= gs.players.length;
        // gs.currentRole = null;
    // });
}