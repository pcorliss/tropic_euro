import { Plantation } from "../../src/state/Plantation";

describe("Plantation", () => {
    describe("constructor", () => {
        it("inits type", () => {
            const p = new Plantation("indigo");
            expect(p.type).toBe("indigo");
        });

        it("staffed is false", () => {
            const p = new Plantation("indigo");
            expect(p.staffed).toBeFalsy();
        });
    });
});