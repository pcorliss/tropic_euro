import { Action } from "./Action";
import { GameState } from "./GameState";
import { Player } from "./Player";

export class Role {
    name: string;
    description: string;
    phase: string;
    chooseThisRole = (gs: GameState, p: Player) => {
        gs.currentRole = this;
        const index = gs.availableRoles.indexOf(this, 0);
        if (index > -1) {
            gs.availableRoles.splice(index, 1);
        }
        return;
    };
    get chooseAction(): Action {
        return new Action(
            `choose${this.name}`,
            this.chooseThisRole
        );
    }
}