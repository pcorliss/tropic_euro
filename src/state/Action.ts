import { GameState } from "./GameState";
import { Player } from "./Player";

export class Action {
    key: string;
    apply: (gs?: GameState, player?: Player) => void = () => {return;};
    valid: (gs?: GameState, player?: Player) => boolean = () => true;

    constructor(
        key: string,
        apply?: (gs?: GameState, player?: Player) => void,
        valid?: (gs?: GameState, player?: Player) => boolean,
    ) {
        this.key = key;
        if (apply) { this.apply = apply; }
        if (valid) { this.valid = valid; }
    }
}