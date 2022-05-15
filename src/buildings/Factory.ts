import { Good } from "../state/Good";
import { Player } from "../state/Player";
import { Building } from "../state/Building";

export class Factory extends Building {
    name = "Factory";
    production = false;
    description = "+0/1/2/3/5 doubloons with production";
    staffSpots = 1;
    size = 1;
    staff = 0;
    points = 3;
    cost = 7;
    phase = "produce";

    produce(player: Player, goods: Good[]): void {
        player.doubloons += Math.max(0, goods.length - 1);
        if (goods.length >= 5) {
            player.doubloons++;
        }
        return;
    }
}