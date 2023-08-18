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
            <section id="Board" ref={ this.myRef }>
                <div className="Title">
                    Board -
                    <a className="Title Right" target="_blank" rel="noreferrer"
                       href="https://www.amazon.co.uk/s?k=rush+hour+puzzle+game&_encoding=UTF8&tag=froogo09-21&linkCode=ur2&linkId=d83c5a7b9fd1c68a04ace66acfbfde2a&camp=1634&creative=6738">
                        Get your own Rush Hour!
                    </a>
                </div>
                <div ref={ this.columnsRef }>
                    <Column/>
                    <Column/>
                    <Column/>
                    <Column/>
                    <Column/>
                    <Column exit={ true }/>
                </div>
            </section>
        );
    }
}

function Column(props: { exit?: boolean }) {
    return (
        <div className="Column">
            <Tile/>
            <Tile/>
            <Tile exit={ props.exit }/>
            <Tile/>
            <Tile/>
            <Tile/>
        </div>
    );
}

function Tile(props: { exit?: boolean }) {
    return (
        <div>
            <div className="Tile">
                { props.exit &&
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-arrow-narrow-right"
                         width="3vw" height="3vw" viewBox="0 0 24 24" strokeWidth="1.5" stroke="var(--background)"
                         fill="none"
                         strokeLinecap="round" strokeLinejoin="round">
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
