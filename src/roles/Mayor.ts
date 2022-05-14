import { Role } from "../state/Role";
import { Action } from "../state/Action";
import { GameState } from "../state/GameState";
import { Player } from "../state/Player";
import { Board } from "../state/Board";

import { plainToClass } from "class-transformer";

export class Mayor extends Role {
    name = "Mayor";
    description = "";
    phase = "mayoring";
    completedPlayers: number[] = [];

    chooseMayor = (gs: GameState, player: Player) => {
        this.chooseThisRole(gs, player);

        const colonistsPerPlayer = Math.floor(gs.colonyShip / gs.players.length);
        const extraColonists = gs.colonyShip % gs.players.length;
        gs.colonyShip = 0;

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

        if (player.board.totalColonists() >= player.board.totalSpots()) { return []; }
        const pIdx = gs.players.indexOf(player);
        if (this.completedPlayers.indexOf(pIdx) >= 0) { return []; }

        actions.push(
            new Action(
                "rearrangeBoard",
                (gs: GameState, player: Player, blob: unknown): void => {
                    const newBoard = plainToClass(Board, blob);
                    player.board = newBoard;
              
                    this.completedPlayers.push(pIdx);

                    if (this.finished(gs)) {
                        gs.endRole();
                    }
                    return;
                },
                (gs: GameState, player: Player, blob: unknown): boolean => {
                    const newBoard = plainToClass(Board, blob);
                    return player.board.totalColonists() == newBoard.totalColonists()
                        && player.board.sameBuildings(newBoard)
                        && player.board.samePlantations(newBoard)
                        && (newBoard.sanJuanColonists == 0 || newBoard.openBuildingSpaces() == 0);
                }
            )
        );

        return actions;
    }

    finished(gs: GameState): boolean {
        return gs.players.every((p) => this.availableActions(gs, p).length == 0);
    }

    endRole(gs?: GameState, player?: Player): void {
        this.completedPlayers = [];
        return;
    }
}