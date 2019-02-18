import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className="square" onClick={props.onClick} style={props.isHighLight ? { color: 'red' } : null}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return <Square key={'square' + i} value={this.props.squares[i]}
            onClick={this.props.onClick.bind(this, i)} isHighLight={this.props.winnerLine && this.props.winnerLine.includes(i)} />;
    }

    render() {
        let squares = [], rows = [];
        for (let i = 0; i < 3; i++) {
            rows = [];
            for (let j = i * 3; j < 3 + i * 3; j++) {
                rows.push(this.renderSquare(j));
            }
            squares.push(
                <div className="board-row" key={'row' + i}>{rows}</div>
            )
        }
        return (
            <div>
                {squares}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor() {
        super();
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                lastStep: 'Game Start'
            }],
            stepNumber: 0,
            xIsNext: true,
            isSort: false,
        }
        this.sortList = this.sortList.bind(this);
    }
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        const desc = squares[i] + ' moved to ' + '(' + (Math.floor(i / 3) + 1) + ',' + (i % 3 + 1) + ')';
        this.setState({
            history: history.concat([{
                squares: squares,
                lastStep: desc,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) ? false : true,
        })
    }
    sortList() {
        this.setState({
            isSort: !this.state.isSort,
        })
    }
    render() {
        let history = this.state.history.slice();
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        let winnerLine = null;
        if (this.state.isSort) {
            history.reverse();
        }
        const moves = history.map((step, move, oldArr) => {
            let index = this.state.isSort ? oldArr.length - 1 - move : move; // 排序后右边的步数信息混乱，是最难解决的
            return (
                <li key={index}>
                    <a href="#" onClick={this.jumpTo.bind(this, index)} style={this.state.stepNumber === index ? { fontWeight: 'bold' } : null}>{step.lastStep}</a>
                </li>
            )
        })

        let status;
        if (winner) {
            status = 'Winner: ' + winner.winner;
            winnerLine = winner.line;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={current.squares}
                        onClick={this.handleClick.bind(this)} winnerLine={winnerLine} />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <button onClick={this.sortList}>sort</button>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {
                winner: squares[a],
                line: lines[i]
            };
        }
    }
    return null;
}