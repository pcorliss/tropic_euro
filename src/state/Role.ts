import { Action } from "./Action";
import { GameState } from "./GameState";
import { Player } from "./Player";

export class Role {
    name: string;
    description: string;
    phase: string;
    roleActions: Action[] = [];
    doubloons = 0;
    availableActions(gs?: GameState, player?: Player): Action[] {return [];}

    chooseThisRole: (gs: GameState, player?: Player) => void = (gs: GameState, player: Player) => {
        gs.currentRole = this;
        const index = gs.availableRoles.indexOf(this, 0);
        if (index > -1) {
            gs.availableRoles.splice(index, 1);
        }
        player.doubloons += this.doubloons;
        this.doubloons = 0;
        return;
    };
    get chooseAction(): Action {
        return new Action(
            `choose${this.name}`,
            this.chooseThisRole
        );
    }
}