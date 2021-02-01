import React from 'react';
import './Colours.css';
import './App.css';
import Navbar from './Navbar/Navbar';
import Board from './Board/Board';
import CarPool from './Car/CarPool';

function App() {
    return (
        <div className="App">
            <Navbar/>
            <div className="Horizontal">
                <CarPool/>
                <Board/>
            </div>
        </div>
    );
}

export default App;
