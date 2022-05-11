import { Player } from "../state/Player";
import { Building } from "../state/Building";

export class Fortress extends Building {
    name = "Fortress";
    production = false;
    description = "+1 VP for each 3 of your colonists";
    staffSpots = 1;
    size = 2;
    staff = 0;
    points = 4;
    cost = 10;
    phase = "gameEnd";

    gameEnd(player: Player): number {
        return Math.floor(player.board.totalColonists() / 3);
    }
}