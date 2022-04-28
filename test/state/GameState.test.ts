import { GameState } from "../../src/state/GameState";

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
            it("returns an empty array if player is not current player", () => {
                expect(gs.getAvailableActions(gs.players[1])).toHaveLength(0);
            });

            it("current role is null it returns available role actions", () => {
                expect(gs.getAvailableActions(gs.players[0])).toHaveLength(6);
                expect(gs.getAvailableActions(gs.players[0])[0].key).toBe("chooseSettler");
            });
        });

        describe("applyAction", () => {
            it("applies an action using the key", () => {
                gs.applyAction(gs.players[0], "chooseTrader");
                expect(gs.currentRole.name).toBe("Trader");
            });

            it("does nothing if the key can not be found", () => {
                gs.applyAction(gs.players[0], "fake");
                expect(gs.currentRole).toBeNull();
            });
        });

        describe("endRole", () => {
            beforeEach(() => {
                gs.currentRole = gs.availableRoles.pop();
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
                gs.currentRole = gs.availableRoles.pop();
                gs.advancePlayer();
                expect(gs.currentRole).toBeNull();
            });

            it("handles the first player being the last player", () => {
                gs.currentTurnPlayerIdx = 0;
                gs.currentPlayerIdx = 1;
                gs.currentRole = gs.availableRoles.pop();
                gs.advancePlayer();
                expect(gs.currentRole).toBeNull();
            });

            it("does nothing if the current turn player is not the last", () => {
                gs.currentRole = gs.availableRoles.pop();
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

            // it ("ends the game if the end game conditions have been met");
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
        });
    });
});