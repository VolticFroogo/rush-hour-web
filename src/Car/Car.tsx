import React from 'react';
import './Car.css';
import CarProps from './CarProps';
import Draggable, { ControlPosition, DraggableData, DraggableEvent } from 'react-draggable';
import Board from '../Board/Board';
import Game from '../Solver/Game';

class CarState {
    position: ControlPosition = {x: 0, y: 0};
    vertical: boolean = false;
}

class Car extends React.Component<CarProps, CarState> {
    myRef: React.RefObject<HTMLDivElement>;
    boardPos: {
        x: number,
        y: number,
    };

    static cars: Car[] = [];

    constructor(props: CarProps) {
        super(props);

        Car.cars.push(this);

        this.state = {
            position: {
                x: 0,
                y: 0,
            },
            vertical: false,
        };

        this.myRef = React.createRef();
        this.boardPos = {
            x: -1,
            y: -1,
        };

        window.addEventListener('resize', () => this.onWindowResize());
    }

    render() {
        const carStyles = {
            width: this.props.truck ? "calc(11vw + 20px)" : "calc(7vw + 10px)",
            backgroundColor: this.props.colour
        };

        return (
            <Draggable
                position={this.state.position}
                onStop={(e: DraggableEvent, data: DraggableData) => this.onDragStop(e, data)}
                onDrag={(e: DraggableEvent, position: ControlPosition) => this.onDrag(e, position)}
            >
                <div>
                    <div className={"Car" + (this.state.vertical ? " Vertical" : "")} style={carStyles} onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => this.onKeyDown(e)} tabIndex={0} ref={this.myRef}/>
                </div>
            </Draggable>
        );
    }

    onDrag(e: DraggableEvent, position: ControlPosition) {
        this.setState({
            position: position,
            vertical: this.state.vertical,
        });
    };

    onDragStop(e: DraggableEvent, data: DraggableData) {
        if (Board.instance.myRef.current === null)
            return;

        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) / 100;

        const boardRect = Board.instance.myRef.current.getBoundingClientRect();
        const carRect = (data.node.firstChild as HTMLElement).getBoundingClientRect();

        let carX: number;
        let carY: number;

        if (this.state.vertical) {
            carX = (carRect.left + carRect.right) / 2;
            carY = carRect.bottom - vw * 2;
        } else {
            carX = carRect.left + vw * 2;
            carY = (carRect.top + carRect.bottom) / 2;
        }

        if (
            carX >= boardRect.left &&
            carX <= boardRect.right &&
            carY >= boardRect.top &&
            carY <= boardRect.bottom
        ) {
            this.moveOnBoard(carX, carY);
        } else {
            this.resetPosition();
        }

        const game = new Game();
        console.log(game);
        console.log(game.solve());
    }

    onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
        if (e.key !== "r" && e.key !== "R")
            return;

        this.setState({
            position: this.state.position,
            vertical: !this.state.vertical,
        });
    }

    onWindowResize() {
        this.updatePosition();
    }

    resetPosition() {
        this.boardPos.x = -1;
        this.boardPos.y = -1;

        this.setState({
            position: {
                x: 0,
                y: 0,
            },
            vertical: false,
        });
    }

    moveOnBoard(carX: number, carY: number) {
        if (Board.instance.columnsRef.current === null)
            return;

        let nearest = Infinity;
        let x: number = 0;

        let i = 0;
        Board.instance.columnsRef.current.childNodes.forEach(node => {
            const rect = (node as HTMLElement).getBoundingClientRect();
            const delta = Math.abs((rect.left + rect.right) / 2 - carX);

            if (delta < nearest) {
                x = i;
                nearest = delta;
            }

            i++;
        });

        nearest = Infinity;
        let y: number = 0;

        i = 0;
        (Board.instance.columnsRef.current.firstChild as HTMLElement).childNodes.forEach(node => {
            const rect = (node as HTMLElement).getBoundingClientRect();
            const delta = Math.abs((rect.top + rect.bottom) / 2 - carY);

            if (delta < nearest) {
                y = i;
                nearest = delta;
            }

            i++;
        });

        this.boardPos.x = x;
        this.boardPos.y = y;
        this.updatePosition();
    }

    updatePosition() {
        if (this.myRef.current === null)
            return;

        if (this.boardPos.x === -1 || this.boardPos.y === -1)
            return;

        const column = (Board.instance.columnsRef.current as HTMLElement).childNodes.item(this.boardPos.x);
        const tile = column.childNodes.item(this.boardPos.y);
        const tileRect = (tile as HTMLElement).getBoundingClientRect();
        const parentRect = ((this.myRef.current.parentElement as HTMLElement).parentElement as HTMLElement).getBoundingClientRect();

        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) / 100;

        this.setState({
            position: {
                x: this.state.vertical
                    ? (this.props.truck
                        ? tileRect.x - parentRect.x - vw * 3.5 - 5
                        : tileRect.x - parentRect.x - vw * 1.5)
                    : tileRect.x - parentRect.x + vw * 0.5 + 5,
                y: this.state.vertical
                    ? (this.props.truck
                        ? tileRect.y - parentRect.y - vw * 3.5 - 10
                        : tileRect.y - parentRect.y - vw * 1.5 - 5)
                    : tileRect.y - parentRect.y + vw / 2,
            },
            vertical: this.state.vertical,
        });
    }
}

export default Car;
