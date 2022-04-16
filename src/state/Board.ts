import { Building } from "./Building";
import { Plantation } from "./Plantation";

export class Board {
    buildings: Building[];
    plantations: Plantation[];
    sanJuanColonists: number;

    constructor() {
        this.plantations = [];
        this.buildings = [];
        this.sanJuanColonists = 0;
    }
}