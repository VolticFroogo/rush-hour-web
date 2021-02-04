import React from 'react';
import './Solution.css';
import Game from '../Solver/Game';
import Position from '../Solver/Position';
import Car from '../Car/Car';
import Long from 'long';

class SolutionState {
    game: Game | undefined;
    start: Long | undefined;
    solution: Position | null | undefined;
    fakeCarTruck: boolean = false;
    fakeCarColour: string = "#000000";
    fakeCarVertical: boolean = false;
    fakeCarPos?: {x: number, y: number};
    active: number = -1;
}

class Solution extends React.Component<any, SolutionState> {
    static instance: Solution;

    constructor(props: any) {
        super(props);

        Solution.instance = this;

        this.state = {
            game: undefined,
            start: undefined,
            solution: undefined,
            fakeCarTruck: false,
            fakeCarColour: "#000000",
            fakeCarVertical: false,
            fakeCarPos: {x: -1, y: -1},
            active: -1,
        }
    }

    public render(): JSX.Element {
        let steps: JSX.Element[] = [];

        if (this.state.solution !== undefined && this.state.solution !== null) {
            for (let i = 0; i < this.state.solution.history.length; i++) {
                const carID = this.state.solution.history[i] >> 4;
                const pos = this.state.solution.history[i] & 0xF;
                const colour = Car.cars[carID].props.colour;

                steps.push(
                    <li className={(i === this.state.active ? "Active" : "")} onClick={() => this.onClickStep(i)}><span style={{color: colour}}>{ carID < 12 ? 'Car' : 'Truck' } #{(carID < 12 ? carID : carID - 12) + 1}</span> to {pos + 1}</li>
                );
            }
        }

        return (
            <section id="Solution">
                <div className="Title">Solution</div>
                <div className="ButtonWrapper">
                    <button className="SolveButton" onClick={() => this.onClickComputeSolution()}>Compute Solution</button>
                </div>
                <div className="Divider"/>
                <div className="Steps">
                    <div className="StepsTitle">Steps</div>
                    { this.state.game === undefined &&
                        <div className="Text">Press the "Compute Solution" button to calculate the steps.</div>
                    }
                    { this.state.solution === null &&
                        <div className="Text">Impossible game...</div>
                    }
                    { steps.length !== 0 &&
                        <div>
                            <ol>{ steps }</ol>
                            <div className="StepButtons">
                                <button disabled={this.state.active <= 0} onClick={() => this.onClickStep(this.state.active - 1)}>Previous Step</button>
                                <button disabled={this.state.active >= (this.state.solution as Position).history.length - 1} onClick={() => this.onClickStep(this.state.active + 1)}>Next Step</button>
                            </div>
                        </div>
                    }
                </div>
                <div>
                    <Car fakeCar={true} truck={this.state.fakeCarTruck} colour={this.state.fakeCarColour} vertical={this.state.fakeCarVertical} pos={this.state.fakeCarPos}/>
                </div>
            </section>
        );
    }

    private onClickComputeSolution(): void {
        const game = new Game();
        const position = game.positions[0].cars;
        const solution = game.solve();

        // Add move red car to the exit step.
        if (solution !== null) {
            const history = new Uint8Array(solution.history.length + 1);
            for (let i = 0; i < solution.history.length; i++)
                history[i] = solution.history[i];

            history[solution.history.length] = 0x4;
            solution.history = history;
        }

        this.setState({
            game: game,
            start: position,
            solution: solution,
            fakeCarTruck: false,
            fakeCarColour: "#000000",
            fakeCarVertical: false,
            fakeCarPos: {x: -1, y: -1},
            active: -1,
        }, () => this.onClickStep(0));
    }

    private onClickStep(i: number): void {
        if (this.state.game === undefined || this.state.solution === null || this.state.solution === undefined || this.state.start === undefined)
            return;

        const state = this.state.solution.reverseHistory(i, this.state.start);

        for (let i = 0; i < 16; i++) {
            const car = Car.cars[i];

            if (car.boardPos.x === -1 || car.boardPos.y === -1)
                continue;

            const pos = state.cars.shiftRight(i * 3).and(0x7).toNumber();

            if (car.state.vertical)
                car.boardPos.y = Math.abs(pos - 5);
            else
                car.boardPos.x = pos;

            car.updatePosition();
        }

        const fakeCar = Car.cars[state.dummyCar.id];

        this.setState({
            game: this.state.game,
            start: this.state.start,
            solution: this.state.solution,
            fakeCarTruck: state.dummyCar.id >= 12,
            fakeCarColour: fakeCar.props.colour,
            fakeCarVertical: fakeCar.state.vertical,
            fakeCarPos: {
                x: fakeCar.state.vertical ? fakeCar.boardPos.x : state.dummyCar.pos,
                y: fakeCar.state.vertical ? Math.abs(state.dummyCar.pos - 5) : fakeCar.boardPos.y,
            },
            active: i,
        });
    }

    public carMoved(): void {
        this.setState({
            game: this.state.game,
            start: this.state.start,
            solution: this.state.solution,
            fakeCarTruck: false,
            fakeCarColour: "#000000",
            fakeCarVertical: false,
            fakeCarPos: {x: -1, y: -1},
            active: -1,
        });
    }
}

export default Solution;
