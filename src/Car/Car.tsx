import React from 'react';
import './Car.css';
import CarProps from './CarProps';
import Draggable, { ControlPosition, DraggableData, DraggableEvent } from 'react-draggable';
import Board from '../Board/Board';

class CarState {
    position: ControlPosition = {x: 0, y: 0};
    vertical: boolean = false;
}

class Car extends React.Component<CarProps, CarState> {
    constructor(props: CarProps) {
        super(props);

        this.state = {
            position: {
                x: 0,
                y: 0,
            },
            vertical: false
        };
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
                    <div className={"Car" + (this.state.vertical ? " Vertical" : "")} style={carStyles} onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => this.onKeyDown(e)} tabIndex={0}/>
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
            this.moveOnBoard(carX, carY, data, vw);
        } else {
            this.resetPosition();
        }
    }

    onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
        if (e.key !== "r" && e.key !== "R")
            return;

        this.setState({
            position: this.state.position,
            vertical: !this.state.vertical,
        });
    }

    resetPosition() {
        this.setState({
            position: {
                x: 0,
                y: 0,
            },
            vertical: false,
        });
    }

    moveOnBoard(carX: number, carY: number, data: DraggableData, vw: number) {
        if (Board.instance.columnsRef.current === null)
            return;

        let nearest = Infinity;
        let column: HTMLElement | undefined = undefined;
        let x: number = 0;

        let i = 0;
        Board.instance.columnsRef.current.childNodes.forEach(node => {
            const nodeEl = node as HTMLElement;

            const rect = nodeEl.getBoundingClientRect();
            const delta = Math.abs((rect.left + rect.right) / 2 - carX);
            if (delta < nearest) {
                x = i;
                nearest = delta;
                column = nodeEl;
            }

            i++;
        });

        if (column === undefined) {
            this.resetPosition();
            return;
        }

        const columnEl = column as HTMLElement;

        nearest = Infinity;
        let tile: HTMLElement | undefined = undefined;
        let y: number = 0;

        i = 0;
        columnEl.childNodes.forEach(node => {
            const nodeEl = node as HTMLElement;

            const rect = nodeEl.getBoundingClientRect();
            const delta = Math.abs((rect.top + rect.bottom) / 2 - carY);
            if (delta < nearest) {
                y = i;
                nearest = delta;
                tile = nodeEl;
            }

            i++;
        });

        if (tile === undefined) {
            this.resetPosition();
            return;
        }

        const tileEl = tile as HTMLElement;

        const parentEl = data.node.parentElement as HTMLElement;

        const tileRect = tileEl.getBoundingClientRect();
        const parentRect = parentEl.getBoundingClientRect();

        console.log(x, y);

        this.setState({
            position: {
                x: this.state.vertical
                    ? tileRect.x - parentRect.x - vw * 1.5
                    : tileRect.x - parentRect.x + vw - 5,
                y: this.state.vertical
                    ? tileRect.y - parentRect.y - vw * 1.5 - 5
                    : tileRect.y - parentRect.y + vw / 2,
            },
            vertical: this.state.vertical,
        });
    }
}

export default Car;
