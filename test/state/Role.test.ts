import { GameState } from "../../src/state/GameState";
import { Role } from "../../src/state/Role";
import { Player } from "../../src/state/Player";

describe("Role", () => {
    let gs: GameState = null;
    let role: Role = null;
    let player: Player = null;

    beforeEach(() => {
        gs = new GameState(["Alice", "Bob", "Carol"]);
        role = new Role();
        gs.availableRoles.push(role);
        player = gs.players[0];
    });

    describe("chooseThisRole", () => {

        it("sets the gamestate's current role", () => {
            role.chooseThisRole(gs, player);
            expect(gs.currentRole).toBe(role);
        });

        it("removes the role from available", () => {
            const expectedLength = gs.availableRoles.length - 1;
            role.chooseThisRole(gs, player);
            expect(gs.availableRoles.length).toBe(expectedLength);
        });

        it("adds any doubloons to the player", () => {
            role.doubloons = 3;
            const expected = player.doubloons + 3;
            role.chooseThisRole(gs, player);
            expect(player.doubloons).toBe(expected);
            expect(role.doubloons).toBe(0);
        });
    });
});