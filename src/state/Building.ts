import { GameState } from "./GameState";
import { Good } from "./Good";
import { Plantation } from "./Plantation";
import { Player } from "./Player";
import { Action } from "./Action";
import { Role } from "./Role";
import { Ship } from "./Ship";
import { Board } from "./Board";

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
    ship: Ship = null;

    building(gs: GameState, p: Player, b: Building): void { return; }
    tradingBonus(p: Player): void { return; }
    trading(p: Player): Good[] { return[]; }
    plantationOptions(): string[] { return []; }
    plantationPlacement(gs:GameState, pl: Plantation): void { return; }
    freePlantation(gs: GameState, player: Player): Action { return; }
    shippingOptions(player: Player, role: Role): Action[] { return; }
    shippingAction(gs: GameState, player: Player): void { return; }
    spoilOptions(player: Player): Action[] { return; }
    endRole(gs?: GameState, player?: Player): void { return; }
    spoiling(player: Player): Action[] { return; }
    gameEnd(player: Player): number { return 0; }
    produce(player: Player, goods: Good[]): void { return; }
}