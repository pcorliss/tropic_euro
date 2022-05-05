import { GameState } from "./GameState";
import { Good } from "./Good";
import { Player } from "./Player";

export class Building {
    name: string;
    production: boolean;
    productionType: Good;
    description: string;
    staffSpots: number;
    size: number;
    staff: number;
    points: number;
    cost: number;
    phase: string;

    building(gs: GameState, p: Player, b: Building): void { return; }
    tradingBonus(p: Player): void { return; }
    trading(p: Player): Good[] { return; }
}