export class Ship {
    spots: number;
    goods: number;
    goodType: string;

    constructor(spots: number) {
        this.spots = spots;
        this.goods = 0;
        this.goodType = null;
    }
}