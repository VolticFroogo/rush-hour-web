import React from 'react';
import './Colours.css';
import './App.css';
import Navbar from './Navbar/Navbar';
import Board from './Board/Board';
import CarPool from './Car/CarPool';
import Solution from './Solution/Solution';

function App() {
    return (
        <div className="App">
            <Navbar/>
            <div className="Horizontal">
                <CarPool/>
                <Board/>
                <Solution/>
            </div>
        </div>
    );
}

export default App;
