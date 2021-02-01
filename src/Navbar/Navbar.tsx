import React from 'react';
import './Navbar.css';

function Navbar() {
    return (
        <div className="Navbar">
            <div className="Title">Rush Hour Solver</div>
            {/* eslint-disable-next-line */}
            <div className="Credit">by <a href="https://froogo.co.uk/" target="_blank">Froogo</a></div>
        </div>
    );
}

export default Navbar;
