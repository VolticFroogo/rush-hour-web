import Position from './Position';
import Car from '../Car/Car';
import Long from 'long';

class Game {
    carOrientations: Uint8Array;
    seen: Set<number>;
    positions: Position[];

    constructor() {
        let cars = new Long(0);
        this.carOrientations = new Uint8Array(16);

        for (let i = 0; i < 16; i++) {
            const car = Car.cars[i * 2 + 1];

            if (car.boardPos.x === -1 || car.boardPos.y === -1) {
                cars = cars.or(new Long(0x7).shiftLeft(i * 3));
                continue;
            }

            const inverseY = Math.abs(car.boardPos.y - 5);

            cars = cars.or(new Long(car.state.vertical ? inverseY : car.boardPos.x).shiftLeft(i * 3));

            this.carOrientations[i] =
                (car.state.vertical ? 0x8 : 0) |
                (car.state.vertical ? car.boardPos.x : inverseY);
        }

        this.seen = new Set<number>();
        this.seen.add(cars.toNumber());

        this.positions = [new Position(cars)];
        this.positions[0].setup(this.carOrientations);
    }

    public solve(): Position | null {
        while (this.positions.length !== 0) {
            const positions = this.positions;
            this.positions = [];

            for (const position of positions) {
                const solution = position.step(this);
                if (solution !== null)
                    return solution;
            }
        }

        return null;
    }
}

export default Game;
