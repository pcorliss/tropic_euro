import { Role } from "../state/Role";
import { Action } from "../state/Action";
import { GameState } from "../state/GameState";
import { Player } from "../state/Player";
import { filter, map } from "lodash";
export class Trader extends Role {
    name = "Trader";
    description = "";
    phase = "trading";

    // handles office & markets
    availableActions(gs?: GameState, player?: Player): Action[] {
        const actions: Action[] = [];

        if (gs.currentTurnPlayer() != player) { return []; }
        if (gs.tradingHouse.length >= 4) { return []; }


        // const entries = Object.entries(player.goods);
        // const filteredEntries = entries.filter(([g, n]) => n > 0);
        // const mappedEntries = filteredEntries.map(([g,n]) => <"corn"|"indigo"|"sugar"|"tobacco"|"coffee">g);

        // const playerGoods = new Set<"corn"|"indigo"|"sugar"|"tobacco"|"coffee">(
        const playerGoods = new Set(
            Object.entries(player.goods)
                .filter(([g, n]) => n > 0)
                .map(([g,n]) => <"corn"|"indigo"|"sugar"|"tobacco"|"coffee">g)
        );
        const tradingHouseGoods = new Set<"corn"|"indigo"|"sugar"|"tobacco"|"coffee">(gs.tradingHouse);

        // Set Difference: playerGoods - tradingHouseGoods;
        const tradeableGoods = new Set([...playerGoods].filter(g => !tradingHouseGoods.has(g)));
        if (tradeableGoods.size == 0) { return []; }

        const totalGoods = Object.entries(player.goods).reduce((acc, [g, n]) => acc += n, 0);

        if (totalGoods == 0) { return []; }

        actions.push(
            new Action(
                "skip",
                (gs: GameState, player: Player): void => {
                    // gs.advancePlayer();
                    return;
                },
            )
        );

        tradeableGoods.forEach((g) => {
            actions.push(
                new Action(
                    `trade${g[0].toUpperCase()}${g.slice(1)}`,
                    (gs: GameState, player: Player): void => {
                        gs.tradingHouse.push(g);
                        player.goods[g]--;
                        // gs.advancePlayer();
                        return;
                    }
                )
            );
        });

        return actions;
    }
}