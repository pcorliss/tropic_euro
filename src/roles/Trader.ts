import { Role } from "../state/Role";
import { Action } from "../state/Action";
import { GameState } from "../state/GameState";
import { Player } from "../state/Player";
import { Good } from "../state/Good";

export class Trader extends Role {
    name = "Trader";
    description = "";
    phase = "trading";

    static goodValues = {
        "corn": 0,
        "indigo": 1,
        "sugar": 2,
        "tobacco": 3,
        "coffee": 4,
    };

    skipPlayersWithNoActions = true;

    endRole(gs?: GameState, player?: Player): void {
        if (gs.tradingHouse.length >= 4) {
            gs.tradingHouse.forEach((g) => {
                gs.goods[g]++;
            });
            gs.tradingHouse = [];
        }
        return;
    }

    // handles office & markets
    availableActions(gs?: GameState, player?: Player): Action[] {
        const actions: Action[] = [];

        if (gs.currentTurnPlayer() != player) { return []; }
        if (gs.tradingHouse.length >= 4) { return []; }

        const playerGoods = new Set(
            Object.entries(player.goods)
                .filter(([g, n]) => n > 0)
                .map(([g,n]) => <Good>g)
        );
        const tradingHouseGoods = new Set<Good>(gs.tradingHouse);

        // Set Difference: playerGoods - tradingHouseGoods;
        const tradeableGoods = new Set([...playerGoods].filter(g => !tradingHouseGoods.has(g)));

        player.board.buildings
            .filter((pb) => pb.phase == "trading" && pb.staff > 0)
            .flatMap((pb) => pb.trading(player))
            .forEach((g) => tradeableGoods.add(g));

        if (tradeableGoods.size == 0) { return []; }

        const totalGoods = Object.entries(player.goods).reduce((acc, [g, n]) => acc += n, 0);

        if (totalGoods == 0) { return []; }

        actions.push(
            new Action(
                "skip",
                (gs: GameState, player: Player): void => {
                    gs.advancePlayer();
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
                        player.doubloons += Trader.goodValues[g];

                        player.board.buildings
                            .filter((pb) => pb.phase == "tradingBonus" && pb.staff > 0)
                            .forEach((pb) => pb.tradingBonus(player));

                        if (player == gs.currentPlayer()) {
                            player.doubloons++;
                        }
                        gs.advancePlayer();
                        return;
                    }
                )
            );
        });

        return actions;
    }
}