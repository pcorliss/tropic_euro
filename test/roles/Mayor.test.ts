import { GameState } from "../../src/state/GameState";
import { Player } from "../../src/state/Player";
import { Role } from "../../src/state/Role";
import { Mayor} from "../../src/roles/Mayor";

describe("Mayor", () => {
    let gs: GameState = null;
    let role: Role = null;
    let player: Player = null;

    beforeEach(() => {
        gs = new GameState(["Alice", "Bob", "Carol"]);
        role = gs.availableRoles.find((r) => r instanceof Mayor);
        gs.currentRole = role;
        player = gs.players[0];
    });

    describe("chooseThisRole", () => {
        it("adds colonists to the player's board", () => {
            // player.board.sanJuanColonists
            // const expected = player.doubloons + 1;
            // role.chooseAction.apply(gs, player);
            // expect(player.doubloons).toBe(expected);
        });

        // receives a mayor bonus of an extra colonist from supply
        // refills the ship based on number of players
        // refills the ship given number of open spots
        // doesn't allow supply to go negative
        // doesn't take a mayor bonus if there's no supply
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