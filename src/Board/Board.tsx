import React from 'react';
import './Board.css';

class Board extends React.Component {
    static instance: Board;

    myRef: React.RefObject<HTMLDivElement>;
    columnsRef: React.RefObject<HTMLDivElement>;

    constructor(props: {} | Readonly<{}>) {
        super(props);
        Board.instance = this;
        this.myRef = React.createRef();
        this.columnsRef = React.createRef();
    }

    render() {
        return (
            <div id="Board" ref={this.myRef}>
                <div className="Title">Board</div>
                <div ref={this.columnsRef}>
                    <Column/>
                    <Column/>
                    <Column/>
                    <Column/>
                    <Column/>
                    <Column exit={true}/>
                </div>
            </div>
        );
    }
}

function Column(props: {exit?: boolean}) {
    return (
        <div className="Column">
            <Tile/>
            <Tile/>
            <Tile exit={props.exit}/>
            <Tile/>
            <Tile/>
            <Tile/>
        </div>
    );
}

function Tile(props: {exit?: boolean}) {
    return (
        <div>
            <div className="Tile">
                { props.exit &&
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-arrow-narrow-right"
                         width="3vw" height="3vw" viewBox="0 0 24 24" stroke-width="1.5" stroke="var(--background)" fill="none"
                         stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                        <line x1="15" y1="16" x2="19" y2="12"/>
                        <line x1="15" y1="8" x2="19" y2="12"/>
                    </svg>
                }
            </div>
            { props.exit &&
                <div className="TileBorderBlocker"/>
            }
        </div>
    );
}

export default Board;
