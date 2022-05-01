import { GameState } from "../../src/state/GameState";
import { Player } from "../../src/state/Player";
import { Role } from "../../src/state/Role";
import { Board } from "../../src/state/Board";
import { Mayor} from "../../src/roles/Mayor";
import { LargeIndigoPlant } from "../../src/buildings/LargeIndigoPlant";
import { SmallIndigoPlant } from "../../src/buildings/SmallIndigoPlant";

describe("Mayor", () => {
    let gs: GameState = null;
    let role: Role = null;
    let player: Player = null;
    let board: Board = null;

    beforeEach(() => {
        gs = new GameState(["Alice", "Bob", "Carol"]);
        role = gs.availableRoles.find((r) => r instanceof Mayor);
        gs.currentRole = role;
        player = gs.players[0];
        board = player.board;
    });

    describe("chooseThisRole", () => {
        it("adds colonists to the player's board", () => {
            role.chooseAction.apply(gs, player);
            expect(gs.players[1].board.totalColonists()).toBe(1);
            expect(gs.players[2].board.totalColonists()).toBe(1);
        });

        it("receives a mayor bonus from supply", () => {
            const expected = gs.colonists - 4;
            role.chooseAction.apply(gs, player);
            expect(player.board.totalColonists()).toBe(2);
            expect(gs.colonists).toBe(expected);
        });

        it("handles non-evenly divided colonist numbers", () => {
            gs.colonyShip = 5;
            role.chooseAction.apply(gs, player);
            expect(gs.players[0].board.totalColonists()).toBe(3);
            expect(gs.players[1].board.totalColonists()).toBe(2);
            expect(gs.players[2].board.totalColonists()).toBe(1);
        });

        it("refills the ship based on number of players", () => {
            role.chooseAction.apply(gs, player);
            expect(gs.colonyShip).toBe(3);
        });

        it("refills the ship based on number of open spots", () => {
            player.board.buildings.push(new LargeIndigoPlant);
            player.board.buildings.push(new SmallIndigoPlant);
            role.chooseAction.apply(gs, player);
            expect(gs.colonyShip).toBe(4);
        });

        it("doesn't allow supply to go negative", () => {
            gs.colonists = 2;
            role.chooseAction.apply(gs, player);
            expect(gs.colonists).toBe(0);
            expect(gs.colonyShip).toBe(1);
        });

        it("doesn't take a mayor bonus if there's no supply", () => {
            gs.colonists = 0;
            role.chooseAction.apply(gs, player);
            expect(player.board.totalColonists()).toBe(1);
            expect(gs.colonists).toBe(0);
        });

        // triggers game end if supply runs out
    });

    describe("availableActions", () => {
        // it("returns a single action to rearrange the player board", () => {
        //     const actions = role.availableActions(gs, player);
        //     const actionKeys = actions.map((a) => a.key);
        //     expect(actionKeys).toContain("rearrangeBoard");
        // });
        
        // autofills the player board if there are no empty spots
        describe("returns an action that", () => {
            // allows rearranging the player board
            // does not allow san juan unless all circles are filled
         });
    });


});