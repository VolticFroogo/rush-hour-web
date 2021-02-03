import React from 'react';
import './Solution.css';
import Game from '../Solver/Game';
import Position from '../Solver/Position';

class SolutionState {
    game: Game | undefined;
    solution: Position | null | undefined;
}

class Solution extends React.Component<any, SolutionState> {
    constructor(props: any) {
        super(props);

        this.state = {
            game: undefined,
            solution: undefined,
        }
    }

    public render(): JSX.Element {
        let steps: JSX.Element[] = [];

        if (this.state.solution !== undefined && this.state.solution !== null) {
            this.state.solution.history.forEach((value: number) => {
                const carID = value >> 4;
                const pos = value & 0xF;

                steps.push(
                    <li>{ carID < 12 ? 'Car' : 'Truck' } #{carID < 12 ? carID : carID - 12 + 1} to {pos + 1}</li>
                );
            });
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
                        <ol>{ steps }</ol>
                    }
                </div>
            </section>
        );
    }

    private onClickComputeSolution(): void {
        const game = new Game();
        const solution = game.solve();

        this.setState({
            game: game,
            solution: solution,
        });
    }
}

export default Solution;
