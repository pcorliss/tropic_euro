import { Role } from "../state/Role";
import { Action } from "../state/Action";
import { GameState } from "../state/GameState";
import { Player } from "../state/Player";
import { Plantation } from "../state/Plantation";
export class Settler extends Role {
    name = "Settler";
    description = "";
    phase = "settling";

    availableActions(gs?: GameState, player?: Player): Action[] {
        // Support Hacienda
        // Support Hospice
        // Support Construction Hut

        const actions: Action[] = [];

        if (gs.currentTurnPlayer() != player) {
            return actions;
        }

        if (player.board.plantations.length >= 12) {
            return actions;
        }

        const plantationTypes = new Set<string>(
            gs.visiblePlantations.map((p) => p.type)       
        );

        if (gs.currentPlayer() == player && gs.quarries > 0) {
            plantationTypes.add("quarry");
        }

        player.board.buildings
            .filter((pb) => pb.phase == "plantationOptions" && pb.staff > 0)
            .flatMap((pb) => pb.plantationOptions(gs))
            .forEach((pt) => plantationTypes.add(pt));

        actions.push(
            new Action(
                "skip",
                (gs: GameState, player: Player): void => {
                    gs.advancePlayer();
                    return;
                },
            )
        );

        player.board.buildings
            .filter((pb) => pb.phase == "freePlantation" && pb.staff > 0)
            .map((pb) => pb.freePlantation(gs, player))
            .filter((a) => a != undefined)
            .forEach((a) => actions.push(a));

        for (const p of plantationTypes) {
            actions.push(
                new Action(
                    "choose" + `${p[0].toUpperCase()}${p.slice(1)}`,
                    (gs: GameState, player: Player): void => {
                        const newPlantations: Plantation[] = [];
                        let m = false;
                        let assigned: Plantation = null;
                        gs.visiblePlantations.forEach((vp) => {
                            if (vp.type == p && !m) {
                                m = true;
                                assigned = vp;
                            } else {
                                newPlantations.push(vp);
                            }
                        });
                        gs.visiblePlantations = newPlantations;
                        if (assigned) {
                            player.board.plantations.push(assigned);
                        } else {
                            // for quarries
                            player.board.plantations.push(new Plantation(p));
                        }
                        if (p == "quarry") {
                            gs.quarries--;
                        }

                        player.board.buildings
                            .filter((pb) => pb.phase == "plantationPlacement" && pb.staff > 0)
                            .forEach((pb) => pb.plantationPlacement(gs, player.board.plantations.at(-1)));

                        gs.advancePlayer();
                        return;
                    }
                )
            );
        }

        return actions;
    }
}