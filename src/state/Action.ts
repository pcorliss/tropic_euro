import { GameState } from "./GameState";
import { Player } from "./Player";

export class Action {
    key: string;
    apply: (gs?: GameState, player?: Player, blob?: unknown) => void = () => {return;};
    valid: (gs?: GameState, player?: Player, blob?: unknown) => boolean = () => true;

    constructor(
        key: string,
        apply?: (gs?: GameState, player?: Player, blob?: unknown) => void,
        valid?: (gs?: GameState, player?: Player, blob?: unknown) => boolean,
    ) {
        this.key = key;
        if (apply) { this.apply = apply; }
        if (valid) { this.valid = valid; }
    }
}