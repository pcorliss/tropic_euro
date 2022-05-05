import { Role } from "../state/Role";
import { Action } from "../state/Action";
import { GameState } from "../state/GameState";
import { Player } from "../state/Player";
import { Building } from "../state/Building";
export class Builder extends Role {
    name = "Builder";
    description = "";
    phase = "building";
    skipPlayersWithNoActions = true;

    buildingCost(building: Building, player: Player, gs: GameState): number {
        const quarryCount = player.board.plantations
            .filter((p) =>
                p.staffed &&
                p.type == "quarry"
            )
            .length;
        const maxQuarryUsage = Math.min(quarryCount, building.points);
        const bonus = gs.currentPlayer() == player ? 1 : 0;
        return Math.max(0, building.cost - bonus - maxQuarryUsage);
    }

    // TODO memoize the lookups by moving this to the player object
    canBuy(building: Building, player: Player, gs: GameState): boolean {
        const availableSpace = player.board.buildings.reduce((sum, b) => sum -= b.size, 12);
        const cost = this.buildingCost(building, player, gs);
        return player.doubloons >= cost && building.size <= availableSpace;
    }

    availableActions(gs?: GameState, player?: Player): Action[] {
        const actions: Action[] = [];

        if (gs.currentTurnPlayer() != player) {
            return actions;
        }

        const seenBuildings = new Set<string>(player.board.buildings.map((b) => b.name));
        gs.buildings.forEach((b) => {
            if (!seenBuildings.has(b.name) && this.canBuy(b, player, gs)) {
                actions.push(
                    new Action(
                        `buy${b.name.replace(/\s+/g, "")}`,
                        (gs: GameState, player: Player): void => {
                            // Relies on poor equality checking in JS for
                            // identical buildings with different objects
                            gs.buildings = gs.buildings.filter((gsB) => b != gsB);
                            player.board.buildings.push(b);
                            player.doubloons -= this.buildingCost(b, player, gs);

                            player.board.buildings
                                .filter((pb) => pb.phase == "building" && pb.staff > 0)
                                .forEach((pb) => pb.building(gs, player, b));

                            gs.advancePlayer();
                            return;
                        },
                    )
                );
            }
            seenBuildings.add(b.name);
        });

        if (actions.length > 0) {
            actions.push(
                new Action(
                    "skip",
                    (gs: GameState, player: Player): void => {
                        gs.advancePlayer();
                        return;
                    },
                )
            );
        }

        return actions;
    }
}