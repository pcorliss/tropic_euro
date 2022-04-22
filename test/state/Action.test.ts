import { Action } from "../../src/state/Action";

describe("Action", () => {
    const a = new Action("action");

    describe("constructor", () => {
        it("sets the key", () => {
            expect(a.key).toBe("action");
        });

        it("valid returns true", () => {
            expect(a.valid(null, null)).toBeTruthy();
        });
    });
});