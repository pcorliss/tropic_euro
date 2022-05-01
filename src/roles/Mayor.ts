import { Role } from "../state/Role";
import { Action } from "../state/Action";
import { GameState } from "../state/GameState";
import { Player } from "../state/Player";
export class Mayor extends Role {
    name = "Mayor";
    description = "";
    phase = "mayoring";

    chooseMayor = (gs: GameState, player: Player) => {
        this.chooseThisRole(gs, player);

        const colonistsPerPlayer = Math.floor(gs.colonyShip / gs.players.length);
        const extraColonists = gs.colonyShip % gs.players.length;

        player.board.sanJuanColonists += gs.takeColonists(1);

        let playerIdx = gs.currentPlayerIdx;
        for(let i = 0; i < gs.players.length; i++) {
            const p = gs.players[playerIdx];
            p.board.sanJuanColonists += colonistsPerPlayer;
            if (i < extraColonists) {
                p.board.sanJuanColonists++;
            }
            playerIdx = (playerIdx + 1) % gs.players.length;

            p.board.autoDistributeColonists();
        }

        // Refill the ship
        const openSpots = gs.players.reduce((sum, p) => sum += p.board.openBuildingSpaces(), 0);
        const refill = Math.max(openSpots, gs.players.length);
        gs.colonyShip = gs.takeColonists(refill);

        return;
    };

    get chooseAction(): Action {
        return new Action(
            `choose${this.name}`,
            this.chooseMayor,
        );
    }
    availableActions(gs?: GameState, player?: Player): Action[] {
        const actions: Action[] = [];

        // if (player.board.totalColonists()) {
        //     return actions;
        // }
        actions.push(
            new Action(
                "rearrangeBoard",
                (gs: GameState, player: Player): void => {
                    // gs.advancePlayer();
                    return;
                },
            )
        );

        return actions;
    }
}