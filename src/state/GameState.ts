import { Player } from "./Player";
import { Building } from "./Building";
import { Plantation } from "./Plantation";
import { Role } from "./Role";
import { Ship } from "./Ship";
import { SmallIndigoPlant } from "../buildings/SmallIndigoPlant";
import { shuffle } from "lodash";

export class GameState {
    players: Player[];
    buildings: Building[];
    visiblePlantations: Plantation[];
    plantationSupply: Plantation[];
    discardedPlantations: Plantation[];
    removedPlantations: Plantation[];
    quarries: number;
    colonists: number;
    colonyShip: number;
    victoryPoints: number;
    ships: Ship[];
    roles: Role[];
    availableRoles: Role[];
    roundCounter: number;

    initPlantations(): void {
        // 8 quarry tiles and 50 plantation tiles: 8 coffee,
        // 9 tobacco, 10 corn, 11 sugar, and 12 indigo
        const plantDistr = new Map<string, number>([
            ["coffee", 8],
            ["tobacco", 9],
            ["corn", 10],
            ["sugar", 11],
            ["indigo", 12],
        ]);

        this.quarries = 8;

        // 3-player - 2 Indigo, 1 Corn
        // 4-player - 2 Indigo, 2 Corn
        // 5-player - 3 Indigo, 2 Corn
        if (this.players.length == 3) {
            this.players[0].board.plantations[0] = new Plantation("indigo");
            this.players[1].board.plantations[0] = new Plantation("indigo");
            this.players[2].board.plantations[0] = new Plantation("corn");
            plantDistr.set("indigo", plantDistr.get("indigo") - 2);
            plantDistr.set("corn", plantDistr.get("corn") - 1);
        } else if (this.players.length == 4) {
            this.players[0].board.plantations[0] = new Plantation("indigo");
            this.players[1].board.plantations[0] = new Plantation("indigo");
            this.players[2].board.plantations[0] = new Plantation("corn");
            this.players[3].board.plantations[0] = new Plantation("corn");
            plantDistr.set("indigo", plantDistr.get("indigo") - 2);
            plantDistr.set("corn", plantDistr.get("corn") - 2);
        } else {
            this.players[0].board.plantations[0] = new Plantation("indigo");
            this.players[1].board.plantations[0] = new Plantation("indigo");
            this.players[2].board.plantations[0] = new Plantation("indigo");
            this.players[3].board.plantations[0] = new Plantation("corn");
            this.players[4].board.plantations[0] = new Plantation("corn");
            plantDistr.set("indigo", plantDistr.get("indigo") - 3);
            plantDistr.set("corn", plantDistr.get("corn") - 2);
        }

        this.plantationSupply = [];
        this.discardedPlantations = [];
        this.removedPlantations = [];
        this.visiblePlantations = [];

        for (const [typ, cnt] of plantDistr) {
            for (let i = 0; i < cnt; i++) {
                this.plantationSupply.push(new Plantation(typ));
            }
        }

        this.plantationSupply = shuffle(this.plantationSupply);
        for (let i = 0; i <= this.players.length; i++) {
            this.visiblePlantations.push(
                this.plantationSupply.pop()
            );
        }
    }

    initColonists(): void {
        this.colonyShip = this.players.length;
        if (this.players.length == 3) {
            this.colonists = 55;
        } else if (this.players.length == 4) {
            this.colonists = 75;
        } else {
            this.colonists = 95;
        }
    }

    constructor(playerNames: string[]) {
        this.players = playerNames.map(n => new Player(n));
        this.buildings = [new SmallIndigoPlant()];
        this.initPlantations();
        this.initColonists();
        // SelectVPs
        // SelectShips
        // SelectRoles
        // RandomGovernor
    }
}