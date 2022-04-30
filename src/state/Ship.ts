import { Good } from "./Good";
export class Ship {
    spots: number;
    goods: number;
    goodType: Good;
    size: string;

    constructor(spots: number, size?: string) {
        this.spots = spots;
        this.goods = 0;
        this.goodType = null;
        this.size = size;
    }

    full(): boolean {
        return this.goods >= this.spots;
    }

    empty(): boolean {
        return this.goods == 0;
    }
}