import { Board } from "../../src/state/Board";

describe("Board", () => {
    const b = new Board();

    describe("constructor", () => {
        it("inits empty plantations", () => {
            expect(b.plantations).toHaveLength(0);
        });

        it("inits empty buildings", () => {
            expect(b.buildings).toHaveLength(0);
        });

        it("inits san juan pop", () => {
            expect(b.sanJuanColonists).toBe(0);
        });
    });
});