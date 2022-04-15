import { GameState } from "../../src/state/GameState";

describe("GameState", () => {
    describe("constructor", () => {
        it("inits players", () => {
            const gs = new GameState(["Alice", "Bob", "Carol"]);
            expect(gs.players[0].name).toBe("Alice");
            expect(gs.players[1].name).toBe("Bob");
            expect(gs.players[2].name).toBe("Carol");
        });

        xit("inits buildings", () => {
            const gs = new GameState(["Alice", "Bob", "Carol"]);
            expect(gs.buildings[0].name).toBe("Small Indigo Plant");
        });
    });
});