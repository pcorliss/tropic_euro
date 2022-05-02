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


        if (player.board.totalColonists() >= player.board.totalSpots()) { return []; }

        actions.push(
            new Action(
                "rearrangeBoard",
                (gs: GameState, player: Player, blob: unknown): void => {
                    const newBoard = blob as Board;
                    player.board = newBoard;
                    // gs.advancePlayer();
                    return;
                },
                (gs: GameState, player: Player, blob: unknown): boolean => {
                    // const newBoard = blob as Board;
                    const newBoard = plainToClass(Board, blob);
                    if (player.board.totalColonists() != newBoard.totalColonists()) {
                        return false;
                    }
                    if (player.board.buildings.length != newBoard.buildings.length) {
                        return false;
                    }
                    return true;
                }
            )
        );

        return actions;
    }
}