import { Role } from "../state/Role";
import { Action } from "../state/Action";
import { GameState } from "../state/GameState";
import { Player } from "../state/Player";
export class Craftsman extends Role {
    name = "Craftsman";
    description = "";
    phase = "production";
}