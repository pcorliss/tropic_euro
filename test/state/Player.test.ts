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

        it("inits a vps", () => {
            expect(p.victoryPoints).toBe(0);
        });

        it("inits a doubloons", () => {
            expect(p.doubloons).toBe(0);
        });

        it("inits goods", () => {
            expect(p.goods.corn).toBe(0);
            expect(p.goods.indigo).toBe(0);
            expect(p.goods.sugar).toBe(0);
            expect(p.goods.tobacco).toBe(0);
            expect(p.goods.coffee).toBe(0);
        });
    });
});