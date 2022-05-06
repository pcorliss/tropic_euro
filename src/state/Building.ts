import { GameState } from "./GameState";
import { Good } from "./Good";
import { Plantation } from "./Plantation";
import { Player } from "./Player";
import { Action } from "./Action";

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
    trading(p: Player): Good[] { return[]; }
    plantationOptions(): string[] { return []; }
    plantationPlacement(gs:GameState, pl: Plantation): void { return; }
    freePlantation(gs: GameState, player: Player): Action { return; }
}