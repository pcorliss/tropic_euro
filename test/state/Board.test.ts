import { LargeIndigoPlant } from "../../src/buildings/LargeIndigoPlant";
import { SmallIndigoPlant } from "../../src/buildings/SmallIndigoPlant";
import { Board } from "../../src/state/Board";
import { Plantation } from "../../src/state/Plantation";

describe("Board", () => {
    let b: Board = null;

    beforeEach(() => {
        b = new Board();
    });

    describe("constructor", () => {
        it("inits empty plantations", () => {
            expect(b.plantations).toHaveLength(0);
        });

        it("inits empty buildings", () => {
            expect(b.buildings).toHaveLength(0);
        });

        it("inits san juan pop", () => {
            expect(b.sanJuanColonists).toBe(0);
        });
    });

    describe("totalColonists", () => {
        it("counts colonists in San Juan", () => {
            b.sanJuanColonists = 1;
            expect(b.totalColonists()).toBe(1);
        });

        it("counts colonists in plantations", () => {
            b.plantations.push(new Plantation("Indigo"));
            b.plantations.push(new Plantation("Indigo"));
            b.plantations.push(new Plantation("Indigo"));
            b.plantations[0].staffed = true;
            b.plantations[1].staffed = false;
            b.plantations[2].staffed = true;
            expect(b.totalColonists()).toBe(2);
        });

        it("counts colonists on buildings", () => {
            b.buildings.push(new LargeIndigoPlant);
            b.buildings.push(new SmallIndigoPlant);
            b.buildings[0].staff = 2;
            b.buildings[1].staff = 1;
            expect(b.totalColonists()).toBe(3);
        });
    });
});