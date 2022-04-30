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

    describe("full", () => {
        it("returns true if full", () => {
            const s = new Ship(1);
            s.goods = 1;
            expect(s.full()).toBeTruthy();
        });

        it("returns false if empty", () => {
            const s = new Ship(1);
            expect(s.full()).toBeFalsy();
        });

        it("returns false if partially full", () => {
            const s = new Ship(2);
            s.goods = 1;
            expect(s.full()).toBeFalsy();
        });
    });

    describe("empty", () => {
        it("returns true if empty", () => {
            const s = new Ship(1);
            s.goods = 0;
            expect(s.empty()).toBeTruthy();
        });

        it("returns false if full", () => {
            const s = new Ship(1);
            s.goods = 1;
            expect(s.empty()).toBeFalsy();
        });

        it("returns false if partially empty", () => {
            const s = new Ship(2);
            s.goods = 1;
            expect(s.empty()).toBeFalsy();
        });
    });
});