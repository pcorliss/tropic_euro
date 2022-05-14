import { Action } from "./Action";
import { GameState } from "./GameState";
import { Player } from "./Player";

export class Role {
    name: string;
    description: string;
    phase: string;
    roleActions: Action[] = [];
    doubloons = 0;
    skipPlayersWithNoActions = false;

    finished(gs: GameState): boolean { 
        let lastPlayerIdx = gs.currentPlayerIdx - 1 + gs.players.length;
        lastPlayerIdx %= gs.players.length;

        return gs.currentTurnPlayerIdx == lastPlayerIdx;
    }

    availableActions(gs?: GameState, player?: Player): Action[] {return [];}
    endRole(gs?: GameState, player?: Player): void {return;}

    chooseThisRole: (gs: GameState, player?: Player) => void = (gs: GameState, player: Player) => {
        gs.currentRole = this;
        const index = gs.availableRoles.indexOf(this, 0);
        if (index > -1) {
            gs.availableRoles.splice(index, 1);
        }
        player.doubloons += this.doubloons;
        this.doubloons = 0;

        if(this.skipPlayersWithNoActions) {
            if (this.availableActions(gs, gs.currentPlayer()).length == 0) {
               gs.advancePlayer(); 
            }
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