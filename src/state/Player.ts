import { Board } from "./Board";

export class Player {
    name: string;
    victoryPoints = 0;
    doubloons = 0;
    goods: Record<"corn" | "indigo" | "sugar" | "tobacco" | "coffee", number> = {
        corn: 0,
        indigo: 0,
        sugar: 0,
        tobacco: 0,
        coffee: 0,
    };
    board: Board;

    constructor(name: string) {
        this.name = name;
        this.board = new Board();
    }
}