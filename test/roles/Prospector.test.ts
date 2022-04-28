import { GameState } from "../../src/state/GameState";
import { Prospector} from "../../src/roles/Prospector";
import { Role } from "../../src/state/Role";
import { Player} from "../../src/state/Player";

describe("Prospector", () => {
    let gs: GameState = null;
    let role: Role = null;
    let player: Player = null;

    beforeEach(() => {
        gs = new GameState(["Alice", "Bob", "Carol", "David"]);
        role = gs.availableRoles.find((r) => r instanceof Prospector);
        player = gs.players[0];
    });

    describe("chooseThisRole", () => {
        it("removes the role from available", () => {
            const expectedLength = gs.availableRoles.length - 1;
            role.chooseAction.apply(gs, player);
            expect(gs.availableRoles.length).toBe(expectedLength);
        });

        it("adds one doubloon to the player's total", () => {
            const expected = player.doubloons + 1;
            role.chooseAction.apply(gs, player);
            expect(player.doubloons).toBe(expected);
        });

        it("ends the role", () => {
            const expected = gs.currentPlayerIdx + 1;
            role.chooseAction.apply(gs, player);
            expect(gs.currentRole).toBeNull();
            expect(gs.currentPlayerIdx).toBe(expected);
        });
    });
});