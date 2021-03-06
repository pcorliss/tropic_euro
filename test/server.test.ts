import { Server } from "../src/server";
import { GameState } from "../src/state/GameState";

import RequestPromise from "request-promise";
import * as http from "http";
import { Db } from "../src/Db";

const API = "http://localhost:4999/graphql";

describe("server", () => {
    let s: Server = null;
    let l: http.Server = null;

    beforeEach(async () => {
        s = new Server();
        l = s.app.listen(4999);
    });

    afterEach(async () => {
        l.close();
        Db.close();
    });

    it("Hello Pie!", async () => {
        const query = `
            query {
                hello
            }
        `;

        const response = await RequestPromise({method: "POST", uri: API, body: {query}, json: true});
        expect(response.data.hello).toBe("Hello pie!");
        expect(response).toMatchSnapshot();
    });

    describe("Get GameState", () => {
        it("looks up a gamestate by id", async () => {
            const gs = new GameState(["Alice", "Bob", "Carol"]);
            gs.id = "aaa";
            gs.save();
            const query = `
                query {
                    gameState(id: "aaa") {
                        id
                        actionCounter
                        quarries
                        colonists
                        colonyShip
                        victoryPoints
                    }
                }
            `;

            const response = await RequestPromise({method: "POST", uri: API, body: {query}, json: true});
            try {
                expect(response.data.gameState.id).toBe(gs.id);
                expect(response.data.gameState.actionCounter).toBe(0);
                expect(response.data.gameState.quarries).toBe(8);
                expect(response.data.gameState.colonists).toBe(55);
                expect(response.data.gameState.colonyShip).toBe(3);
                expect(response.data.gameState.victoryPoints).toBe(75);
            } catch (error) {
                console.error(response);
                throw(error);
            }
        });

        it("Allows null Role", async () => {
            const gs = new GameState(["Alice", "Bob", "Carol"]);
            gs.id = "aaa";
            gs.save();
            const query = `
                query {
                    gameState(id: "aaa") {
                        currentRole {
                            name
                            description
                            doubloons
                        }
                    }
                }
            `;

            const response = await RequestPromise({method: "POST", uri: API, body: {query}, json: true});
            try {
                expect(response.data.gameState.currentRole).toBeNull();
            } catch (error) {
                console.error(response);
                throw(error);
            }
        });

        it("returns role information", async () => {
            const gs = new GameState(["Alice", "Bob", "Carol"]);
            gs.id = "aaa";
            gs.currentRole = gs.availableRoles[0];
            gs.save();
            const query = `
                query {
                    gameState(id: "aaa") {
                        currentRole {
                            name
                            description
                            doubloons
                        }
                        availableRoles {
                            name
                        }
                    }
                }
            `;

            const response = await RequestPromise({method: "POST", uri: API, body: {query}, json: true});
            try {
                expect(response.data.gameState.currentRole.name).toBe("Settler");
                expect(response.data.gameState.currentRole.description).toBe("");
                expect(response.data.gameState.currentRole.doubloons).toBe(0);
                expect(response.data.gameState.availableRoles).toHaveLength(6);
            } catch (error) {
                console.error(response);
                throw(error);
            }
        });

        it("returns plantations", async () => {
            const gs = new GameState(["Alice", "Bob", "Carol"]);
            gs.id = "aaa";
            gs.currentRole = gs.availableRoles[0];
            gs.visiblePlantations[0].type = "corn";
            gs.save();
            const query = `
                query {
                    gameState(id: "aaa") {
                        visiblePlantations {
                            type
                            staffed
                        }
                    }
                }
            `;

            const response = await RequestPromise({method: "POST", uri: API, body: {query}, json: true});
            try {
                expect(response.data.gameState.visiblePlantations).toHaveLength(4);
                expect(response.data.gameState.visiblePlantations[0].type).toBe("corn");
                expect(response.data.gameState.visiblePlantations[0].staffed).toBeFalsy();
            } catch (error) {
                console.error(response);
                throw(error);
            }
        });

        it("returns players", async () => {
            const gs = new GameState(["Alice", "Bob", "Carol"]);
            gs.id = "aaa";
            const aliceIdx = gs.players.findIndex((p) => p.name == "Alice");
            gs.governorIdx = aliceIdx;
            gs.currentPlayerIdx = aliceIdx;
            gs.currentTurnPlayerIdx = aliceIdx;
            gs.save();
            const query = `
                query {
                    gameState(id: "aaa") {
                        players {
                            name
                            doubloons
                        }
                        governor {
                            name
                        }
                        currentPlayer {
                            name
                        }
                        currentTurnPlayer {
                            name
                        }
                    }
                }
            `;

            const response = await RequestPromise({method: "POST", uri: API, body: {query}, json: true});
            try {
                expect(response.data.gameState.players).toHaveLength(3);
                expect(response.data.gameState.players[aliceIdx].name).toBe("Alice");
                expect(response.data.gameState.players[aliceIdx].doubloons).toBe(2);
                expect(response.data.gameState.governor.name).toBe("Alice");
                expect(response.data.gameState.currentPlayer.name).toBe("Alice");
                expect(response.data.gameState.currentTurnPlayer.name).toBe("Alice");
            } catch (error) {
                console.error(response);
                throw(error);
            }
        });

        it("returns ships", async () => {
            const gs = new GameState(["Alice", "Bob", "Carol"]);
            gs.id = "aaa";
            gs.save();
            const query = `
                query {
                    gameState(id: "aaa") {
                        ships {
                            spots
                            goods
                            size
                        }
                    }
                }
            `;

            const response = await RequestPromise({method: "POST", uri: API, body: {query}, json: true});
            try {
                expect(response.data.gameState.ships).toHaveLength(3);
                expect(response.data.gameState.ships[0].spots).toBe(4);
                expect(response.data.gameState.ships[0].goods).toBe(0);
                expect(response.data.gameState.ships[0].goodType).toBeUndefined();
                expect(response.data.gameState.ships[0].size).toBe("Sml");
            } catch (error) {
                console.error(response);
                throw(error);
            }
        });

        it("returns trading house goods", async () => {
            const gs = new GameState(["Alice", "Bob", "Carol"]);
            gs.id = "aaa";
            gs.tradingHouse.push("corn");
            gs.save();
            const query = `
                query {
                    gameState(id: "aaa") {
                        tradingHouse
                    }
                }
            `;

            const response = await RequestPromise({method: "POST", uri: API, body: {query}, json: true});
            try {
                expect(response.data.gameState.tradingHouse).toHaveLength(1);
                expect(response.data.gameState.tradingHouse[0]).toBe("corn");
            } catch (error) {
                console.error(response);
                throw(error);
            }
        });

        it("returns goods", async () => {
            const gs = new GameState(["Alice", "Bob", "Carol"]);
            gs.id = "aaa";
            gs.save();
            const query = `
                query {
                    gameState(id: "aaa") {
                        goods
                    }
                }
            `;

            const response = await RequestPromise({method: "POST", uri: API, body: {query}, json: true});
            try {
                expect(Object.keys(response.data.gameState.goods)).toHaveLength(5);
                expect(response.data.gameState.goods.corn).toBe(10);
            } catch (error) {
                console.error(response);
                throw(error);
            }
        });

        it("looks up available actions for a player", async () => {
            const gs = new GameState(["Alice", "Bob", "Carol"]);
            gs.id = "aaa";
            const firstPlayer = gs.players[0].name;
            gs.save();
            const query = `
                query {
                    gameState(id: "aaa") {
                        availableActions(playerId: "${firstPlayer}") {
                            key
                        }
                    }
                }
            `;

            const response = await RequestPromise({method: "POST", uri: API, body: {query}, json: true});
            try {
                expect(response.data.gameState.availableActions).toHaveLength(6);
                expect(response.data.gameState.availableActions[0].key).toBe("chooseSettler");
                expect(response).toMatchSnapshot();
            } catch (error) {
                console.error(response);
                throw(error);
            }
        });

        it("returns building information", async () => {
            const gs = new GameState(["Alice", "Bob", "Carol"]);
            gs.id = "aaa";
            gs.save();
            const query = `
                query {
                    gameState(id: "aaa") {
                        buildings {
                            name
                            description
                            production
                            productionType
                            staffSpots
                            size
                            staff
                            points
                            cost
                        }
                    }
                }
            `;

            const response = await RequestPromise({method: "POST", uri: API, body: {query}, json: true});
            try {
                expect(response.data.gameState.buildings[0].name).toBe("Small Indigo Plant");
                expect(response.data.gameState.buildings[0].description).toBe("");
                expect(response.data.gameState.buildings[0].production).toBeTruthy();
                expect(response.data.gameState.buildings[0].productionType).toBe("indigo");
                expect(response.data.gameState.buildings[0].staffSpots).toBe(1);
                expect(response.data.gameState.buildings[0].size).toBe(1);
                expect(response.data.gameState.buildings[0].staff).toBe(0);
                expect(response.data.gameState.buildings[0].points).toBe(1);
                expect(response.data.gameState.buildings[0].cost).toBe(1);
            } catch (error) {
                console.error(response);
                throw(error);
            }
        });

    });

    describe("Board", () => {
        it("returns boards as part of players", async () => {
            const gs = new GameState(["Alice", "Bob", "Carol"]);
            gs.id = "aaa";
            gs.save();
            const query = `
                query {
                    gameState(id: "aaa") {
                        players {
                            board {
                                buildings {
                                    name
                                }
                                plantations {
                                    type
                                }
                                sanJuanColonists
                            }
                        }
                    }
                }
            `;

            const response = await RequestPromise({method: "POST", uri: API, body: {query}, json: true});
            try {
                expect(response.data.gameState.players[0].board.buildings).toHaveLength(0);
                expect(response.data.gameState.players[0].board.plantations).toHaveLength(1);
                expect(response.data.gameState.players[0].board.plantations[0].type).toBe("indigo");
            } catch (error) {
                console.error(response);
                throw(error);
            }
        });
    });

    describe("Create a game", () => {
        it("creates a new game", async () => {
            const query = `
              mutation {
                createGame(players: ["A", "B", "C"]) {
                  id
                  actionCounter
                }
              }
            `;

            Db.migrate(GameState.migrations());
            const count = Db.conn
                .prepare("SELECT COUNT(*) FROM gamestate")
                .pluck()
                .get();

            const response = await RequestPromise({method: "POST", uri: API, body: {query}, json: true});
            try {
                expect(response.data.createGame.actionCounter).toBe(0);
                const newCount = Db.conn
                    .prepare("SELECT COUNT(*) FROM gamestate")
                    .pluck()
                    .get();
                expect(newCount).toBe(count + 1);
            } catch (error) {
                console.error(response);
                throw(error);
            }
        });
    });

    describe("Apply an action", () => {
        it("chooses a role", async () => {
            const gs = new GameState(["Alice", "Bob", "Carol"]);
            gs.id = "aaa";
            const firstPlayer = gs.players[0].name;
            gs.save();

            const query = `
              mutation {
                applyAction(gs: "aaa", player: "${firstPlayer}", key: "chooseSettler") {
                  actionCounter
                }
              }
            `;

            const response = await RequestPromise({method: "POST", uri: API, body: {query}, json: true});
            try {
                expect(response.data.applyAction.actionCounter).toBe(1);
            } catch (error) {
                console.error(response);
                throw(error);
            }
        });
    });
});