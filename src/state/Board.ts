import { Building } from "./Building";
import { Plantation } from "./Plantation";

export class Board {
    buildings: Building[] = [];
    plantations: Plantation[] = [];
    sanJuanColonists = 0;

    totalColonists(): number {
        const plantationColonists = this.plantations.filter((p) => p.staffed).length;
        const buildingColonists = this.buildings.reduce((count, b) => count += b.staff, 0);
        return this.sanJuanColonists + plantationColonists + buildingColonists;
    }

    openBuildingSpaces(): number {
        return this.buildings.reduce((count, b) => count += (b.staffSpots - b.staff), 0);
    }

    // autoDistributeColonists(): void {
    //     return;
    // }
}