class GameState {
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
}