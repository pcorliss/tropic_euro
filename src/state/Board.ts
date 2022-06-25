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
            { value: SmallIndigoPlant, name: SmallIndigoPlant.name.replace(/([a-z])([A-Z])/g, "$1 $2") },
            { value: SmallSugarMill, name: SmallSugarMill.name.replace(/([a-z])([A-Z])/g, "$1 $2") },
            { value: SmallMarket, name: SmallMarket.name.replace(/([a-z])([A-Z])/g, "$1 $2") },
            { value: ConstructionHut, name: ConstructionHut.name.replace(/([a-z])([A-Z])/g, "$1 $2") },
            { value: Hacienda, name: Hacienda.name.replace(/([a-z])([A-Z])/g, "$1 $2") },
            { value: SmallWarehouse, name: SmallWarehouse.name.replace(/([a-z])([A-Z])/g, "$1 $2") },
            { value: LargeIndigoPlant, name: LargeIndigoPlant.name.replace(/([a-z])([A-Z])/g, "$1 $2") },
            { value: LargeSugarMill, name: LargeSugarMill.name.replace(/([a-z])([A-Z])/g, "$1 $2") },
            { value: LargeMarket, name: LargeMarket.name.replace(/([a-z])([A-Z])/g, "$1 $2") },
            { value: Hospice, name: Hospice.name.replace(/([a-z])([A-Z])/g, "$1 $2") },
            { value: Office, name: Office.name.replace(/([a-z])([A-Z])/g, "$1 $2") },
            { value: LargeWarehouse, name: LargeWarehouse.name.replace(/([a-z])([A-Z])/g, "$1 $2") },
            { value: TobaccoStorage, name: TobaccoStorage.name.replace(/([a-z])([A-Z])/g, "$1 $2") },
            { value: CoffeeRoaster, name: CoffeeRoaster.name.replace(/([a-z])([A-Z])/g, "$1 $2") },
            { value: Factory, name: Factory.name.replace(/([a-z])([A-Z])/g, "$1 $2") },
            { value: University, name: University.name.replace(/([a-z])([A-Z])/g, "$1 $2") },
            { value: Harbor, name: Harbor.name.replace(/([a-z])([A-Z])/g, "$1 $2") },
            { value: Wharf, name: Wharf.name.replace(/([a-z])([A-Z])/g, "$1 $2") },
            { value: Residence, name: Residence.name.replace(/([a-z])([A-Z])/g, "$1 $2") },
            { value: CityHall, name: CityHall.name.replace(/([a-z])([A-Z])/g, "$1 $2") },
            { value: CustomsHouse, name: CustomsHouse.name.replace(/([a-z])([A-Z])/g, "$1 $2") },
            { value: Fortress, name: Fortress.name.replace(/([a-z])([A-Z])/g, "$1 $2") },
            { value: GuildHall, name: GuildHall.name.replace(/([a-z])([A-Z])/g, "$1 $2") },
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