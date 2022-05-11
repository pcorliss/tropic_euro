import { Player } from "../state/Player";
import { Building } from "../state/Building";

export class CityHall extends Building {
    name = "City Hall";
    production = false;
    description = "+1 VP for each of your beige buildings";
    staffSpots = 1;
    size = 2;
    staff = 0;
    points = 4;
    cost = 10;
    phase = "gameEnd";

    gameEnd(player: Player): number {
        return player.board.buildings.filter((b) => !b.production).length;
    }
}