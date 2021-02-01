import React from 'react';
import './CarSlot.css';
import CarProps from './CarProps';
import Car from './Car';

function CarSlot(props: CarProps) {
    const carStyles = {
        width: props.truck ? "calc(11vw + 20px)" : "calc(7vw + 10px)",
    };

    return (
        <div className="CarSlot" style={carStyles}>
            <Car colour={props.colour} truck={props.truck}/>
        </div>
    );
}

export default CarSlot;
