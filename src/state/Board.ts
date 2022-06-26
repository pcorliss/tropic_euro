import "reflect-metadata";

import { Building } from "./Building";
import { Plantation } from "./Plantation";
import { isEqual } from "lodash";
import { Type } from "class-transformer";

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

export const BUILDING_DISCRIMINATOR = {
    discriminator: {
        property: "name",
        subTypes: [
            { value: SmallIndigoPlant, name: new SmallIndigoPlant().name },
            { value: SmallSugarMill, name: new SmallSugarMill().name },
            { value: SmallMarket, name: new SmallMarket().name },
            { value: ConstructionHut, name: new ConstructionHut().name },
            { value: Hacienda, name: new Hacienda().name },
            { value: SmallWarehouse, name: new SmallWarehouse().name },
            { value: LargeIndigoPlant, name: new LargeIndigoPlant().name },
            { value: LargeSugarMill, name: new LargeSugarMill().name },
            { value: LargeMarket, name: new LargeMarket().name },
            { value: Hospice, name: new Hospice().name },
            { value: Office, name: new Office().name },
            { value: LargeWarehouse, name: new LargeWarehouse().name },
            { value: TobaccoStorage, name: new TobaccoStorage().name },
            { value: CoffeeRoaster, name: new CoffeeRoaster().name },
            { value: Factory, name: new Factory().name },
            { value: University, name: new University().name },
            { value: Harbor, name: new Harbor().name },
            { value: Wharf, name: new Wharf().name },
            { value: Residence, name: new Residence().name },
            { value: CityHall, name: new CityHall().name },
            { value: CustomsHouse, name: new CustomsHouse().name },
            { value: Fortress, name: new Fortress().name },
            { value: GuildHall, name: new GuildHall().name },
        ],
    },
    keepDiscriminatorProperty: true,
};

export class Board {
    @Type(() => Building, BUILDING_DISCRIMINATOR)
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

    sameBuildings(b: Board): boolean {
        return isEqual(
            this.buildings.map((building) => building.name).sort(),
            b.buildings.map((building) => building.name).sort()
        );
    }

    samePlantations(b: Board): boolean {
        return isEqual(
            this.plantations.map((p) => p.type).sort(),
            b.plantations.map((p) => p.type).sort()
        );
    }
}