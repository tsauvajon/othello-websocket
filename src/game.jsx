import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Board from './board.jsx';
import css from './style.css';
var socket = io();

class Game extends Component {
  constructor() {
    super();
    const squares = Array(64).fill(null);
    squares[27] = squares[36] = 'X';
    squares[28] = squares[35] = 'O';
    this.state = {
      squares: squares,
      xIsNext: true,
      stepNumber: 0,
    };
  }
  handleClick(i) {
    const squares = this.state.squares.slice();
    if (this.state.stepNumber >= 60 || squares[i])
      return;

    var toWololo = this.wololo(i);
    if (toWololo.length === 0)
      return;
    var current = this.state.xIsNext ? 'X' : 'O';
    toWololo.forEach(function(square){
      squares[square] = current;
    });
    squares[i] = current;

    this.setState({
      squares: squares,
      stepNumber: this.state.stepNumber+1,
      xIsNext: !this.state.xIsNext,
    });
  }
  wololo(i){
    var toWololo = Array(0);
    for (var x = -1; x < 2; x++){
      for (var y = -1; y < 2; y++){
        if (x !== 0 || y !== 0){
          toWololo = toWololo.concat(this.wololoLine(i, x, y));
        }
      }
    }
    return toWololo;
  }
  wololoLine(i, xStep, yStep){//, squares){
    const squares = this.state.squares.slice();
    var toWololo = [];
    var found = false;
    var curr = this.state.xIsNext ? 'X' : 'O';
    var x = getX(i) + xStep, y = getY(i) + yStep;
    while (!found && x >= 0 && x < 8 && y >= 0 && y < 8){
      if (!squares[getId(x,y)]){
        return [];
      }
      else if (squares[getId(x,y)] === curr){
        found = true;
      }
      else{
        toWololo.push(getId(x,y));
        x += xStep;
        y += yStep;
      }
    }
    if(found)
      return toWololo;
    return [];
  }
  passTurn(){
    if (this.state.stepNumber > 59)
      return;
    this.setState({ xIsNext: !this.state.xIsNext });
  }
  giveUp(){
    if (this.state.stepNumber > 59)
      return;
    const squares = this.state.squares.slice();
    const fillWith = this.state.xIsNext ? 'O' : 'X';
    for(let i = 0; i < 64; i++)
      if (squares[i] === null)
        squares[i] = fillWith;
    console.log(squares);
    this.setState({ squares: squares, stepNumber: 60 });
  }
  render() {
    const squares = this.state.squares;
    const score = calculateScore(this.state.squares);
    const winner = calculateWinner(score);
    const displayScore = 'X: ' + score.x + ' | O: ' + score.o;
    let status;
    if (winner)
      status = <h1>Winner : { winner }</h1>
    else
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

    return (
      <div className="game" key='game'>
        <div className="game-board" key='game-board'>
          <Board squares={squares} onClick={(i) => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{displayScore}</div>
          <div>{status}</div>
          <button onClick={() => this.passTurn()}>Pass</button>
          <button onClick={() => this.giveUp()}>Give up</button>
        </div>
      </div>
    );
  }
}


// ========================================

function getX(i){
  return i%8;
}

function getY(i){
  return parseInt(i/8, 10);
}

// function getCoord(i){
//   return { x: getX(i), y: getY(i)};
// }

function getId(x, y){
  return y*8+x;
}

function calculateWinner(score) {
  if (score.o + score.x === 64)
    return score.x > score.o ? 'X' : 'O';
  return null
}

function calculateScore(squares){
    var x = 0, o = 0;
    squares.forEach(function(square){
      if (square === 'X')
        x++
      else if (square === 'O')
        o++;
    });
    return { x: x, o: o};
}


ReactDOM.render(<Game />, document.getElementById('othello'));
