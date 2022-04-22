import { Action } from "./Action";
import { GameState } from "./GameState";

export class Role {
    name: string;
    description: string;
    phase: string;
    roleActions: Action[] = [];

    chooseThisRole = (gs: GameState) => {
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