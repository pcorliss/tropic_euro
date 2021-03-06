import { CityHall } from "../../src/buildings/CityHall";
import { CustomsHouse } from "../../src/buildings/CustomsHouse";
import { Fortress } from "../../src/buildings/Fortress";
import { GuildHall } from "../../src/buildings/GuildHall";
import { Residence } from "../../src/buildings/Residence";
import { SmallIndigoPlant } from "../../src/buildings/SmallIndigoPlant";
import { SmallMarket } from "../../src/buildings/SmallMarket";
import { GameState } from "../../src/state/GameState";
import { Role } from "../../src/state/Role";
import { Db } from "../../src/Db";

describe("GameState", () => {
    let gs: GameState = null;

    beforeEach(() => {
        const names = ["Alice", "Bob", "Carol"];
        gs = new GameState(names);
    });

    describe("constructor", () => {
        it("inits players", () => {
            expect(gs.players.length).toBe(3);
        });

        it("handles no arguments", () => {
            gs = new GameState();
            expect(gs.players.length).toBe(3);
        });

        it("inits doubloons", () => {
            expect(gs.players[0].doubloons).toBe(2);
        });

        it("inits buildings", () => {
            expect(gs.buildings[0].name).toBe("Small Indigo Plant");
            expect(gs.buildings.length).toBe(49);
        });

        it("gives out 2 indigo and 1 corn", () => {
            expect(gs.plantationSupply.length).toBe(43);
            expect(gs.visiblePlantations.length).toBe(4);
            expect(gs.players[0].board.plantations[0].type).toBe("indigo");
            expect(gs.players[1].board.plantations[0].type).toBe("indigo");
            expect(gs.players[2].board.plantations[0].type).toBe("corn");
        });

        it("inits quarries", () => {
            expect(gs.quarries).toBe(8);
        });

        it("inits trading house", () => {
            expect(gs.tradingHouse).toHaveLength(0);
        });

        it("inits colonists", () => {
            expect(gs.colonists).toBe(55);
        });

        it("inits colony ship", () => {
            expect(gs.colonyShip).toBe(3);
        });

        it("inits vps", () => {
            expect(gs.victoryPoints).toBe(75);
        });

        it("inits ships", () => {
            expect(gs.ships.length).toBe(3);
            expect(gs.ships[0].spots).toBe(4);
            expect(gs.ships[1].spots).toBe(5);
            expect(gs.ships[2].spots).toBe(6);
            expect(gs.ships[0].size).toBe("Sml");
            expect(gs.ships[1].size).toBe("Med");
            expect(gs.ships[2].size).toBe("Big");
        });

        it("inits governor", () => {
            expect(gs.governorIdx).toBe(0);
        });

        it("inits roles", () => {
            expect(gs.roles.length).toBe(6);
            const roles = gs.roles.map(r => r.name);
            const expectedRoles = ["Settler", "Mayor", "Builder", "Craftsman", "Trader", "Captain"];
            expect(roles).toEqual(expect.arrayContaining(expectedRoles));
            expect(roles.length).toBe(expectedRoles.length);
        });

        it("inits available roles", () => {
            expect(gs.roles.length).toBe(gs.availableRoles.length);
            gs.availableRoles.pop();
            expect(gs.roles.length).not.toBe(gs.availableRoles.length);
        });

        it("inits round counter", () => {
            expect(gs.roundCounter).toBe(0);
        });

        it("inits current player", () => {
            expect(gs.currentPlayerIdx).toBe(0);
        });

        it("inits current turn player", () => {
            expect(gs.currentTurnPlayerIdx).toBe(0);
        });

        describe("4 players", () => {
            beforeEach(() => {
                const names = ["Alice", "Bob", "Carol", "Dave"];
                gs = new GameState(names);
            });

            it("inits doubloons", () => {
                expect(gs.players[0].doubloons).toBe(3);
            });

            it("gives out 2 indigo and 2 corn", () => {
                expect(gs.plantationSupply.length).toBe(41);
                expect(gs.visiblePlantations.length).toBe(5);
                expect(gs.players[0].board.plantations[0].type).toBe("indigo");
                expect(gs.players[1].board.plantations[0].type).toBe("indigo");
                expect(gs.players[2].board.plantations[0].type).toBe("corn");
                expect(gs.players[3].board.plantations[0].type).toBe("corn");
            });

            it("inits colonists", () => {
                expect(gs.colonists).toBe(75);
            });

            it("inits colony ship", () => {
                expect(gs.colonyShip).toBe(4);
            });

            it("inits vps", () => {
                expect(gs.victoryPoints).toBe(100);
            });

            it("inits ships", () => {
                expect(gs.ships.length).toBe(3);
                expect(gs.ships[0].spots).toBe(5);
                expect(gs.ships[1].spots).toBe(6);
                expect(gs.ships[2].spots).toBe(7);
            });

            it("inits roles", () => {
                expect(gs.roles.length).toBe(7);
                const roles = gs.roles.map(r => r.name);
                const expectedRoles = ["Settler", "Mayor", "Builder", "Craftsman", "Trader", "Captain", "Prospector"];
                expect(roles).toEqual(expect.arrayContaining(expectedRoles));
                expect(roles.length).toBe(expectedRoles.length);
            });
        });

        describe("5 players", () => {
            beforeEach(() => {
                const names = ["Alice", "Bob", "Carol", "Dave", "Erica"];
                gs = new GameState(names);
            });

            it("inits doubloons", () => {
                expect(gs.players[0].doubloons).toBe(4);
            });

            it("gives out 3 indigo and 2 corn", () => {
                expect(gs.plantationSupply.length).toBe(39);
                expect(gs.visiblePlantations.length).toBe(6);
                expect(gs.players[0].board.plantations[0].type).toBe("indigo");
                expect(gs.players[1].board.plantations[0].type).toBe("indigo");
                expect(gs.players[2].board.plantations[0].type).toBe("indigo");
                expect(gs.players[3].board.plantations[0].type).toBe("corn");
                expect(gs.players[4].board.plantations[0].type).toBe("corn");
            });

            it("inits colonists", () => {
                expect(gs.colonists).toBe(95);
            });

            it("inits colony ship", () => {
                expect(gs.colonyShip).toBe(5);
            });

            it("inits vps", () => {
                expect(gs.victoryPoints).toBe(126);
            });

            it("inits ships", () => {
                expect(gs.ships.length).toBe(3);
                expect(gs.ships[0].spots).toBe(6);
                expect(gs.ships[1].spots).toBe(7);
                expect(gs.ships[2].spots).toBe(8);
            });

            it("inits roles", () => {
                expect(gs.roles.length).toBe(8);
                const roles = gs.roles.map(r => r.name);
                const expectedRoles = ["Settler", "Mayor", "Builder", "Craftsman", "Trader", "Captain", "Prospector", "Prospector"];
                expect(roles).toEqual(expect.arrayContaining(expectedRoles));
                expect(roles.length).toBe(expectedRoles.length);
            });

            it("inits a random gs id", () => {
                expect(gs.id).toHaveLength(32);
                expect(typeof(gs.id)).toBe(typeof(""));
            });
        });
    });

    describe("state management", () => {
        beforeEach(() => {
            Db.init();
        });

        afterEach(() => {
            Db.close();
        });

        describe("find", () => {
            it("it runs migrations", () => {
                try {
                    GameState.find("aaa");
                } catch(error) { }
                expect(Db.conn.prepare("SELECT COUNT(*) FROM gamestate").pluck().get()).toBe(0);
            });

            it("retrieves the latest copy of the game state", () => {
                gs.save();

                const expectedColonists = gs.colonists - 4;
                const expectedActions = gs.actionCounter + 1;

                gs.applyAction(gs.players[0], "chooseMayor");
                expect(Db.conn.prepare("SELECT COUNT(*) FROM gamestate").pluck().get()).toBe(2);

                const newGS = GameState.find(gs.id);
                expect(newGS.actionCounter).toBe(expectedActions);
                expect(newGS.colonists).toBe(expectedColonists);
            });

            it("it throws an error if it can't find by id", () => {
                expect(() => {GameState.find("aaa");})
                    .toThrow("No GameState Found with ID 'aaa'");
            });
        });

        describe("save", () => {
            it("it runs migrations", () => {
                try {
                    gs.save();
                } catch(error) { }
                expect(Db.conn.prepare("SELECT COUNT(*) FROM gamestate").pluck().get()).toBe(1);
            });

            it("saves the gameState to the DB", () => {
                expect(gs.save()).toBeTruthy();
                expect(Db.conn.prepare("SELECT COUNT(*) FROM gamestate").pluck().get()).toBe(1);
                expect(Db.conn.prepare("SELECT id FROM gamestate").pluck().get()).toBe(gs.id);
                expect(Db.conn.prepare("SELECT state FROM gamestate").pluck().get()).toBe(JSON.stringify(gs));
            });

            it("it retrieves a game state by id", () => {
                gs.save();
                const newGS = GameState.find(gs.id);
                expect(JSON.stringify(newGS)).toBe(JSON.stringify(gs));
            });

            it("avoids race conditions by using the action counter as part of the primary key", () => {
                gs.save();
                const altGs = GameState.find(gs.id);
    
                altGs.applyAction(gs.players[0], "chooseMayor");
                expect(() => {gs.applyAction(gs.players[0], "chooseMayor");})
                    .toThrow("UNIQUE constraint failed: gamestate.id, gamestate.actions");
            });
        });
    });

    describe("hydrate", () => {
        it("reconstitutes a gs from JSON", () => {
            const names = ["Alice", "Bob", "Carol", "Dave"];
            gs = new GameState(names);
            const gsJSObj = JSON.parse(JSON.stringify(gs));
            const newGS = GameState.hydrate(gsJSObj);
            expect(JSON.stringify(newGS)).toBe(JSON.stringify(gs));
        });

        it("reconstitutes available roles from JSON", () => {
            const gsJSObj = JSON.parse(gs.json());
            const newGS = GameState.hydrate(gsJSObj);

            expect(newGS.availableRoles.map((r) => r.constructor.name))
                .toStrictEqual(gs.availableRoles.map((r) => r.constructor.name));
        });

        it("reconstitutes roles from JSON", () => {
            const gsJSObj = JSON.parse(gs.json());
            const newGS = GameState.hydrate(gsJSObj);

            expect(newGS.roles.map((r) => r.constructor.name))
                .toStrictEqual(gs.roles.map((r) => r.constructor.name));
        });

        it("reconstitutes currentRole from JSON", () => {
            gs.currentRole = gs.availableRoles.pop();
            const gsJSObj = JSON.parse(gs.json());
            const newGS = GameState.hydrate(gsJSObj);

            expect(newGS.currentRole.constructor.name)
                .toBe(gs.currentRole.constructor.name);
        });

        it("reconstitutes building from JSON", () => {
            const gsJSObj = JSON.parse(gs.json());
            const newGS = GameState.hydrate(gsJSObj);

            // console.log("GS:", gs.buildings[0], gs.buildings[0].constructor.name);
            // console.log("NEWGS:", newGS.buildings[0], newGS.buildings[0].constructor.name);

            expect(newGS.buildings[0].constructor.name)
                .toBe(gs.buildings[0].constructor.name);
        });

        it("reconstitutes player building from JSON", () => {
            // gs.players[0].board.buildings.push(gs.buildings.pop());
            gs.players[0].board.buildings.push(gs.buildings[0]);
            const gsJSObj = JSON.parse(gs.json());
            const newGS = GameState.hydrate(gsJSObj);

            // console.log("GS:", gs.players[0].board.buildings[0]);
            // console.log("newGS:", newGS.players[0].board.buildings[0]);

            expect( newGS.players[0].board.buildings[0].constructor.name)
                .toBe(gs.players[0].board.buildings[0].constructor.name);
        });
    });

    describe("currentPlayer", () => {
        it("returns the current player", () => {
            expect(gs.currentPlayer()).toBe(gs.players[0]);
        });
    });

    describe("currentTurnPlayer", () => {
        it("returns the current turn player", () => {
            expect(gs.currentTurnPlayer()).toBe(gs.players[0]);
        });
    });

    describe("governor", () => {
        it("returns the governor", () => {
            expect(gs.governor()).toBe(gs.players[0]);
        });
    });

    describe("getAvailableActions", () => {
        describe("chooseRole", () => {
            it("returns an empty array if player is not current player", () => {
                expect(gs.getAvailableActions(gs.players[1])).toHaveLength(0);
            });

            it("returns available role actions", () => {
                expect(gs.getAvailableActions(gs.players[0])).toHaveLength(6);
                expect(gs.getAvailableActions(gs.players[0])[0].key).toBe("chooseSettler");
            });
        });

        describe("role actions", () => {
            it("returns a list of available actions", () => {
                gs.applyAction(gs.players[0], "chooseBuilder");
                expect(gs.getAvailableActions(gs.players[0])).not.toHaveLength(0);
                expect(gs.getAvailableActions(gs.players[0])[1].key).toContain("buy");
            });

            it("returns an empty array if player is not current turn player", () => {
                gs.applyAction(gs.players[0], "chooseBuilder");
                gs.applyAction(gs.players[0], "skip");
                expect(gs.currentTurnPlayerIdx).toBe(1);
                expect(gs.getAvailableActions(gs.players[0])).toHaveLength(0);
                expect(gs.getAvailableActions(gs.players[1])).not.toHaveLength(0);
            });
        });


        // TODO could add non first player check here for the mayor role since it can run parallel
    });

    describe("applyAction", () => {
        it("applies an action using the key", () => {
            gs.applyAction(gs.players[0], "chooseMayor");
            expect(gs.currentRole.name).toBe("Mayor");
        });

        it("does nothing if the key can not be found", () => {
            gs.applyAction(gs.players[0], "fake");
            expect(gs.currentRole).toBeNull();
        });

        it("increments the action counter", () => {
            gs.applyAction(gs.players[0], "chooseMayor");
            expect(gs.actionCounter).toBe(1);
        });

        it("sets the lastChange field", () => {
            const ts = new Date("2022-01-01");
            jest.useFakeTimers().setSystemTime(ts);
            gs.applyAction(gs.players[0], "chooseMayor");
            expect(gs.lastChange).toBe(+ts);
        });

        it("saves the state", () => {
            Db.close();
            Db.init();
            gs.applyAction(gs.players[0], "chooseMayor");
            expect(Db.conn.prepare("SELECT COUNT(*) FROM gamestate").pluck().get()).toBe(1);
            Db.close();
        });
    });

    describe("endRole", () => {
        beforeEach(() => {
            gs.currentRole = new Role();
        });

        it ("sets the current role to null", () => {
            gs.endRole();
            expect(gs.currentRole).toBeNull();
        });

        it ("increments the player idx", () => {
            gs.endRole();
            expect(gs.currentPlayerIdx).toBe(1);
        });

        it ("resets the player idx to zero if it goes beyond the end", () => {
            gs.currentPlayerIdx = gs.players.length - 1;
            gs.governorIdx = 1;
            gs.endRole();
            expect(gs.currentPlayerIdx).toBe(0);
        });

        it ("ends the round if all players have gone", () => {
            gs.currentPlayerIdx = gs.players.length - 1;
            gs.endRole();
            expect(gs.governorIdx).toBe(1);
            expect(gs.currentPlayerIdx).toBe(1);
            expect(gs.currentTurnPlayerIdx).toBe(1);
        });

        it("doesn't allow the governor index to go beyond the player indexes", () => {
            gs.governorIdx = 2;
            gs.currentPlayerIdx = 1;
            gs.endRole();
            expect(gs.governorIdx).toBe(0);
            expect(gs.currentPlayerIdx).toBe(0);
            expect(gs.currentTurnPlayerIdx).toBe(0);
        });

        it("it resets the current turn player", () => {
            gs.currentTurnPlayerIdx = 2;
            gs.endRole();
            expect(gs.currentTurnPlayerIdx).toBe(gs.currentPlayerIdx);
        });
    });

    describe("advancePlayer", () => {
        it("ends the role if the turn player is the last one", () => {
            gs.currentTurnPlayerIdx = 2;
            gs.currentRole = new Role();
            gs.advancePlayer();
            expect(gs.currentRole).toBeNull();
        });

        it("handles the first player being the last player", () => {
            gs.currentTurnPlayerIdx = 0;
            gs.currentPlayerIdx = 1;
            gs.currentRole = new Role();
            gs.advancePlayer();
            expect(gs.currentRole).toBeNull();
        });

        it("does nothing if the current turn player is not the last", () => {
            gs.currentRole = new Role();
            const role = gs.currentRole;
            gs.advancePlayer();
            expect(gs.currentRole).toBe(role);
        });
    });

    describe("endRound", () => {
        it ("advances the governor", () => {
            gs.endRound();
            expect(gs.governorIdx).toBe(1);
        });

        it ("advances the player to the governor", () => {
            gs.endRound();
            expect(gs.currentPlayerIdx).toBe(1);
        });

        it ("adds doubloons to each unchosen role", () => {
            gs.availableRoles = gs.availableRoles.slice(0,2);
            gs.availableRoles[0].doubloons++;
            gs.endRound();
            expect(gs.availableRoles[0].doubloons).toBe(2);
            expect(gs.availableRoles[1].doubloons).toBe(1);
        });

        it("advances the round counter", () => {
            gs.endRound();
            expect(gs.roundCounter).toBe(1);
        });

        it("resets the available roles", () => {
            gs.availableRoles = [];
            gs.endRound();
            expect(gs.availableRoles).not.toHaveLength(0);
        });

        // it ("ends the game if the end game conditions have been met");
    });

    describe("takeVPs", () => {
        it("takes from supply", () => {
            const expected = gs.victoryPoints - 1;
            expect(gs.takeVPs(1, gs.players[0])).toBe(1);
            expect(gs.victoryPoints).toBe(expected);
        });

        it("adds to the player", () => {
            expect(gs.takeVPs(1, gs.players[0])).toBe(1);
            expect(gs.players[0].victoryPoints).toBe(1);
        });

        it("doesn't take more than in supply", () => {
            gs.victoryPoints = 4;
            expect(gs.takeVPs(5, gs.players[0])).toBe(4);
            expect(gs.victoryPoints).toBe(0);
            expect(gs.players[0].victoryPoints).toBe(4);
        });
    });

    describe("takeColonists", () => {
        it("takes from supply", () => {
            const expected = gs.colonists - 1;
            gs.colonyShip = 0;
            expect(gs.takeColonists(1)).toBe(1);
            expect(gs.colonists).toBe(expected);
        });

        it("doesn't take more than in supply", () => {
            gs.colonists = 3;
            gs.colonyShip = 0;
            expect(gs.takeColonists(5)).toBe(3);
            expect(gs.colonists).toBe(0);
        });

        it("takes from the ship if the supply is empty", () => {
            gs.colonists = 1;
            gs.colonyShip = 2;
            expect(gs.takeColonists(2)).toBe(2);
            expect(gs.colonists).toBe(0);
            expect(gs.colonyShip).toBe(1);
        });
    });

    describe("resetPlantations", () => {
        it("moves visible to discarded", () => {
            gs.visiblePlantations = gs.visiblePlantations.slice(0,2);
            gs.resetPlantations();
            expect(gs.discardedPlantations).toHaveLength(2);
        });

        it("adds new plantations one plus player length", () => {
            gs.visiblePlantations = gs.visiblePlantations.slice(0,2);
            gs.resetPlantations();
            expect(gs.visiblePlantations).toHaveLength(4);
        });

        it("doesn't take more than in supply", () => {
            gs.plantationSupply = gs.plantationSupply.slice(0,2);
            gs.resetPlantations();
            expect(gs.visiblePlantations).toHaveLength(2);
        });
    });

    describe("gameEnd", () => {
        it("returns false", () => {
            expect(gs.gameEnd()).toBeFalsy();
        });

        it("returns true if the cantRefill boolean is flipped", () => {
            gs.cantRefillColonyShip = true;
            expect(gs.gameEnd()).toBeTruthy();
        });

        it("returns true if a player has a full building section", () => {
            const bs = gs.players[0].board.buildings;
            bs.push(new Residence);
            bs.push(new Fortress);
            bs.push(new CityHall);
            bs.push(new GuildHall);
            bs.push(new CustomsHouse);
            bs.push(new SmallIndigoPlant);
            bs.push(new SmallMarket);
            expect(gs.gameEnd()).toBeTruthy();
        });

        it("returns true if vps are gone", () => {
            gs.victoryPoints = 0;
            expect(gs.gameEnd()).toBeTruthy();
        });
    });
});