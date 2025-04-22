import React from 'react';
import './Navbar.css';

function Navbar() {
    return (
        <div className="Navbar">
            <div className="Title">Rush Hour Solver</div>
            {/* eslint-disable-next-line */}
            <div className="Credit">by <a href="https://froogo.co.uk/" target="_blank" data-umami-event="click-link-froogo">Harry</a></div>
            {/* eslint-disable-next-line */}
            <div className="Source"><a href="https://github.com/VolticFroogo/rush-hour-web" target="_blank" data-umami-event="click-link-github">Check out the source code on GitHub</a></div>
        </div>
    );
}

export default Navbar;
