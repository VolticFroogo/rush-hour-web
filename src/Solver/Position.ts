import Game from './Game';
import Long from 'long';

class Position {
    cars: Long;
    bitmap: Long;
    history: Uint8Array;

    constructor(cars: Long, bitmap?: Long, history?: Uint8Array) {
        this.cars = cars;

        if (bitmap === undefined)
            this.bitmap = new Long(0);
        else
            this.bitmap = bitmap;

        if (history === undefined)
            this.history = new Uint8Array();
        else
            this.history = history;
    }

    public setup(carOrientations: Uint8Array) {
        for (let i = 0; i < 16; i++) {
            const pos = this.cars.shiftRight(i * 3).and(0x7).toNumber();

            // If the car is off the grid, skip.
            // This is an error check, but also allows for cars to be manually skipped.
            // In which case their position should be 0x7 (111).
            if (pos >= 6)
                continue;

            this.bitmap = this.bitmap.or(Position.positionsToBitmask(pos, carOrientations[i]));
            this.bitmap = this.bitmap.or(Position.positionsToBitmask(pos + 1, carOrientations[i]));

            if (i >= 12)
                this.bitmap = this.bitmap.or(Position.positionsToBitmask(pos + 2, carOrientations[i]));
        }
    }

    public step(game: Game): Position | null {
        for (let i = 0; i < 16; i++) {
            const pos = this.cars.shiftRight(i * 3).and(0x7).toNumber();

            // If the car is off the grid, skip.
            if (pos >= 6)
                continue;

            for (let j = pos - 1; j >= 0; j--) {
                const result = this.check(game, pos, game.carOrientations[i], 0, i, j);
                if (result.shouldBreak)
                    break;

                if (result.solution !== undefined)
                    return result.solution;
            }

            // If the car is a truck, give make it have an extra width.
            const width = i < 12 ? 1 : 2;

            for (let j = pos + 1; j < 6 - width; j++) {
                const result = this.check(game, pos, game.carOrientations[i], width, i, j);
                if (result.shouldBreak)
                    break;

                if (result.solution !== undefined)
                    return result.solution;
            }
        }

        return null;
    }

    private check(game: Game, pos: number, orientation: number, width: number, i: number, j: number): {shouldBreak: boolean, solution?: Position} {
        // If there is a car blocking us from moving here, break.
        if (this.bitmap.and(Position.positionsToBitmask(j + width, orientation)).notEquals(0))
            return {shouldBreak: true};

        // Get the new car position.
        const cars = this.cars.and(new Long(0x7).shiftLeft(i * 3).not()).or(new Long(j).shiftLeft(i * 3));

        // If we have already computed this position before, skip.
        if (game.seen.has(cars.toNumber()))
            return {shouldBreak: false};

        // Add this position to seen.
        game.seen.add(cars.toNumber());

        const history = new Uint8Array(this.history.length + 1);
        for (let k = 0; k < this.history.length; k++)
            history[k] = this.history[k];
        history[this.history.length] = (i << 4) | j;

        const position = new Position(cars, this.bitmap, history);

        // Clear the bits where the car was.
        position.bitmap = position.bitmap.and(Position.positionsToBitmask(pos, orientation).not());
        position.bitmap = position.bitmap.and(Position.positionsToBitmask(pos + 1, orientation).not());
        // If the car is a truck, clear a third bit.
        if (i >= 12)
            position.bitmap = position.bitmap.and(Position.positionsToBitmask(pos + 2, orientation).not());

        // Add the new car's position to the bitmap.
        position.bitmap = position.bitmap.or(Position.positionsToBitmask(j, orientation));
        position.bitmap = position.bitmap.or(Position.positionsToBitmask(j + 1, orientation));
        // If the car is a truck, add a third bit.
        if (i >= 12)
            position.bitmap = position.bitmap.or(Position.positionsToBitmask(j + 2, orientation));

        // If the position is solved, return it.
        if (position.isSolved())
            return {shouldBreak: false, solution: position};

        // Add this new position to the queue of positions to check.
        game.positions.push(position);
        return {shouldBreak: false};
    }

    private static positionsToBitmask(pos: number, orientation: number): Long {
        if ((orientation & 0x8) === 0)
            return new Long(1).shiftLeft(pos + (orientation & 0x7) * 6);

        return new Long(1).shiftLeft((orientation & 0x7) + pos * 6);
    }

    private isSolved(): boolean {
        for (let i = (this.cars.and(0x7).toNumber()) + 2; i < 6; i++)
            if (this.bitmap.and(new Long(1).shiftLeft(i + 6 * 3)).notEquals(0))
                return false;

        return true;
    }

    public reverseHistory(to: number, cars: Long): {cars: Long, dummyCar: {id: number, pos: number}} {
        for (let i = 0; i < to; i++) {
            const carID = (this.history[i] >> 4) * 3;
            const pos = this.history[i] & 0xF;

            cars = cars.and(new Long(0x7).shiftLeft(carID).not()).or(new Long(pos).shiftLeft(carID));
        }

        return {cars: cars, dummyCar: {
            id: this.history[to] >> 4,
            pos: this.history[to] & 0xF,
        }};
    }
}

export default Position;
