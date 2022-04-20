import { GameState } from "../../src/state/GameState";
import { Role } from "../../src/state/Role";

describe("Role", () => {

    describe("chooseThisRole", () => {
        const role = new Role();
        const gs = new GameState(["Alice", "Bob", "Carol"]);

        it("sets the gamestate's current role", () => {
            gs.availableRoles.push(role);
            role.chooseThisRole(gs, gs.players[0]);
            expect(gs.currentRole).toBe(role);
        });

        it("removes the role from available", () => {
            gs.availableRoles.push(role);
            const expectedLength = gs.availableRoles.length - 1;
            role.chooseThisRole(gs, gs.players[0]);
            expect(gs.availableRoles.length).toBe(expectedLength);
        });
    });
});