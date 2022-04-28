import { Role } from "../state/Role";
import { Action } from "../state/Action";
import { GameState } from "../state/GameState";
import { Player } from "../state/Player";
import { Good, goodOptions } from "../state/Good";
export class Craftsman extends Role {
    name = "Craftsman";
    description = "";
    phase = "production";
    firstPlayerGoodsProduced: Good[];
    chooseCraftsman= (gs: GameState, player: Player) => {
        this.chooseThisRole(gs, player);
        this.firstPlayerGoodsProduced = [];
        for(let i = 0; i < gs.players.length; i++) {
            const p = gs.players[(i + gs.currentPlayerIdx) % gs.players.length];
            const plants = p.board.plantations
                .filter((pl) => pl.staffed && goodOptions.has(pl.type))
                .map((pl) => pl.type)
                .reduce(
                    (acc, pl: Good) => {
                        acc[pl] ||= 0;
                        acc[pl]++;
                        return acc;
                    },
                    {} as Record<Good, number>
                );
            const capacity = p.board.buildings
                .filter((b) => b.production)
                .reduce(
                    (acc, b) => {
                        acc[b.productionType] ||= 0;
                        acc[b.productionType] += b.staff;
                        return acc;
                    },
                    {corn: 99} as Record<Good, number>
                );
            Object.keys(plants).forEach((pl: Good) => {
                const production = Math.min(
                    plants[pl],
                    capacity[pl],
                    gs.goods[pl]
                );
                p.goods[pl] += production;
                gs.goods[pl] -= production;
                if (i == 0 && production > 0) {
                    this.firstPlayerGoodsProduced.push(pl);
                }
            });
        }


        if (this.firstPlayerGoodsProduced.every((g) => gs.goods[g] == 0)) {
            gs.endRole();
        }

        return;
    };

    get chooseAction(): Action {
        return new Action(
            `choose${this.name}`,
            this.chooseCraftsman,
        );
    }
    availableActions(gs?: GameState, player?: Player): Action[] {
        const actions: Action[] = [];

        if (gs.currentTurnPlayer() != player) {
            return actions;
        }

        this.firstPlayerGoodsProduced
            .filter((g) => gs.goods[g] > 0)
            .forEach((g) => {
                actions.push(
                    new Action(
                        `choose${g[0].toUpperCase()}${g.slice(1)}`,
                        (gs: GameState, player: Player): void => {
                            player.goods[g]++;
                            gs.goods[g]--;
                            gs.endRole();
                            return;
                        },
                    )
                );
            }
        );

        return actions;
    }
}