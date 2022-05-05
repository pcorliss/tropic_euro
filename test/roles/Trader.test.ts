import { GameState } from "../../src/state/GameState";
import { Trader} from "../../src/roles/Trader";
import { Role } from "../../src/state/Role";
import { Player} from "../../src/state/Player";
import { Good} from "../../src/state/Good";
import { SmallMarket } from "../../src/buildings/SmallMarket";
import { LargeMarket } from "../../src/buildings/LargeMarket";

describe("Trader", () => {
    let gs: GameState = null;
    let role: Role = null;
    let player: Player = null;

    beforeEach(() => {
        gs = new GameState(["Alice", "Bob", "Carol"]);
        role = gs.availableRoles.find((r) => r instanceof Trader);
        gs.currentRole = role;
        player = gs.players[0];
    });

    describe("availableActions", () => {
        it("returns nothing if the player is not the current turn player", () => {
            gs.players[1].goods["corn"] = 1;
            const actions = role.availableActions(gs, gs.players[1]);
            expect(actions).toHaveLength(0);
        });

        it("returns nothing if the player has no goods", () => {
            const actions = role.availableActions(gs, player);
            expect(actions).toHaveLength(0);
        });

        it("returns nothing if the good has already been traded", () => {
            gs.tradingHouse = ["corn"];
            player.goods["corn"] = 1;
            const actions = role.availableActions(gs, player);
            expect(actions).toHaveLength(0);
        });

        it("returns nothing if the house is already full", () => {
            gs.tradingHouse = ["indigo", "coffee", "sugar", "corn"];
            player.goods["tobacco"] = 1;
            const actions = role.availableActions(gs, player);
            expect(actions).toHaveLength(0);
        });

        it("returns the set difference between the players goods and the house goods", () => {
            gs.tradingHouse = ["indigo", "corn", "coffee"];
            player.goods["tobacco"] = 1;
            player.goods["indigo"] = 1;
            player.goods["corn"] = 1;
            const actions = role.availableActions(gs, player);
            const actionKeys = actions.map((a) => a.key);
            expect(actionKeys).toHaveLength(2);
            expect(actionKeys).toContain("tradeTobacco");
            expect(actionKeys).toContain("skip");
        });

        describe("action apply",() => {
            describe("skip",() => {
                it("allows the player to not trade", () => {
                    player.goods["corn"] = 1;
                    const actions = role.availableActions(gs, player);
                    const a = actions.find((a) => a.key == "skip");
                    const expected = player.goods;
                    a.apply(gs, player);
                    expect(player.goods).toBe(expected);
                });

                it("advances the player", () => {
                    player.goods["corn"] = 1;
                    const actions = role.availableActions(gs, player);
                    const a = actions.find((a) => a.key == "skip");
                    a.apply(gs, player);
                    expect(gs.currentTurnPlayerIdx).toBe(1);
                });
            });

            it("removes the good from the player", () => {
                player.goods["corn"] = 2;
                const actions = role.availableActions(gs, player);
                const a = actions.find((a) => a.key == "tradeCorn");
                a.apply(gs, player);
                expect(player.goods["corn"]).toBe(1);
            });

            it("adds the good to the trading house", () => {
                player.goods["corn"] = 1;
                const actions = role.availableActions(gs, player);
                const a = actions.find((a) => a.key == "tradeCorn");
                expect(gs.tradingHouse).toHaveLength(0);
                a.apply(gs, player);
                expect(gs.tradingHouse).toContain("corn");
            });

            it("advances the player", () => {
                player.goods["corn"] = 1;
                const actions = role.availableActions(gs, player);
                const a = actions.find((a) => a.key == "tradeCorn");
                a.apply(gs, player);
                expect(gs.currentTurnPlayerIdx).toBe(1);
            });

            it("clears the trading house at the end of the round if it's full", () => {
                gs.currentTurnPlayerIdx = 2;
                gs.tradingHouse = ["indigo", "sugar", "coffee"];
                Object.keys(gs.goods).forEach((g) => gs.goods[g as Good] = 0);
                player = gs.players[2];
                player.goods["corn"] = 1;
                const actions = role.availableActions(gs, player);
                const a = actions.find((a) => a.key == "tradeCorn");
                a.apply(gs, player);
                expect(gs.tradingHouse).toHaveLength(0);
                expect(gs.goods.indigo).toBe(1);
                expect(gs.goods.corn).toBe(1);
                expect(gs.goods.sugar).toBe(1);
                expect(gs.goods.coffee).toBe(1);
            });

            it("doesn't clear the trading house at the end of the round if it's not full", () => {
                gs.currentTurnPlayerIdx = 2;
                gs.tradingHouse = ["indigo", "sugar"];
                player = gs.players[2];
                player.goods["corn"] = 1;
                const actions = role.availableActions(gs, player);
                const a = actions.find((a) => a.key == "tradeCorn");
                a.apply(gs, player);
                expect(gs.tradingHouse).toHaveLength(3);
            });

            const goodValues = {
                "corn": 0,
                "indigo": 1,
                "sugar": 2,
                "tobacco": 3,
                "coffee": 4,
            };

            it("grants a bonus for the trader role", () => {
                player.goods["corn"] = 1;
                const actions = role.availableActions(gs, player);
                const actionKey = "tradeCorn";
                const a = actions.find((a) => a.key == actionKey);
                const expected = player.doubloons + 1;
                a.apply(gs, player);
                expect(player.doubloons).toBe(expected);
            });

            it("grants a bonus for the markets", () => {
                player = gs.players[1];
                gs.currentTurnPlayerIdx = 1;
                player.board.buildings.push(new SmallMarket);
                player.board.buildings.push(new LargeMarket);
                player.board.buildings.forEach((b) => b.staff = 1);
                player.goods["corn"] = 1;
                const actions = role.availableActions(gs, player);
                const actionKey = "tradeCorn";
                const a = actions.find((a) => a.key == actionKey);
                const expected = player.doubloons + 3;
                a.apply(gs, player);
                expect(player.doubloons).toBe(expected);
            });

            it("grants no bonus for unstaffed markets", () => {
                player = gs.players[1];
                gs.currentTurnPlayerIdx = 1;
                player.board.buildings.push(new SmallMarket);
                player.board.buildings.push(new LargeMarket);
                player.goods["corn"] = 1;
                const actions = role.availableActions(gs, player);
                const actionKey = "tradeCorn";
                const a = actions.find((a) => a.key == actionKey);
                const expected = player.doubloons;
                a.apply(gs, player);
                expect(player.doubloons).toBe(expected);
            });

            describe("good values", () => {
                beforeEach(() => {
                    player = gs.players[1];
                    gs.currentTurnPlayerIdx = 1;
                });

                for(const [good, value] of Object.entries(goodValues)) {
                    it(`adds ${value} doubloons for trading ${good}`, () => {
                        player.goods[<Good>good] = 1;
                        const actions = role.availableActions(gs, player);
                        const actionKey = `trade${good[0].toUpperCase()}${good.slice(1)}`;
                        const a = actions.find((a) => a.key == actionKey);
                        const expected = player.doubloons + value;
                        a.apply(gs, player);
                        expect(player.doubloons).toBe(expected);
                    });
                }
            });
        });
    });
});