import { GameState } from "../state/GameState";
import { Ship } from "../state/Ship";
import { Action } from "../state/Action";
import { Building } from "../state/Building";
import { Player } from "../state/Player";
import { Good } from "../state/Good";
import { Captain } from "../roles/Captain";

export class Wharf extends Building {
    name = "Wharf";
    production = false;
    description = "your own ship";
    staffSpots = 1;
    size = 1;
    staff = 0;
    points = 3;
    cost = 9;
    phase = "shippingOptions";
    ship = new Ship(99);

    endRole(gs?: GameState, player?: Player): void {
        const s = this.ship;
        gs.goods[s.goodType] += s.goods;
        s.goods = 0;
        s.goodType = null;
        return;
    }

    shippingOptions(player: Player, role: Captain): Action[] {
        const actions: Action[] = [];
        Object.entries(player.goods)
            .filter(([g,n]) => n > 0 && this.ship.goodType == null)
            .forEach(([g,n]) => {
                actions.push(
                    new Action(
                        `ship${g[0].toUpperCase()}${g.slice(1)}Wharf`,
                        role.shippingActionApply(g as Good, this.ship)
                    )
                );
            });
        return actions;
    }
}