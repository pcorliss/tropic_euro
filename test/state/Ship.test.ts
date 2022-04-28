import { Ship } from "../../src/state/Ship";

describe("Ship", () => {
    describe("constructor", () => {
        it("inits spots", () => {
            const s = new Ship(1);
            expect(s.spots).toBe(1);
        });

        it("goods is zero", () => {
            const s = new Ship(1);
            expect(s.goods).toBe(0);
        });

        it("goodType is nil", () => {
            const s = new Ship(1);
            expect(s.goodType).toBeNull();
        });
    });
});