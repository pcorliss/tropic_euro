import { Role } from "../../src/state/Role";

describe("Role", () => {
    describe("constructor", () => {
        it("inits name", () => {
            const r = new Role("settler");
            expect(r.name).toBe("settler");
        });
    });
});