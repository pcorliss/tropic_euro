import { Role } from "../state/Role";
import { Action } from "../state/Action";
import { GameState } from "../state/GameState";
import { Player } from "../state/Player";
import { Good } from "../state/Good";
import { Ship } from "../state/Ship";

export class Captain extends Role {
    name = "Captain";
    description = "";
    phase = "shipping";
    bonus = false;
    skipPlayersWithNoActions = true;

    spoilPhase(gs: GameState): boolean {
        return this.finishedShipping(gs);
    }

    finishedShipping(gs: GameState): boolean {
        return gs.players.every((p) => 
            this.possibleShipments(gs, p).length == 0
        );
    }

    finishedSpoiling(gs: GameState): boolean {
        return gs.players.every((p) => 
            this.possibleSpoils(gs, p).length == 0
        );
    }

    finished(gs: GameState): boolean {
        return this.finishedShipping(gs) && this.finishedSpoiling(gs);
    }

    endRole(gs?: GameState, player?: Player): void {
        gs.players.forEach((p) => {
            p.board.buildings
                .filter((pb) => (pb.phase == "shippingOptions" || pb.phase == "spoilOptions") && pb.staff > 0)
                .forEach((pb) => pb.endRole(gs, p));
        });
            // .flatMap((p) => p.board.buildings)
            // .filter((pb) => (pb.phase == "shippingOptions" || pb.phase == "spoilOptions") && pb.staff > 0)
            // .flatMap((pb) => pb.endRole(gs, p));
        gs.ships
            .filter((s) => s.full())
            .forEach((s) => {
                gs.goods[s.goodType] += s.goods;
                s.goods = 0;
                s.goodType = null;
            });
        this.bonus = false;
        return;
    }

    shippingActionApply(good: Good, ship: Ship): (gs: GameState, player: Player) => void {
        return (gs: GameState, player: Player): void => {
            ship.goodType ||= good;
            const spots = Math.min(
                player.goods[good],
                ship.spots - ship.goods
            );
            ship.goods += spots;
            gs.takeVPs(spots, player);
            player.goods[good] -= spots;
            if (player == gs.currentPlayer() && !this.bonus) {
                gs.takeVPs(1, player);
                this.bonus = true;
            }

            player.board.buildings
                .filter((pb) => pb.phase == "shippingAction" && pb.staff > 0)
                .forEach((pb) => pb.shippingAction(gs, player));

            gs.advancePlayer();
            return;
        };
    }

    shippingAction(good: Good, ship: Ship): Action {
        return new Action(
            `ship${good[0].toUpperCase()}${good.slice(1)}${ship.size}`,
            this.shippingActionApply(good, ship)
        );
    }

    spoilAction(good: Good): Action {
        return new Action(
            `keepOne${good[0].toUpperCase()}${good.slice(1)}`,
            (gs: GameState, player: Player): void => {
                Object.keys(player.goods).forEach((g) => {
                    gs.goods[g as Good] += player.goods[g as Good];
                    player.goods[g as Good] = 0;
                });
                player.goods[good]++;
                gs.goods[good]--;
                gs.advancePlayer();
                return;
            },
        );
    }

    possibleSpoils(gs: GameState, player: Player): Good[] {
        const goodsSum = Object.values(player.goods).reduce((acc, n) => acc += n);
        if (goodsSum <= 1) {
            return [];
        }
        return Object.entries(player.goods)
            .filter(([g, n]) => n > 0)
            .map(([g, n]) => g as Good);
    }

    possibleShipments(gs: GameState, player: Player): [Good, Ship][] {
        const emptyShips = gs.ships.filter((s) => s.empty());
        const fullShipTypes = new Set<Good>(gs.ships
            .filter((s) => s.full())
            .map((s) => s.goodType)
        );
        const goodsShips = new Map(
            gs.ships
                .filter((s) => !s.empty() && !s.full())
                .map(s => [s.goodType, s])
        );

        const possible: [Good, Ship][] = [];

        Object.entries(player.goods).forEach(([g, q]) => {
            if (q <= 0) { return; }
            if (fullShipTypes.has(g as Good)) { return; }
            if (goodsShips.has(g as Good)) {
                const s = goodsShips.get(g as Good);
                possible.push([g as Good, s]);
                return;
            }
            emptyShips.forEach((s) => {
                possible.push([g as Good, s]);
            });
        });

        return possible;
    }

    availableActions(gs?: GameState, player?: Player): Action[] {
        if (gs.currentTurnPlayer() != player) { return []; }

        const actions = this.possibleShipments(gs, player).map(([g, s]) => 
            this.shippingAction(g, s)
        );

        player.board.buildings
            .filter((pb) => pb.phase == "shippingOptions" && pb.staff > 0)
            .flatMap((pb) => pb.shippingOptions(player, this))
            .forEach((a) => actions.push(a));

        // TODO is the spoil phase check here necessary?
        if (this.spoilPhase(gs) && actions.length == 0) {
            const seenSpoilKey = new Set<string>();
            player.board.buildings
                .filter((pb) => pb.phase == "spoilOptions" && pb.staff > 0)
                .flatMap((pb) => pb.spoilOptions(player))
                .filter((sa) => {
                    if (!seenSpoilKey.has(sa.key)) {
                        seenSpoilKey.add(sa.key);
                        return true;
                    }
                    return false;
                }).forEach((a) => actions.push(a));
            if (actions.length > 0) { return actions; }

            return this.possibleSpoils(gs, player).map((g) => 
                this.spoilAction(g)
            );
        }
        
        return actions;
    }
}