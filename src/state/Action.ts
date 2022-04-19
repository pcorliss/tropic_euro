import { GameState } from "./GameState";
import { Player } from "./Player";

export class Action {
    key: string;
    apply: (gs: GameState, player: Player) => void;

    constructor(key: string, apply: (gs: GameState, player: Player) => void) {
        this.key = key;
        this.apply = apply;
    }
}