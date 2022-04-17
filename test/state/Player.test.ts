import { Player } from "../../src/state/Player";

describe("Player", () => {
    const p = new Player("Alice");

    describe("constructor", () => {
        it("inits name", () => {
            expect(p.name).toBe("Alice");
        });

        it("inits a board", () => {
            expect(p.board.sanJuanColonists).toBe(0);
        });
    });
});