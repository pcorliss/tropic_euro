import { GameState } from "../state/GameState";
import { Player } from "../state/Player";
import { Building } from "../state/Building";

export class Harbor extends Building {
    name = "Harbor";
    production = false;
    description = "+VP with shipping";
    staffSpots = 1;
    size = 1;
    staff = 0;
    points = 3;
    cost = 8;
    phase = "shippingAction";

    shippingAction(gs: GameState, player: Player): void {
        gs.takeVPs(1, player);
        return;
    }
}