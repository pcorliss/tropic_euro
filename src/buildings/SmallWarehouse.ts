import { Action } from "../state/Action";
import { Player } from "../state/Player";
import { Building } from "../state/Building";
import { Good } from "../state/Good";
import { GameState } from "../state/GameState";

export class SmallWarehouse extends Building {
    name = "Small Warehouse";
    production = false;
    description = "+1 good type may be stored";
    staffSpots = 1;
    size = 1;
    staff = 0;
    points = 1;
    cost = 3;
    phase = "spoilOptions";

    maxGoodRecords = 1;
    goods: [Good, number][] = [];

    spoilOptions(player: Player): Action[] {
        if (Object.keys(this.goods).length >= this.maxGoodRecords ) { return []; }
        return Object.entries(player.goods)
            .filter(([g, n]) => n > 0)
            .map(([g, n]) => {
                return new Action(
                    `store${g[0].toUpperCase()}${g.slice(1)}`,
                    (gs?: GameState, player?: Player): void => {
                        player.goods[g as Good] = 0;
                        this.goods.push([g as Good, n]);

                        const goodCount = Object.values(player.goods).reduce((sum, n) => sum += n);
                        if (goodCount == 0) {
                            gs.advancePlayer();
                        }
                    }
                );
            });
    }

    endRole(gs?: GameState, player?: Player): void {
        this.goods.forEach(([g, n]) => {
            player.goods[g] += n;
        });
        this.goods = [];
        return;
    }
}