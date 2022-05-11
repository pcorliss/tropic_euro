import { Player } from "../state/Player";
import { Building } from "../state/Building";

export class GuildHall extends Building {
    name = "GuildHall";
    production = false;
    description = "+1 or +2 VP for each small or large production building";
    staffSpots = 1;
    size = 2;
    staff = 0;
    points = 4;
    cost = 10;
    phase = "gameEnd";

    gameEnd(player: Player): number {
        return player.board.buildings
            .filter((b) => b.production)
            .map((b) => b.staffSpots > 1 ? 2 : 1)
            .reduce((sum, b) => sum += b, 0);
    }
}