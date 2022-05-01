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

    totalSpots(): number {
        const buildingSpots = this.buildings.reduce((count, b) => count += b.staffSpots, 0);
        const plantationSpots = this.plantations.length;
        return buildingSpots + plantationSpots;
    }

    autoDistributeColonists(): void {
        if (this.totalColonists() < this.totalSpots()) { return; }

        this.sanJuanColonists = this.totalColonists() - this.totalSpots();
        this.buildings.forEach((b) => b.staff = b.staffSpots);
        this.plantations.forEach((p) => p.staffed = true);
        return;
    }
}