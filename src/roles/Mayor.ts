import { Role } from "../state/Role";
import { Action } from "../state/Action";
import { GameState } from "../state/GameState";
import { Player } from "../state/Player";
export class Mayor extends Role {
    name = "Mayor";
    description = "";
    phase = "mayoring";
}