import { Player } from "./Player";
import { Building } from "./Building";
import { Plantation } from "./Plantation";
import { Role } from "./Role";
import { Ship } from "./Ship";
import { SmallIndigoPlant } from "../buildings/SmallIndigoPlant";

export class GameState {
    players: Player[];
    buildings: Building[];
    visiblePlantations: Plantation[];
    plantationSupply: Plantation[];
    discardedPlantations: Plantation[];
    removedPlantations: Plantation[];
    quarries: number;
    colonists: number;
    victoryPoints: number;
    ships: Ship[];
    roles: Role[];
    availableRoles: Role[];
    roundCounter: number;

    constructor(playerNames: string[]) {
        this.players = playerNames.map(n => new Player(n));
        this.buildings = [new SmallIndigoPlant()];
        // Init Buildings
        // ShufflePlantations
        // DealPlantations
        // Init Quarries
        // SelectColonists
        // SelectVPs
        // SelectShips
        // SelectRoles
        // RandomGovernor
    }
}