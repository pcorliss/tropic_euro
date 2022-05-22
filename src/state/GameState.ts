import "reflect-metadata";

import { Player } from "./Player";
import { Building } from "./Building";
import { Plantation } from "./Plantation";
import { Role } from "./Role";
import { Ship } from "./Ship";
import { Action } from "./Action";
import { Good } from "./Good";

import { CityHall } from "../buildings/CityHall";
import { CoffeeRoaster } from "../buildings/CoffeeRoaster";
import { ConstructionHut } from "../buildings/ConstructionHut";
import { CustomsHouse } from "../buildings/CustomsHouse";
import { Factory } from "../buildings/Factory";
import { Fortress } from "../buildings/Fortress";
import { GuildHall } from "../buildings/GuildHall";
import { Hacienda } from "../buildings/Hacienda";
import { Harbor } from "../buildings/Harbor";
import { Hospice } from "../buildings/Hospice";
import { LargeIndigoPlant } from "../buildings/LargeIndigoPlant";
import { LargeMarket } from "../buildings/LargeMarket";
import { LargeSugarMill } from "../buildings/LargeSugarMill";
import { LargeWarehouse } from "../buildings/LargeWarehouse";
import { Office } from "../buildings/Office";
import { Residence } from "../buildings/Residence";
import { SmallIndigoPlant } from "../buildings/SmallIndigoPlant";
import { SmallMarket } from "../buildings/SmallMarket";
import { SmallSugarMill } from "../buildings/SmallSugarMill";
import { SmallWarehouse } from "../buildings/SmallWarehouse";
import { TobaccoStorage } from "../buildings/TobaccoStorage";
import { University } from "../buildings/University";
import { Wharf } from "../buildings/Wharf";

import { Settler } from "../roles/Settler";
import { Mayor } from "../roles/Mayor";
import { Builder } from "../roles/Builder";
import { Craftsman } from "../roles/Craftsman";
import { Trader } from "../roles/Trader";
import { Captain } from "../roles/Captain";
import { Prospector } from "../roles/Prospector";

import { Migration, Db } from "../Db";

