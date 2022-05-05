import { ConstructionHut } from "../../src/buildings/ConstructionHut";
import { University } from "../../src/buildings/University";
import { GameState } from "../../src/state/GameState";


describe("University", () => {
    describe("building", () => {
        it("adds a colonist from supply to the building", () => {
            const gs = new GameState(["Alice", "Bob", "Carol"]);
            const player = gs.players[0];
            const u = new University;
            const newB = new ConstructionHut;

            const expected = gs.colonists - 1;
            u.building(gs, player, newB);
            expect(newB.staff).toBe(1);
            expect(gs.colonists).toBe(expected);
        });

        it("doesn't add a colonist to a building that doesn't accept them", () => {
            const gs = new GameState(["Alice", "Bob", "Carol"]);
            const player = gs.players[0];
            const u = new University;
            const newB = new ConstructionHut;
            newB.staffSpots = 0;

            const expected = gs.colonists;
            u.building(gs, player, newB);
            expect(newB.staff).toBe(0);
            expect(gs.colonists).toBe(expected);
        });
    });
});