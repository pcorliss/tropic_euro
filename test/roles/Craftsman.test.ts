import { GameState } from "../../src/state/GameState";
import { Craftsman } from "../../src/roles/Craftsman";
import { Role } from "../../src/state/Role";
import { Player} from "../../src/state/Player";
import { Plantation } from "../../src/state/Plantation";
import { SmallIndigoPlant } from "../../src/buildings/SmallIndigoPlant";
import { SmallSugarMill } from "../../src/buildings/SmallSugarMill";
import { LargeSugarMill } from "../../src/buildings/LargeSugarMill";
import { LargeIndigoPlant } from "../../src/buildings/LargeIndigoPlant";
import { TobaccoStorage } from "../../src/buildings/TobaccoStorage";
import { CoffeeRoaster } from "../../src/buildings/CoffeeRoaster";

describe("Craftsman", () => {
    let gs: GameState = null;
    let role: Role = null;
    let player: Player = null;

    beforeEach(() => {
        gs = new GameState(["Alice", "Bob", "Carol"]);
        role = gs.availableRoles.find((r) => r instanceof Craftsman);
        gs.currentRole = role;
        player = gs.players[0];
        gs.players.forEach((p) => {
            p.board.plantations = [];
        });
    });

    describe("chooseThisRole", () => {
        it("removes the role from available", () => {
            const expectedLength = gs.availableRoles.length - 1;
            role.chooseAction.apply(gs, player);
            expect(gs.availableRoles.length).toBe(expectedLength);
        });

        it("adds goods to all players given their production", () => {
            player.board.plantations.push(new Plantation("corn"));
            player.board.plantations.push(new Plantation("corn"));
            player.board.plantations.push(new Plantation("corn"));
            gs.players[1].board.plantations.push(new Plantation("corn"));
            gs.players[1].board.plantations.push(new Plantation("corn"));
            gs.players[2].board.plantations.push(new Plantation("corn"));

            gs.players.forEach((p) => {
                p.board.plantations.forEach((pl) => {
                    pl.staffed = true;
                });
            });

            role.chooseAction.apply(gs, player);

            expect(player.goods["corn"]).toBe(3);
            expect(gs.players[1].goods["corn"]).toBe(2);
            expect(gs.players[2].goods["corn"]).toBe(1);
        });

        it("stops giving out resources once the supply has been exhausted", () => {
            gs.goods["corn"] = 1;
            player.board.plantations.push(new Plantation("corn"));
            player.board.plantations.push(new Plantation("corn"));
            gs.players.forEach((p) => {
                p.board.plantations.forEach((pl) => {
                    pl.staffed = true;
                });
            });

            role.chooseAction.apply(gs, player);

            expect(player.goods["corn"]).toBe(1);
            expect(gs.goods["corn"]).toBe(0);
        });

        it("Handles small production buildings", () => {
            player.board.plantations.push(new Plantation("indigo"));
            player.board.plantations.push(new Plantation("indigo"));
            player.board.plantations.push(new Plantation("sugar"));
            player.board.plantations.push(new Plantation("sugar"));
            player.board.buildings.push(new SmallIndigoPlant());
            player.board.buildings.push(new SmallSugarMill());

            gs.players.forEach((p) => {
                p.board.plantations.forEach((pl) => {
                    pl.staffed = true;
                });
                p.board.buildings.forEach((pl) => {
                    pl.staff = 1;
                });
            });

            role.chooseAction.apply(gs, player);

            expect(player.goods["indigo"]).toBe(1);
            expect(player.goods["sugar"]).toBe(1);
        });

        it("Handles large production buildings", () => {
            player.board.plantations.push(new Plantation("indigo"));
            player.board.plantations.push(new Plantation("indigo"));
            player.board.plantations.push(new Plantation("sugar"));
            player.board.plantations.push(new Plantation("sugar"));
            player.board.plantations.push(new Plantation("tobacco"));
            player.board.plantations.push(new Plantation("tobacco"));
            player.board.buildings.push(new LargeIndigoPlant());
            player.board.buildings.push(new LargeSugarMill());
            player.board.buildings.push(new TobaccoStorage());

            gs.players.forEach((p) => {
                p.board.plantations.forEach((pl) => {
                    pl.staffed = true;
                });
                p.board.buildings.forEach((pl) => {
                    pl.staff = 3;
                });
            });

            role.chooseAction.apply(gs, player);

            expect(player.goods["indigo"]).toBe(2);
            expect(player.goods["sugar"]).toBe(2);
            expect(player.goods["tobacco"]).toBe(2);
        });

        it("Handles coffee roaster", () => {
            player.board.plantations.push(new Plantation("coffee"));
            player.board.buildings.push(new CoffeeRoaster());

            gs.players.forEach((p) => {
                p.board.plantations.forEach((pl) => {
                    pl.staffed = true;
                });
                p.board.buildings.forEach((pl) => {
                    pl.staff = 2;
                });
            });

            role.chooseAction.apply(gs, player);

            expect(player.goods["coffee"]).toBe(1);
        });

        it("targets the current player first then the others in order", () => {
            gs.goods.corn = 3;
            gs.players[0].board.plantations.push(new Plantation("corn"));
            gs.players[1].board.plantations.push(new Plantation("corn"));
            gs.players[1].board.plantations.push(new Plantation("corn"));
            gs.players[2].board.plantations.push(new Plantation("corn"));
            gs.currentPlayerIdx = 1;

            gs.players.forEach((p) => {
                p.board.plantations.forEach((pl) => {
                    pl.staffed = true;
                });
            });

            role.chooseAction.apply(gs, gs.players[1]);

            expect(gs.players[0].goods.corn).toBe(0);
            expect(gs.players[1].goods.corn).toBe(2);
            expect(gs.players[2].goods.corn).toBe(1);
        });
        // xit("desn't end the role", () => {
        //     const expected = gs.currentPlayerIdx + 1;
        //     role.chooseAction.apply(gs, player);
        //     expect(gs.currentRole).toBeNull;
        //     expect(gs.currentPlayerIdx).toBe(expected);
        // });
    });

    // describe("availableActions", () => {
    //     // xit("returns nothing if the first player is the current player");
            // returns nothing if the supply is empty
            // returns nothing if the player didn't produce anything
            // returns an action for each good produced

    //     describe("returns an action that", () => {
    //         xit("allows the first player to choose their bonus good", () => {
    //             const actions = role.availableActions(gs, player);
    //             const a = actions[0];
    //             a.apply(gs, player);
    //             expect(gs.currentTurnPlayerIdx).toBe(1);
    //         });

    //         xit("ends the role", () => {
    //             gs.currentTurnPlayerIdx = 2;
    //             gs.currentPlayerIdx = 0;
    //             const actions = role.availableActions(gs, gs.players[2]);
    //             const a = actions[0];
    //             a.apply(gs, gs.players[2]);
    //             expect(gs.currentPlayerIdx).toBe(1);
    //         });
    //     });
    // });
});