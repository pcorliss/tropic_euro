import { GameState } from "../../src/state/GameState";
import { Captain} from "../../src/roles/Captain";
import { Player} from "../../src/state/Player";
import { Good} from "../../src/state/Good";

describe("Captain", () => {
    let gs: GameState = null;
    let role: Captain = null;
    let player: Player = null;

    beforeEach(() => {
        gs = new GameState(["Alice", "Bob", "Carol"]);
        role = gs.availableRoles.find((r) => r instanceof Captain) as Captain;
        gs.currentRole = role;
        player = gs.players[0];
    });

    describe("availableActions", () => {
        it("returns nothing if the player is not the current turn player", () => {
            gs.players[1].goods["corn"] = 1;
            const actions = role.availableActions(gs, gs.players[1]);
            expect(actions).toHaveLength(0);
        });

        it("returns nothing if the player has no goods", () => {
            const actions = role.availableActions(gs, player);
            expect(actions).toHaveLength(0);
        });

        it("returns nothing if the ships are full", () => {
            gs.ships.forEach((s) => {
                s.goods = s.spots;
                s.goodType = "corn" as Good;
            });
            player.goods["corn"] = 1;
            const actions = role.availableActions(gs, player);
            expect(actions).toHaveLength(0);
        });

        it("returns options for each empty ship by each good type", () => {
            player.goods["corn"] = 1;
            player.goods["indigo"] = 1;
            const actions = role.availableActions(gs, player);
            expect(actions).toHaveLength(6);
            const actionKeys = actions.map((a) => a.key);
            expect(actionKeys).toContain("shipCornSml");
            expect(actionKeys).toContain("shipCornMed");
            expect(actionKeys).toContain("shipCornBig");
            expect(actionKeys).toContain("shipIndigoSml");
            expect(actionKeys).toContain("shipIndigoMed");
            expect(actionKeys).toContain("shipIndigoBig");
        });

        it("returns options for each ship matching a good type", () => {
            player.goods["corn"] = 1;
            player.goods["indigo"] = 1;
            player.goods["sugar"] = 1;
            gs.ships[0].goodType = "indigo";
            gs.ships[0].goods = 1;
            gs.ships[2].goodType = "corn";
            gs.ships[2].goods = 1;
            gs.ships[1].goodType = "coffee";
            gs.ships[1].goods = 1;
            const actions = role.availableActions(gs, player);
            const actionKeys = actions.map((a) => a.key);
            expect(actions).toHaveLength(2);
            expect(actionKeys).toContain("shipCornBig");
            expect(actionKeys).toContain("shipIndigoSml");
        });

        it("doesn't allow two ships with the same good type", () => {
            player.goods["corn"] = 1;
            gs.ships[2].goodType = "corn";
            gs.ships[2].goods = gs.ships[2].spots;
            const actions = role.availableActions(gs, player);
            expect(actions).toHaveLength(0);
        });

        describe("action apply",() => {
            it("advances the player", () => {
                player.goods["corn"] = 1;
                gs.players[1].goods["corn"] = 1;
                const actions = role.availableActions(gs, player);
                const a = actions.find((a) => a.key == "shipCornSml");
                a.apply(gs, player);
                expect(gs.currentTurnPlayerIdx).toBe(1);
            });

            it("skips a player if they have no actions", () => {
                player.goods["corn"] = 1;
                gs.players[2].goods["corn"] = 1;
                const actions = role.availableActions(gs, player);
                const a = actions.find((a) => a.key == "shipCornSml");
                a.apply(gs, player);
                expect(gs.currentTurnPlayerIdx).toBe(2);
            });

            it("removes the good from the player", () => {
                player.goods["corn"] = 2;
                const actions = role.availableActions(gs, player);
                const a = actions.find((a) => a.key == "shipCornBig");
                a.apply(gs, player);
                expect(player.goods["corn"]).toBe(0);
            });

            it("adds the good to the ship", () => {
                player.goods["corn"] = 2;
                const actions = role.availableActions(gs, player);
                const a = actions.find((a) => a.key == "shipCornBig");
                a.apply(gs, player);
                expect(gs.ships[2].goodType).toBe("corn");
                expect(gs.ships[2].goods).toBe(2);
            });

            it("adds the vps to the player", () => {
                gs.currentTurnPlayerIdx = 2;
                gs.players[2].goods["corn"] = 2;
                const expected = gs.victoryPoints - 2;
                const actions = role.availableActions(gs, gs.players[2]);
                const a = actions.find((a) => a.key == "shipCornBig");
                a.apply(gs, gs.players[2]);
                expect(gs.players[2].victoryPoints).toBe(2);
                expect(gs.victoryPoints).toBe(expected);
            });

            it("adds a bonus vp for the captaincy", () => {
                player.goods["corn"] = 2;
                const actions = role.availableActions(gs, player);
                const a = actions.find((a) => a.key == "shipCornBig");
                a.apply(gs, player);
                expect(player.victoryPoints).toBe(3);
            });

            it("adds only one bonus vp for the captaincy", () => {
                player.goods["corn"] = 2;
                player.goods["sugar"] = 2;
                let actions = role.availableActions(gs, player);
                let a = actions.find((a) => a.key == "shipCornBig");
                a.apply(gs, player);
                expect(player.victoryPoints).toBe(3);
                gs.currentTurnPlayerIdx = 0;
                actions = role.availableActions(gs, player);
                a = actions.find((a) => a.key == "shipSugarMed");
                a.apply(gs, player);
                expect(player.victoryPoints).toBe(5);
            });

            it("doesn't take more than avail vps", () => {
                gs.victoryPoints = 1;
                player.goods["corn"] = 2;
                const actions = role.availableActions(gs, player);
                const a = actions.find((a) => a.key == "shipCornBig");
                a.apply(gs, player);
                expect(player.victoryPoints).toBe(1);
                expect(gs.victoryPoints).toBe(0);
            });

            it("doesn't overfill the ship", () => {
                player.goods["corn"] = 2;
                gs.players[1].goods["sugar"] = 1; // prevents role from ending
                gs.ships[2].goods = 5;
                gs.ships[2].goodType = "corn";
                const actions = role.availableActions(gs, player);
                expect(actions).toHaveLength(1);
                const a = actions.find((a) => a.key == "shipCornBig");
                a.apply(gs, player);
                expect(gs.ships[2].spots).toBe(6);
                expect(gs.ships[2].goods).toBe(6);
                expect(player.goods["corn"]).toBe(1);
            });
        });

        // describe("spoil phase", () => {
        // });

        describe("role end",() => {
            it("end role happens when no more actions available for all players", () => {
                player.goods["corn"] = 1;
                player.goods["indigo"] = 1;
                let actions = role.availableActions(gs, player);
                let a = actions.find((a) => a.key == "shipCornBig");
                a.apply(gs, player);

                expect(gs.currentRole).toBe(role);
                expect(gs.currentTurnPlayer()).toBe(player);

                actions = role.availableActions(gs, player);
                a = actions.find((a) => a.key == "shipIndigoMed");
                a.apply(gs, player);

                expect(gs.currentRole).toBeNull();
            });

            it("end role resets the captain bonus flag", () => {
                player.goods["corn"] = 1;
                gs.players[2].goods["corn"] = 2;
                let actions = role.availableActions(gs, player);
                let a = actions.find((a) => a.key == "shipCornBig");
                a.apply(gs, player);
                expect(role.bonus).toBe(true);
                gs.currentTurnPlayerIdx = 2;
                actions = role.availableActions(gs, gs.players[2]);
                a = actions.find((a) => a.key == "shipCornBig");
                a.apply(gs, gs.players[2]);
                expect(gs.currentRole).toBeNull();
                expect(role.bonus).toBe(false);
            });

            it("clears the ships at the end of the round if they're full", () => {
                gs.goods["corn"] = 0;
                gs.currentTurnPlayerIdx = 2;
                gs.players[2].goods["corn"] = 2;
                gs.ships[2].goods = 5;
                gs.ships[2].goodType = "corn";
                const actions = role.availableActions(gs, gs.players[2]);
                const a = actions.find((a) => a.key == "shipCornBig");
                a.apply(gs, gs.players[2]);
                expect(gs.currentRole).toBeNull();
                expect(gs.ships[2].goodType).toBeNull();
                expect(gs.ships[2].goods).toBe(0);
                expect(gs.goods["corn"]).toBe(6);
            });

            it("doesn't empty ships that aren't full", () => {
                gs.goods["corn"] = 0;
                gs.currentTurnPlayerIdx = 2;
                gs.players[2].goods["corn"] = 2;
                gs.ships[2].goods = 3;
                gs.ships[2].goodType = "corn";
                const actions = role.availableActions(gs, gs.players[2]);
                const a = actions.find((a) => a.key == "shipCornBig");
                a.apply(gs, gs.players[2]);
                expect(gs.currentRole).toBeNull();
                expect(gs.ships[2].goodType).toBe("corn");
                expect(gs.ships[2].goods).toBe(5);
                expect(gs.goods["corn"]).toBe(0);
            });
        });
    });
});