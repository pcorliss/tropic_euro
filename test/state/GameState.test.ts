import { GameState } from "../../src/state/GameState";

describe("GameState", () => {
    const names = ["Alice", "Bob", "Carol"];
    const gs = new GameState(names);

    describe("constructor", () => {
        it("inits players", () => {
            expect(gs.players[0].name).toBe("Alice");
            expect(gs.players[1].name).toBe("Bob");
            expect(gs.players[2].name).toBe("Carol");
            expect(gs.players.length).toBe(3);
        });

        xit("inits buildings", () => {
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
        });
    });
});