import { GameState } from "../../src/state/GameState";
import { Settler} from "../../src/roles/Settler";
import { Role } from "../../src/state/Role";
import { Player} from "../../src/state/Player";
import { Plantation} from "../../src/state/Plantation";
import { ConstructionHut } from "../../src/buildings/ConstructionHut";
import { Hospice } from "../../src/buildings/Hospice";
import { Hacienda } from "../../src/buildings/Hacienda";

describe("Settler", () => {
    let gs: GameState = null;
    let role: Role = null;
    let player: Player = null;

    beforeEach(() => {
        gs = new GameState(["Alice", "Bob", "Carol"]);
        role = gs.availableRoles.find((r) => r instanceof Settler);
        gs.currentRole = role;
        player = gs.players[0];
    });

    describe("availableActions", () => {
        it("returns quarry action for first player", () => {
            const actions = role.availableActions(gs, player);
            const actionKeys = actions.map((a) => a.key);
            expect(actionKeys).toContain("chooseQuarry");
        });

        it("returns no quarries for the second player", () => {
            gs.currentTurnPlayerIdx = 1;
            const actions = role.availableActions(gs, gs.players[1]);
            const actionKeys = actions.map((a) => a.key);
            expect(actionKeys.length).toBeGreaterThan(0);
            expect(actionKeys).not.toContain("chooseQuarry");
        });

        it("returns quarry for a construction hut", () => {
            gs.currentTurnPlayerIdx = 1;
            gs.players[1].board.buildings.push(new ConstructionHut);
            gs.players[1].board.buildings[0].staff = 1;
            const actions = role.availableActions(gs, gs.players[1]);
            const actionKeys = actions.map((a) => a.key);
            expect(actionKeys).toContain("chooseQuarry");
        });

        it("returns no quarries for a construction hut if there's none left", () => {
            gs.quarries = 0;
            gs.currentTurnPlayerIdx = 1;
            gs.players[1].board.buildings.push(new ConstructionHut);
            gs.players[1].board.buildings[0].staff = 1;
            const actions = role.availableActions(gs, gs.players[1]);
            const actionKeys = actions.map((a) => a.key);
            expect(actionKeys).not.toContain("chooseQuarry");
        });

        it("returns one action for each good", () => {
            gs.visiblePlantations = [
                new Plantation("indigo"),
                new Plantation("coffee"),
            ];
            const actions = role.availableActions(gs, player);
            const actionKeys = actions.map((a) => a.key);
            expect(actionKeys).toContain("chooseIndigo");
            expect(actionKeys).toContain("chooseCoffee");
        });

        it("returns one unique action for each type of good", () => {
            gs.visiblePlantations = [
                new Plantation("indigo"),
                new Plantation("indigo"),
            ];
            const actions = role.availableActions(gs, player);
            const indigoActions = actions.filter((a) => a.key == "chooseIndigo");
            expect(indigoActions).toHaveLength(1);
        });

        it("returns nothing if the player is not the current turn player", () => {
            const actions = role.availableActions(gs, gs.players[1]);
            expect(actions).toHaveLength(0);
        });

        it("returns nothing if the player mat is full", () => {
            for(let i = 0; i < 11; i++) {
                player.board.plantations.push(new Plantation("indigo"));
            }
            const actions = role.availableActions(gs, player);
            expect(actions).toHaveLength(0);
        });

        it("doesn't make quarries available if there are none left", () => {
            gs.quarries = 0;
            const actions = role.availableActions(gs, player);
            const actionKeys = actions.map((a) => a.key);
            expect(actionKeys.length).toBeGreaterThan(0);
            expect(actionKeys).not.toContain("chooseQuarry");
        });

        describe("returns an action that", () => {
            it("hacienda allows choosing a random plantation as a first action", () => {
                player.board.buildings.push(new Hacienda);
                player.board.buildings[0].staff = 1;

                const expected = gs.plantationSupply.length - 1;
                const actions = role.availableActions(gs, player);
                const a = actions.find((a) => a.key == "chooseRandom");
                a.apply(gs, player);

                expect(player.board.plantations).toHaveLength(2);
                expect(gs.plantationSupply).toHaveLength(expected);
            });

            it("hacienda can only be used once", () => {
                player.board.buildings.push(new Hacienda);
                player.board.buildings[0].staff = 1;

                let actions = role.availableActions(gs, player);
                const a = actions.find((a) => a.key == "chooseRandom");
                a.apply(gs, player);

                expect(gs.currentTurnPlayerIdx).toBe(0);
                actions = role.availableActions(gs, player);
                const actionKeys = actions.map((a) => a.key);
                expect(actionKeys).not.toContain("chooseRandom");
            });

            it("hacienda can be used the next round", () => {
                player.board.buildings.push(new Hacienda);
                player.board.buildings[0].staff = 1;

                let actions = role.availableActions(gs, player);
                const a = actions.find((a) => a.key == "chooseRandom");
                a.apply(gs, player);

                gs.roundCounter++;

                actions = role.availableActions(gs, player);
                const actionKeys = actions.map((a) => a.key);
                expect(actionKeys).toContain("chooseRandom");
            });

            it("that transfers the plantation to the player's board", () => {
                const actions = role.availableActions(gs, player);
                const a = actions.find((a) => a.key == "chooseQuarry");
                a.apply(gs, player);
                expect(player.board.plantations).toHaveLength(2);
                expect(player.board.plantations[1].type).toBe("quarry");
            });

            it("the hospice adds a colonist from supply to the new plantation", () => {
                player.board.buildings.push(new Hospice);
                player.board.buildings[0].staff = 1;
                const expected = gs.colonists - 1;
                const actions = role.availableActions(gs, player);
                const a = actions.find((a) => a.key == "chooseQuarry");
                a.apply(gs, player);
                expect(player.board.plantations[1].staffed).toBeTruthy();
                expect(gs.colonists).toBe(expected);
            });

            it("that removes the quarry from the quarry list", () => {
                const actions = role.availableActions(gs, player);
                const a = actions.find((a) => a.key == "chooseQuarry");
                const expected = gs.quarries - 1;
                a.apply(gs, player);
                expect(gs.quarries).toBe(expected);
            });

            it("removes the plantation from the plantation list", () => {
                const indigo = new Plantation("indigo");
                gs.visiblePlantations = [
                    indigo,
                    new Plantation("coffee"),
                ];
                const actions = role.availableActions(gs, player);
                const a = actions.find((a) => a.key == "chooseCoffee");
                a.apply(gs, player);
                expect(gs.visiblePlantations).toHaveLength(1);
                expect(gs.visiblePlantations[0]).toBe(indigo);
            });

            it("advances current turn player", () => {
                const actions = role.availableActions(gs, player);
                const a = actions[0];
                a.apply(gs, player);
                expect(gs.currentTurnPlayerIdx).toBe(1);
            });

            it("allows the player to not take a plantation", () => {
                const actions = role.availableActions(gs, player);
                const a = actions.find((a) => a.key == "skip");
                const expected = player.board.plantations.length;
                a.apply(gs, player);
                expect(player.board.plantations.length).toBe(expected);
            });

            it("ends the role if all players have gone", () => {
                gs.currentTurnPlayerIdx = 2;
                gs.currentPlayerIdx = 0;
                const actions = role.availableActions(gs, gs.players[2]);
                const a = actions[0];
                a.apply(gs, gs.players[2]);
                expect(gs.currentPlayerIdx).toBe(1);
            });

            it("resets the plantations at the role end", () => {
                gs.currentTurnPlayerIdx = 2;
                gs.currentPlayerIdx = 0;
                gs.visiblePlantations = gs.visiblePlantations.slice(0,2);
                const actions = role.availableActions(gs, gs.players[2]);
                const a = actions[0];
                a.apply(gs, gs.players[2]);
                expect(gs.visiblePlantations).toHaveLength(4);
                expect(gs.discardedPlantations).toHaveLength(2);
            });
        });
    });
});