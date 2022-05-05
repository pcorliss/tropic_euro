import { GameState } from "../../src/state/GameState";
import { Builder } from "../../src/roles/Builder";
import { Role } from "../../src/state/Role";
import { Player} from "../../src/state/Player";
import { Plantation } from "../../src/state/Plantation";
import { ConstructionHut } from "../../src/buildings/ConstructionHut";
import { SmallIndigoPlant } from "../../src/buildings/SmallIndigoPlant";
import { SmallMarket } from "../../src/buildings/SmallMarket";
import { Fortress } from "../../src/buildings/Fortress";
import { Wharf } from "../../src/buildings/Wharf";
import { University } from "../../src/buildings/University";

describe("Builder", () => {
    let gs: GameState = null;
    let role: Role = null;
    let player: Player = null;

    beforeEach(() => {
        gs = new GameState(["Alice", "Bob", "Carol"]);
        role = gs.availableRoles.find((r) => r instanceof Builder);
        gs.currentRole = role;
        player = gs.players[0];
    });

    describe("availableActions", () => {
        it("returns nothing if the player is not the current turn player", () => {
            const actions = role.availableActions(gs, gs.players[1]);
            expect(actions).toHaveLength(0);
        });

        it("returns nothing if the player can't afford them", () => {
            gs.currentTurnPlayerIdx = 1;
            gs.players[1].doubloons = 0;
            const actions = role.availableActions(gs, gs.players[1]);
            expect(actions).toHaveLength(0);
        });

        it("returns buildings the player can afford", () => {
            player.doubloons = 1;
            const actions = role.availableActions(gs, player);
            const actionKeys = actions.map((a) => a.key);
            expect(actionKeys).toContain("buySmallMarket");
            expect(actionKeys).toContain("buySmallIndigoPlant");
        });

        it("returns buildings the player can only afford via quarries", () => {
            gs.currentTurnPlayerIdx = 1;
            player = gs.players[1];
            player.doubloons = 0;
            player.board.plantations.push(new Plantation("quarry"));
            player.board.plantations[1].staffed = true;
            const actions = role.availableActions(gs, player);
            const actionKeys = actions.map((a) => a.key);
            expect(actionKeys).toContain("buySmallMarket");
            expect(actionKeys).toContain("buySmallIndigoPlant");
        });

        it("ignores unstaffed quarries", () => {
            gs.currentTurnPlayerIdx = 1;
            player = gs.players[1];
            player.doubloons = 0;
            player.board.plantations.push(new Plantation("quarry"));
            player.board.plantations[1].staffed = false;
            const actions = role.availableActions(gs, player);
            const actionKeys = actions.map((a) => a.key);
            expect(actionKeys).not.toContain("buySmallMarket");
            expect(actionKeys).not.toContain("buySmallIndigoPlant");
        });

        it("respects the max quarry discount", () => {
            gs.currentTurnPlayerIdx = 1;
            player = gs.players[1];
            player.doubloons = 0;
            player.board.plantations.push(new Plantation("quarry"));
            player.board.plantations.push(new Plantation("quarry"));
            player.board.plantations[1].staffed = true;
            player.board.plantations[2].staffed = true;
            const actions = role.availableActions(gs, player);
            const actionKeys = actions.map((a) => a.key);
            expect(actionKeys).not.toContain("buyConstructionHut");
        });

        it("doesn't return buildings the player already has", () => {
            player.doubloons = 10;
            player.board.buildings.push(new ConstructionHut);
            const actions = role.availableActions(gs, player);
            const actionKeys = actions.map((a) => a.key);
            expect(actionKeys).not.toContain("buyConstructionHut");
        });

        it("doesn't return buildings that are sold out", () => {
            player.doubloons = 10;
            gs.buildings = gs.buildings.filter((b) => b.name != "Construction Hut");
            const actions = role.availableActions(gs, player);
            const actionKeys = actions.map((a) => a.key);
            expect(actionKeys).not.toContain("buyConstructionHut");
        });

        it("only returns buildings if there's enough space", () => {
            player.doubloons = 10;
            // 12 spots on a board
            for(let i=0; i < 11; i++) {
                player.board.buildings.push(new SmallIndigoPlant);
            }
            const actions = role.availableActions(gs, player);
            const actionKeys = actions.map((a) => a.key);
            expect(actionKeys).toContain("buySmallMarket");
            expect(actionKeys).not.toContain("buyFortress");
        });

        it("respects the builder bonus", () => {
            player.doubloons = 0;
            const actions = role.availableActions(gs, player);
            const actionKeys = actions.map((a) => a.key);
            expect(actionKeys).toContain("buySmallMarket");
            expect(actionKeys).toContain("buySmallIndigoPlant");
        });

        describe("returns an action that", () => {
            it("calls the building function on the university", () => {
                player.board.buildings.push(new University);
                player.board.buildings[0].staff = 1;

                const actions = role.availableActions(gs, player);
                const a = actions.find((a) => a.key == "buySmallMarket");
                a.apply(gs, player);

                expect(player.board.buildings[1].staff).toBe(1);
            });

            it("skips building functions on an unstaffed university", () => {
                player.board.buildings.push(new University);

                const actions = role.availableActions(gs, player);
                const a = actions.find((a) => a.key == "buySmallMarket");
                a.apply(gs, player);

                expect(player.board.buildings[1].staff).toBe(0);
            });

            it("removes the building from the building list", () => {
                gs.buildings = [new SmallMarket, new SmallMarket];
                const actions = role.availableActions(gs, player);
                const a = actions.find((a) => a.key == "buySmallMarket");
                a.apply(gs, player);
                expect(gs.buildings).toHaveLength(1); 
             });

            it("adds the building to the player's board", () => {
                gs.buildings = [new SmallMarket];
                const actions = role.availableActions(gs, player);
                const a = actions.find((a) => a.key == "buySmallMarket");
                a.apply(gs, player);
                expect(player.board.buildings).toHaveLength(1); 
            });

            it("deducts money from the player", () => {
                player.doubloons = 9;
                gs.buildings = [new Fortress];
                const actions = role.availableActions(gs, player);
                
                const a = actions.find((a) => a.key == "buyFortress");
                a.apply(gs, player);
                expect(player.doubloons).toBe(0);
            });

            it("gives a discount from quarries and respects max discount and building bonus", () => {
                // cost of 9 - 1 (bonus) - 3 quarries == 5
                player.doubloons = 5;
                gs.buildings = [new Wharf];
                for(let i=0; i<4; i++) {
                    player.board.plantations.push(new Plantation("quarry"));
                    player.board.plantations.at(-1).staffed = true;
                }
                const actions = role.availableActions(gs, player);
                const a = actions.find((a) => a.key == "buyWharf");
                a.apply(gs, player);
                expect(player.doubloons).toBe(0);
            });

            it("advances current turn player", () => {
                const actions = role.availableActions(gs, player);
                const a = actions[0];
                a.apply(gs, player);
                expect(gs.currentTurnPlayerIdx).toBe(1);
            });

            it("allows the player to not take a building", () => {
                const actions = role.availableActions(gs, player);
                const a = actions.find((a) => a.key == "skip");
                const expected = player.board.buildings.length;
                a.apply(gs, player);
                expect(player.board.buildings.length).toBe(expected);
            });

            it("ends the role if all players have gone", () => {
                gs.currentTurnPlayerIdx = 2;
                gs.currentPlayerIdx = 0;
                const actions = role.availableActions(gs, gs.players[2]);
                const a = actions[0];
                a.apply(gs, gs.players[2]);
                expect(gs.currentPlayerIdx).toBe(1);
                expect(gs.currentRole).toBeNull();
            });

            it("skips players if they have no actions", () => {
                gs.players[0].doubloons = 1;
                gs.players[1].doubloons = 0;
                gs.players[2].doubloons = 1;

                const actions = role.availableActions(gs, player);
                const a = actions[0];
                a.apply(gs, player);

                expect(gs.currentTurnPlayerIdx).toBe(2);
            });
        });
    });
});