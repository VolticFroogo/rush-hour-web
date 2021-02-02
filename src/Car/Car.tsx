import React from 'react';
import './Car.css';
import CarProps from './CarProps';
import Draggable, { ControlPosition, DraggableData, DraggableEvent } from 'react-draggable';
import Board from '../Board/Board';

class CarState {
    position?: ControlPosition;
}

class Car extends React.Component<CarProps, CarState> {
    constructor(props: CarProps) {
        super(props);

        this.state = {
            position: {
                x: 0,
                y: 0,
            }
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
                <div className="Car" style={carStyles}/>
            </Draggable>
        );
    }

    onDrag(e: DraggableEvent, position: ControlPosition) {
        this.setState({
            position: position,
        });
    };

    onDragStop(e: DraggableEvent, data: DraggableData) {
        if (Board.instance.myRef.current === null)
            return;

        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) / 100;

        const boardRect = Board.instance.myRef.current.getBoundingClientRect();
        const carRect = data.node.getBoundingClientRect();

        const carX = carRect.left + vw * 2;
        const carY = (carRect.top + carRect.bottom) / 2;

        if (
            carX >= boardRect.left &&
            carX <= boardRect.right &&
            carY >= boardRect.top &&
            carY <= boardRect.bottom
        ) {

        } else {
            this.resetPosition();
        }
    }

    resetPosition() {
        this.setState({
            position: {
                x: 0,
                y: 0,
            },
        });
    }
}

export default Car;
