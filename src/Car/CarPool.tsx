import React from 'react';
import './CarPool.css'
import CarSlot from './CarSlot';

function CarPool() {
    return (
        <section className="CarPool">
            <div className="Title">Car park</div>
            <div className="DoubleWidth">
                <div>
                    <CarSlot colour="#F60A05" truck={false}/>
                    <CarSlot colour="#F16A17" truck={false}/>
                    <CarSlot colour="#00966E" truck={false}/>
                    <CarSlot colour="#27B8E7" truck={false}/>
                    <CarSlot colour="#444D1C" truck={false}/>
                    <CarSlot colour="#47B78D" truck={false}/>
                </div>
                <div>
                    <CarSlot colour="#E48E8D" truck={false}/>
                    <CarSlot colour="#48464B" truck={false}/>
                    <CarSlot colour="#C4A783" truck={false}/>
                    <CarSlot colour="#3652D7" truck={false}/>
                    <CarSlot colour="#E0D458" truck={false}/>
                    <CarSlot colour="#86463A" truck={false}/>
                </div>
            </div>
            <div className="TruckSlots">
                <CarSlot colour="#BC9FD9" truck={true}/>
                <CarSlot colour="#004BDE" truck={true}/>
                <CarSlot colour="#02D2BE" truck={true}/>
                <CarSlot colour="#FBA70D" truck={true}/>
            </div>
        </section>
    );
}

export default CarPool;
