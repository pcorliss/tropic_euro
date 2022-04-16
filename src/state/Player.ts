import { Board } from "./Board";

export class Player {
    name: string;
    victoryPoints: 0;
    doubloons: 0;
    goods: Record<string, number>;
    board: Board;

    constructor(name: string) {
        this.name = name;
        this.board = new Board();
    }
}