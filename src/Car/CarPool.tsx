import React from 'react';
import './CarPool.css'
import CarSlot from './CarSlot';

function CarPool() {
    return (
        <section className="CarPool">
            <div className="Title">Car park</div>
            <div className="DoubleWidth">
                <div>
                    <CarSlot colour="#00FF00" truck={false}/>
                    <CarSlot colour="#00FF00" truck={false}/>
                    <CarSlot colour="#00FF00" truck={false}/>
                    <CarSlot colour="#00FF00" truck={false}/>
                    <CarSlot colour="#00FF00" truck={false}/>
                    <CarSlot colour="#00FF00" truck={false}/>
                </div>
                <div>
                    <CarSlot colour="#00FF00" truck={false}/>
                    <CarSlot colour="#00FF00" truck={false}/>
                    <CarSlot colour="#00FF00" truck={false}/>
                    <CarSlot colour="#00FF00" truck={false}/>
                    <CarSlot colour="#00FF00" truck={false}/>
                    <CarSlot colour="#00FF00" truck={false}/>
                </div>
            </div>
            <div className="TruckSlots">
                <CarSlot colour="#00FF00" truck={true}/>
                <CarSlot colour="#00FF00" truck={true}/>
                <CarSlot colour="#00FF00" truck={true}/>
                <CarSlot colour="#00FF00" truck={true}/>
            </div>
        </section>
    );
}

export default CarPool;
