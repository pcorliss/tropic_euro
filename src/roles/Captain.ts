import { Role } from "../state/Role";
import { Action } from "../state/Action";
import { GameState } from "../state/GameState";
import { Player } from "../state/Player";
export class Captain extends Role {
    name = "Captain";
    description = "";
    phase = "shipping";
}