import { GameState } from "../../src/state/GameState";
import { Player } from "../../src/state/Player";
import { Role } from "../../src/state/Role";
import { Board } from "../../src/state/Board";
import { Mayor} from "../../src/roles/Mayor";
import { LargeIndigoPlant } from "../../src/buildings/LargeIndigoPlant";
import { SmallIndigoPlant } from "../../src/buildings/SmallIndigoPlant";
import { Plantation } from "../../src/state/Plantation";

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

        it("auto distributes colonists", () => {
            player.board.buildings.push(new SmallIndigoPlant);
            role.chooseAction.apply(gs, player);
            expect(player.board.buildings[0].staff).toBe(1);
            expect(player.board.plantations[0].staffed).toBeTruthy();
        });

        // triggers game end if supply runs out
    });

    describe("availableActions", () => {
        it("returns a single action to rearrange the player board", () => {
            player.board.buildings.push(new LargeIndigoPlant);
            role.chooseAction.apply(gs, player);
            const actions = role.availableActions(gs, player);
            const actionKeys = actions.map((a) => a.key);
            expect(actionKeys).toContain("rearrangeBoard");
        });

        it("returns nothing if there are no placement option", () => {
            player.board.plantations[0].staffed = true;
            const actions = role.availableActions(gs, player);
            expect(actions).toHaveLength(0);
        });
        
        describe("returns an action that", () => {
            it("allows rearranging the player board via json blob", () => {
                player.board.buildings.push(new LargeIndigoPlant);
                player.board.sanJuanColonists = 2;

                const board = new Board();
                board.buildings.push(new LargeIndigoPlant);
                board.plantations.push(new Plantation("indigo"));
                board.buildings[0].staff = 1;
                board.plantations[0].staffed = true;

                const actions = role.availableActions(gs, player);
                const a = actions.find((a) => a.key == "rearrangeBoard");
                a.apply(gs, player, JSON.parse(JSON.stringify(board)));

                expect(player.board.buildings[0].staff).toBe(1);
                expect(player.board.plantations[0].staffed).toBeTruthy();
                expect(player.board.sanJuanColonists).toBe(0);
            });

            it("validates rearranging the player board via json blob", () => {
                player.board.buildings.push(new LargeIndigoPlant);
                player.board.sanJuanColonists = 2;

                const board = new Board();
                board.buildings.push(new LargeIndigoPlant);
                board.plantations.push(new Plantation("indigo"));
                board.buildings[0].staff = 1;
                board.plantations[0].staffed = true;

                const actions = role.availableActions(gs, player);
                const a = actions.find((a) => a.key == "rearrangeBoard");
                expect(a.valid(gs, player, JSON.parse(JSON.stringify(board)))).toBeTruthy();
            });

            it("validates total colonists", () => {
                player.board.buildings.push(new LargeIndigoPlant);
                player.board.sanJuanColonists = 2;

                const board = new Board();
                board.buildings.push(new LargeIndigoPlant);
                board.plantations.push(new Plantation("indigo"));
                board.buildings[0].staff = 3;
                board.plantations[0].staffed = true;

                const actions = role.availableActions(gs, player);
                const a = actions.find((a) => a.key == "rearrangeBoard");
                expect(a.valid(gs, player, JSON.parse(JSON.stringify(board)))).toBeFalsy();
            });

            it("validates buildings are the same", () => {
                player.board.sanJuanColonists = 1;
                player.board.buildings.push(new SmallIndigoPlant);

                const board = new Board();
                board.buildings.push(new LargeIndigoPlant);
                board.buildings[0].staff = 1;
                board.plantations = player.board.plantations;

                const actions = role.availableActions(gs, player);
                const a = actions.find((a) => a.key == "rearrangeBoard");
                expect(a.valid(gs, player, JSON.parse(JSON.stringify(board)))).toBeFalsy();
            });

            it("validates plantations are the same", () => {
                player.board.sanJuanColonists = 1;
                player.board.buildings.push(new SmallIndigoPlant);

                const board = new Board();
                board.buildings.push(new SmallIndigoPlant);
                board.plantations.push(new Plantation("corn"));
                board.plantations[0].staffed = true;

                const actions = role.availableActions(gs, player);
                const a = actions.find((a) => a.key == "rearrangeBoard");
                expect(a.valid(gs, player, JSON.parse(JSON.stringify(board)))).toBeFalsy();
            });

            it("validates that san juan remains empty if there are empty spaces", () => {
                player.board.sanJuanColonists = 1;
                player.board.buildings.push(new SmallIndigoPlant);

                const board = new Board();
                board.sanJuanColonists = 1;
                board.buildings.push(new SmallIndigoPlant);
                board.plantations.push(new Plantation("indigo"));

                const actions = role.availableActions(gs, player);
                const a = actions.find((a) => a.key == "rearrangeBoard");
                expect(a.valid(gs, player, JSON.parse(JSON.stringify(board)))).toBeFalsy();
            });

            // skips the player if only one placement option
         });
    });


});