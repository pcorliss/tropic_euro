import { GameState } from "../../src/state/GameState";

describe("GameState", () => {
    const names = ["Alice", "Bob", "Carol"];
    const gs = new GameState(names);

    describe("constructor", () => {
        it("inits players", () => {
            expect(gs.players.length).toBe(3);
        });

        it("inits buildings", () => {
            expect(gs.buildings[0].name).toBe("Small Indigo Plant");
            expect(gs.buildings.length).toBe(49);
        });

        it("gives out 2 indigo and 1 corn", () => {
            expect(gs.plantationSupply.length).toBe(43);
            expect(gs.visiblePlantations.length).toBe(4);
            expect(gs.players[0].board.plantations[0].type).toBe("indigo");
            expect(gs.players[1].board.plantations[0].type).toBe("indigo");
            expect(gs.players[2].board.plantations[0].type).toBe("corn");
        });

        it("inits quarries", () => {
            expect(gs.quarries).toBe(8);
        });

        it("inits colonists", () => {
            expect(gs.colonists).toBe(55);
        });

        it("inits colony ship", () => {
            expect(gs.colonyShip).toBe(3);
        });

        it("inits vps", () => {
            expect(gs.victoryPoints).toBe(75);
        });

        it("inits ships", () => {
            expect(gs.ships.length).toBe(3);
            expect(gs.ships[0].spots).toBe(4);
            expect(gs.ships[1].spots).toBe(5);
            expect(gs.ships[2].spots).toBe(6);
        });

        it("inits governor", () => {
            expect(gs.governorIdx).toBe(0);
        });

        it("inits roles", () => {
            expect(gs.roles.length).toBe(6);
            const roles = gs.roles.map(r => r.name);
            const expectedRoles = ["Settler", "Mayor", "Builder", "Craftsman", "Trader", "Captain"];
            expect(roles).toEqual(expect.arrayContaining(expectedRoles));
            expect(roles.length).toBe(expectedRoles.length);
        });

        it("inits available roles", () => {
            expect(gs.roles.length).toBe(gs.availableRoles.length);
            gs.availableRoles.pop();
            expect(gs.roles.length).not.toBe(gs.availableRoles.length);
        });

        it("inits round counter", () => {
            expect(gs.roundCounter).toBe(0);
        });

        describe("4 players", () => {
            const names = ["Alice", "Bob", "Carol", "Doug"];
            const gs = new GameState(names);

            it("gives out 2 indigo and 2 corn", () => {
                expect(gs.plantationSupply.length).toBe(41);
                expect(gs.visiblePlantations.length).toBe(5);
                expect(gs.players[0].board.plantations[0].type).toBe("indigo");
                expect(gs.players[1].board.plantations[0].type).toBe("indigo");
                expect(gs.players[2].board.plantations[0].type).toBe("corn");
                expect(gs.players[3].board.plantations[0].type).toBe("corn");
            });

            it("inits colonists", () => {
                expect(gs.colonists).toBe(75);
            });

            it("inits colony ship", () => {
                expect(gs.colonyShip).toBe(4);
            });

            it("inits vps", () => {
                expect(gs.victoryPoints).toBe(100);
            });

            it("inits ships", () => {
                expect(gs.ships.length).toBe(3);
                expect(gs.ships[0].spots).toBe(5);
                expect(gs.ships[1].spots).toBe(6);
                expect(gs.ships[2].spots).toBe(7);
            });

            it("inits roles", () => {
                expect(gs.roles.length).toBe(7);
                const roles = gs.roles.map(r => r.name);
                const expectedRoles = ["Settler", "Mayor", "Builder", "Craftsman", "Trader", "Captain", "Prospector"];
                expect(roles).toEqual(expect.arrayContaining(expectedRoles));
                expect(roles.length).toBe(expectedRoles.length);
            });
        });

        describe("5 players", () => {
            const names = ["Alice", "Bob", "Carol", "Doug", "Erica"];
            const gs = new GameState(names);

            it("gives out 3 indigo and 2 corn", () => {
                expect(gs.plantationSupply.length).toBe(39);
                expect(gs.visiblePlantations.length).toBe(6);
                expect(gs.players[0].board.plantations[0].type).toBe("indigo");
                expect(gs.players[1].board.plantations[0].type).toBe("indigo");
                expect(gs.players[2].board.plantations[0].type).toBe("indigo");
                expect(gs.players[3].board.plantations[0].type).toBe("corn");
                expect(gs.players[4].board.plantations[0].type).toBe("corn");
            });

            it("inits colonists", () => {
                expect(gs.colonists).toBe(95);
            });

            it("inits colony ship", () => {
                expect(gs.colonyShip).toBe(5);
            });

            it("inits vps", () => {
                expect(gs.victoryPoints).toBe(126);
            });

            it("inits ships", () => {
                expect(gs.ships.length).toBe(3);
                expect(gs.ships[0].spots).toBe(6);
                expect(gs.ships[1].spots).toBe(7);
                expect(gs.ships[2].spots).toBe(8);
            });

            it("inits roles", () => {
                expect(gs.roles.length).toBe(8);
                const roles = gs.roles.map(r => r.name);
                const expectedRoles = ["Settler", "Mayor", "Builder", "Craftsman", "Trader", "Captain", "Prospector", "Prospector"];
                expect(roles).toEqual(expect.arrayContaining(expectedRoles));
                expect(roles.length).toBe(expectedRoles.length);
            });
        });
    });
});