import { shuffle } from "lodash";
import { plainToClass } from "class-transformer";
import {Database} from "better-sqlite3";

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
    roundCounter = 0;
    actionCounter = 0;
    lastChange = +new Date();
    governorIdx = 0;
    currentPlayerIdx = 0;
    currentTurnPlayerIdx = 0;
    currentRole: Role = null;
    tradingHouse: Good[] = [];
    cantRefillColonyShip = false;
    id: string = null;
    _dbConn: Database;

    goods: Record<Good, number> = {
        corn: 10,
        indigo: 11,
        sugar: 11,
        tobacco: 9,
        coffee: 9,
    };

    initPlantations(): void {
        // 8 quarry tiles and 50 plantation tiles: 8 coffee,
        // 9 tobacco, 10 corn, 11 sugar, and 12 indigo
        const plantDistr: Record<Good, number> = {
            corn: 10,
            indigo: 12,
            sugar: 11,
            tobacco: 9,
            coffee: 8,
        };

        this.quarries = 8;

        // 3-player - 2 Indigo, 1 Corn
        // 4-player - 2 Indigo, 2 Corn
        // 5-player - 3 Indigo, 2 Corn
        this.players[0].board.plantations[0] = new Plantation("indigo");
        this.players[1].board.plantations[0] = new Plantation("indigo");
        plantDistr["indigo"] -= 2;
        if (this.players.length == 3) {
            this.players[2].board.plantations[0] = new Plantation("corn");
            plantDistr["corn"] -= 1;
        } else if (this.players.length == 4) {
            this.players[2].board.plantations[0] = new Plantation("corn");
            this.players[3].board.plantations[0] = new Plantation("corn");
            plantDistr["corn"] -= 2;
        } else {
            this.players[2].board.plantations[0] = new Plantation("indigo");
            this.players[3].board.plantations[0] = new Plantation("corn");
            this.players[4].board.plantations[0] = new Plantation("corn");
            plantDistr["indigo"] -= 1;
            plantDistr["corn"] -= 2;
        }

        this.plantationSupply = [];
        this.discardedPlantations = [];
        this.removedPlantations = [];
        this.visiblePlantations = [];

        for (const [typ, cnt] of Object.entries(plantDistr)) {
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

    initVPs(): void {
        if (this.players.length == 3) {
            this.victoryPoints = 75;
        } else if (this.players.length == 4) {
            this.victoryPoints = 100;
        } else {
            this.victoryPoints = 126;
        }
    }

    initTradeShips(): void {
        if (this.players.length == 3) {
            this.ships = [ new Ship(4, "Sml"), new Ship(5, "Med"), new Ship(6, "Big") ];
        } else if (this.players.length == 4) {
            this.ships = [ new Ship(5, "Sml"), new Ship(6, "Med"), new Ship(7, "Big") ];
        } else {
            this.ships = [ new Ship(6, "Sml"), new Ship(7, "Med"), new Ship(8, "Big") ];
        }
    }

    initRoles(): void {
        this.roles = [
            new Settler(),
            new Mayor(),
            new Builder(),
            new Craftsman(),
            new Trader(),
            new Captain(),
        ];

        if (this.players.length >= 4) {
            this.roles.push(new Prospector());
        }
        if (this.players.length == 5) {
            this.roles.push(new Prospector());
        }

        this.availableRoles = this.roles.map(r => r);
    }

    initBuildings(): void {
        this.buildings = [
            new SmallIndigoPlant(),
            new SmallIndigoPlant(),
            new SmallIndigoPlant(),
            new SmallIndigoPlant(),

            new SmallSugarMill(),
            new SmallSugarMill(),
            new SmallSugarMill(),
            new SmallSugarMill(),

            new SmallMarket(),
            new SmallMarket(),
            new ConstructionHut(),
            new ConstructionHut(),
            new Hacienda(),
            new Hacienda(),
            new SmallWarehouse(),
            new SmallWarehouse(),

            new LargeIndigoPlant(),
            new LargeIndigoPlant(),
            new LargeIndigoPlant(),
            new LargeSugarMill(),
            new LargeSugarMill(),
            new LargeSugarMill(),

            new LargeMarket(),
            new LargeMarket(),
            new Hospice(),
            new Hospice(),
            new Office(),
            new Office(),
            new LargeWarehouse(),
            new LargeWarehouse(),

            new TobaccoStorage(),
            new TobaccoStorage(),
            new TobaccoStorage(),
            new CoffeeRoaster(),
            new CoffeeRoaster(),
            new CoffeeRoaster(),

            new Factory(),
            new Factory(),
            new University(),
            new University(),
            new Harbor(),
            new Harbor(),
            new Wharf(),
            new Wharf(),

            new Residence(),
            new CityHall(),
            new CustomsHouse(),
            new Fortress(),
            new GuildHall(),
        ];
    }

    currentPlayer(): Player {
        return this.players[this.currentPlayerIdx];
    }

    currentTurnPlayer(): Player {
        return this.players[this.currentTurnPlayerIdx];
    }

    governor(): Player {
        return this.players[this.governorIdx];
    }
    getAvailableActions(player: Player): Action[] {
        if(this.currentTurnPlayer() != player) { return []; }
        if(this.currentRole === null) {
            return this.availableRoles.map((role) => role.chooseAction);
        }
        return [];
    }

    applyAction(player: Player, key: string): void {
        this.getAvailableActions(player)
            .find(action => action.key == key)
            ?.apply(this, player);
        this.actionCounter++;
        this.lastChange = +new Date();
        this.save();
    }

    advancePlayer(): void {
        if (this.currentRole.finished(this)) {
            this.endRole();
            return;
        }

        this.currentTurnPlayerIdx++;
        this.currentTurnPlayerIdx %= this.players.length;

        if (
            this.currentRole.skipPlayersWithNoActions &&
            this.currentRole.availableActions(
                this,
                this.currentTurnPlayer()
            ).length == 0
        ) {
            this.advancePlayer();
        }

        return;
    }

    endRole(): void {
        this.currentRole.endRole(this);
        this.currentRole = null;
        this.currentPlayerIdx++;
        this.currentPlayerIdx %= this.players.length;
        this.currentTurnPlayerIdx = this.currentPlayerIdx;
        if (this.currentPlayerIdx == this.governorIdx) {
            this.endRound();
        }
        return;
    }

    endRound(): void {
        this.governorIdx++;
        this.roundCounter++;
        this.currentPlayerIdx = this.governorIdx;
        this.availableRoles.forEach((r) => r.doubloons++);
        return;
    }

    takeVPs(request: number, player: Player): number {
        const grant = Math.min(request, this.victoryPoints);
        this.victoryPoints -= grant;
        player.victoryPoints += grant;
        return grant;
    }

    takeColonists(request: number): number {
        const grant = Math.min(request, this.colonists);
        const newReq = request - grant;
        this.colonists -= grant;

        const shipGrant = Math.min(newReq, this.colonyShip);
        this.colonyShip -= shipGrant;

        return grant + shipGrant;
    }

    gameEnd(): boolean {
        if (this.cantRefillColonyShip) { return true; }
        if (this.victoryPoints <= 0) { return true; }
        const fullBuildingMat = this.players.some((p) => {
            return p.board.buildings.reduce((sum, b) => sum += b.size, 0) >= 12;
        });
        if (fullBuildingMat) { return true; }
        return false;
    }

    randomID(): string {
        let result = "";
        for ( let i = 0; i < 32; i++ ) {
            result += String.fromCharCode(97 + Math.floor(Math.random() * 26));
        }
        return result;
    }

    constructor(playerNames?: string[]) {
        if (playerNames == null) {
            playerNames = ["", "", ""];
        }
        const shuffledNames = shuffle(playerNames);
        this.players = shuffledNames.map(n => new Player(n));
        this.players.forEach((p) => p.doubloons = this.players.length - 1);
        this.initBuildings();
        this.initPlantations();
        this.initColonists();
        this.initVPs();
        this.initTradeShips();
        this.initRoles();
        this.id = this.randomID();
    }

    save(): boolean {
        if (!this.dbConn) {
            return false;
        }
        this.dbConn
            .prepare("INSERT INTO gamestate VALUES (?, ?, ?, ?)")
            .run(this.id, this.actionCounter, this.lastChange, JSON.stringify(this));
        return true;
    }

    migrations(): Migration[] {
        return [
            {priority: 0, migration: `
                CREATE TABLE
                gamestate
                (
                    id TEXT,
                    actions INT,
                    updated_at INT,
                    state TEXT,
                    PRIMARY KEY (id, actions)
                );
            `},
        ];
    }
    public set dbConn(conn: Database) {
        this._dbConn = conn;
        Db.migrate(this.migrations());
    }

    public get dbConn() {
        return this._dbConn;
    }

    static hydrate(blob: GameState): GameState {
        // console.log("Hydrating:", blob);
        return plainToClass(GameState, blob);
    }
    static find(conn: Database, id: string): GameState {
        const sqlGS = conn
            .prepare("SELECT state FROM gamestate WHERE id = ? ORDER BY actions DESC LIMIT 1")
            .pluck()
            .get(id);
        if (!sqlGS) {
            throw(`No GameState Found with ID '${id}'`);
        }
        return GameState.hydrate(JSON.parse(sqlGS));
    }
}