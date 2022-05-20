import { LargeIndigoPlant } from "../../src/buildings/LargeIndigoPlant";
import { SmallIndigoPlant } from "../../src/buildings/SmallIndigoPlant";
import { Board } from "../../src/state/Board";
import { Plantation } from "../../src/state/Plantation";

import { plainToClass } from "class-transformer";


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

    describe("openBuildingSpaces", () => {
        it("returns 0 for no buildings", () => {
            expect(b.openBuildingSpaces()).toBe(0);
        });

        it("returns 0 for full buildings", () => {
            b.buildings.push(new LargeIndigoPlant);
            b.buildings.push(new SmallIndigoPlant);
            b.buildings[0].staff = 3;
            b.buildings[1].staff = 1;
            expect(b.openBuildingSpaces()).toBe(0);
        });

        it("returns open spaces", () => {
            b.buildings.push(new LargeIndigoPlant);
            b.buildings.push(new SmallIndigoPlant);
            b.buildings[0].staff = 1;
            b.buildings[1].staff = 0;
            expect(b.openBuildingSpaces()).toBe(3);
        });
    });

    describe("totalSpots", () => {
        it("counts spots in plantations", () => {
            b.plantations.push(new Plantation("Indigo"));
            b.plantations.push(new Plantation("Indigo"));
            b.plantations.push(new Plantation("Indigo"));
            expect(b.totalSpots()).toBe(3);
        });

        it("counts spots on buildings", () => {
            b.buildings.push(new LargeIndigoPlant);
            b.buildings.push(new SmallIndigoPlant);
            expect(b.totalSpots()).toBe(4);
        });
    });

    describe("autoDistributeColonists", () => {
        it("does nothing if there would be open spots", () => {
            b.sanJuanColonists = 2;
            b.buildings.push(new LargeIndigoPlant);
            b.autoDistributeColonists();
            expect(b.sanJuanColonists).toBe(2);
        });

        it("redistributes to all open spots", () => {
            b.sanJuanColonists = 4;
            b.plantations.push(new Plantation("indigo"));
            b.buildings.push(new LargeIndigoPlant);
            b.autoDistributeColonists();
            expect(b.sanJuanColonists).toBe(0);
            expect(b.plantations[0].staffed).toBeTruthy();
            expect(b.buildings[0].staff).toBe(3);
        });

        it("drops excess colonists in San Juan", () => {
            b.sanJuanColonists = 6;
            b.plantations.push(new Plantation("indigo"));
            b.buildings.push(new LargeIndigoPlant);
            b.autoDistributeColonists();
            expect(b.sanJuanColonists).toBe(2);
            expect(b.plantations[0].staffed).toBeTruthy();
            expect(b.buildings[0].staff).toBe(3);
        });
    });

    describe("reconstituting from a JSON object", () => {
        it("preserves static values", () => {
            b.sanJuanColonists = 99;
            b.plantations.push(new Plantation("indigo"));
            b.buildings.push(new LargeIndigoPlant);

            const reconst = plainToClass(Board, JSON.parse(JSON.stringify(b)));

            expect(reconst.sanJuanColonists).toBe(99);
            expect(reconst.buildings[0].name).toBe("Large Indigo Plant");
            expect(reconst.plantations[0].type).toBe("indigo");
        });

        it("allows function calls", () => {
            b.sanJuanColonists = 99;

            const reconst = plainToClass(Board, JSON.parse(JSON.stringify(b)));

            expect(reconst.totalColonists()).toBe(99);
        });
    });

    describe("sameBuildings", () => {
        it("returns true", () => {
            expect(b.sameBuildings(b)).toBeTruthy();
        });

        it("returns false if the building length has changed", () => {
            b.buildings.push(new SmallIndigoPlant);
            const newB = new Board();
            newB.buildings.push(new SmallIndigoPlant);
            newB.buildings.push(new SmallIndigoPlant);
            expect(b.sameBuildings(newB)).toBeFalsy();
        });
        
        it("returns false if the building changed", () => {
            b.buildings.push(new SmallIndigoPlant);
            const newB = new Board();
            newB.buildings.push(new LargeIndigoPlant);
            expect(b.sameBuildings(newB)).toBeFalsy();
        });

        it("can't do something fishy with building duping", () => {
            b.buildings.push(new SmallIndigoPlant);
            b.buildings.push(new LargeIndigoPlant);
            const newB = new Board();
            newB.buildings.push(new SmallIndigoPlant);
            newB.buildings.push(new SmallIndigoPlant);
            expect(b.sameBuildings(newB)).toBeFalsy();
        });
    });

    describe("samePlantations", () => {
        it("returns true", () => {
            expect(b.samePlantations(b)).toBeTruthy();
        });

        it("returns false if the plantation length has changed", () => {
            b.plantations.push(new Plantation("indigo"));
            const newB = new Board();
            newB.plantations.push(new Plantation("indigo"));
            newB.plantations.push(new Plantation("indigo"));
            expect(b.samePlantations(newB)).toBeFalsy();
        });
        
        it("returns false if the plantation changed", () => {
            b.plantations.push(new Plantation("indigo"));
            const newB = new Board();
            newB.plantations.push(new Plantation("sugar"));
            expect(b.samePlantations(newB)).toBeFalsy();
        });

        it("can't do something fishy with plantation duping", () => {
            b.plantations.push(new Plantation("indigo"));
            b.plantations.push(new Plantation("sugar"));
            const newB = new Board();
            newB.plantations.push(new Plantation("indigo"));
            newB.plantations.push(new Plantation("indigo"));
            expect(b.samePlantations(newB)).toBeFalsy();
        });
    });
});