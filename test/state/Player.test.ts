import { CityHall } from "../../src/buildings/CityHall";
import { CustomsHouse } from "../../src/buildings/CustomsHouse";
import { Fortress } from "../../src/buildings/Fortress";
import { GuildHall } from "../../src/buildings/GuildHall";
import { LargeIndigoPlant } from "../../src/buildings/LargeIndigoPlant";
import { Residence } from "../../src/buildings/Residence";
import { SmallIndigoPlant } from "../../src/buildings/SmallIndigoPlant";
import { Wharf } from "../../src/buildings/Wharf";
import { Plantation } from "../../src/state/Plantation";
import { Player } from "../../src/state/Player";

describe("Player", () => {
    let p: Player = null;

    beforeEach(() => {
        p = new Player("Alice");
    });

    describe("constructor", () => {
        it("inits name", () => {
            expect(p.name).toBe("Alice");
        });

        it("inits a board", () => {
            expect(p.board.sanJuanColonists).toBe(0);
        });

        it("inits a vps", () => {
            expect(p.victoryPoints).toBe(0);
        });

        it("inits a doubloons", () => {
            expect(p.doubloons).toBe(0);
        });

        it("inits goods", () => {
            expect(p.goods.corn).toBe(0);
            expect(p.goods.indigo).toBe(0);
            expect(p.goods.sugar).toBe(0);
            expect(p.goods.tobacco).toBe(0);
            expect(p.goods.coffee).toBe(0);
        });
    });

    describe("score", () => {
        it("returns 0", () => {
            expect(p.score()).toBe(0);
        });

        it("counts unstaffed buildings", () => {
            p.board.buildings.push(new Fortress);
            p.board.buildings.push(new Wharf);
            p.board.buildings.push(new LargeIndigoPlant);
            p.board.buildings.push(new SmallIndigoPlant);
            expect(p.score()).toBe(10);
        });

        it("counts vps", () => {
            p.victoryPoints = 99;
            expect(p.score()).toBe(99);
        });

        it("counts a staffed Fortress", () => {
            p.board.buildings.push(new Fortress);
            p.board.plantations.push(new Plantation("corn"));
            p.board.plantations[0].staffed = true;
            p.board.buildings[0].staff = 1;
            p.board.sanJuanColonists = 4;
            expect(p.score()).toBe(6);
        });

        it("counts a staffed CityHall", () => {
            p.board.buildings.push(new CityHall); // 4
            p.board.buildings.push(new Wharf); // 3
            p.board.buildings.push(new LargeIndigoPlant); // 2
            p.board.buildings[0].staff = 1;
            expect(p.score()).toBe(11); // 9 + 2
        });

        it("counts a staffed Customs House", () => {
            p.board.buildings.push(new CustomsHouse); // 4
            p.board.buildings[0].staff = 1;
            p.victoryPoints = 8;
            expect(p.score()).toBe(14); // 4 + 8 + 2
        });

        it("counts a staffed Guild Hall", () => {
            p.board.buildings.push(new GuildHall); // 4
            p.board.buildings[0].staff = 1;
            p.board.buildings.push(new LargeIndigoPlant); // 2
            p.board.buildings.push(new SmallIndigoPlant); // 1
            expect(p.score()).toBe(10); // 7 + 3
        });

        const residenceThresholds = [
            4, 4, 4, 4, 4, 4, 4, 4, 4, 4, // 1- 9
            5, // 10
            6, // 11
            7  // 12
        ];
        for(let plants = 0; plants < residenceThresholds.length; plants++) {
            const points = residenceThresholds[plants];
            it(`counts a staffed Residence ${plants} plants ${points} points`, () => {
                p.board.buildings.push(new Residence); // 4
                p.board.buildings[0].staff = 1;
                for(let i = 0; i < plants; i++) {
                    p.board.plantations.push(new Plantation("corn"));
                }
                expect(p.score()).toBe(points + 4);
            });
        }

    });
});