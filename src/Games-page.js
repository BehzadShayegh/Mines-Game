import React from 'react';
import MinesDetect from './Mines-detect.js';
import TicTacToe from './Tic-tac-toe.js';
import Puzzle from './Puzzle.js';
import './Games-page.css';

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gamesList: ["Mines Detect","Tic Tac Toe","Puzzle","Ready to Deploy"],
    };
  }

  renderGameChoices() {
    let gameChoices = Array(this.state.gamesList.length);
    for (let index = 0; index < gameChoices.length; index++) {
      gameChoices[index] = this.renderGameChoice(this.state.gamesList[index]);
    }
    return (
      <div class="list">
        <h5>Games</h5>
        {gameChoices}
      </div>
    );
  }
  renderGameChoice(gameName) {
    let choiceBoxClass = (this.props.runningGame === gameName) ?
      "selected-game-choice-box" : "game-choice-box";
      
    return (
      <div class={choiceBoxClass}>
        <button
          class="game-choice"
          onClick={() => this.props.setGame(gameName)}
        >
          {gameName}
        </button>
      </div>
    );
  }

  render() {
    return (
      <div class="list-table">
        {this.renderGameChoices()}
      </div>
    );
  }
}

class GameKeeper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      runningGame: "Mines Detect",
    };
  }

  selectGame(gameName) {
    if(gameName === "Mines Detect")
      return (
        <div class="mines-detect">
          <MinesDetect/>
        </div>
      );
    else if(gameName === "Tic Tac Toe")
      return (
        <div class="tic-tac-toe">
          <TicTacToe/>
        </div>
      );
    else if(gameName === "Puzzle")
      return (
        <div class="puzzle">
          <Puzzle/>
        </div>
      )
    
    else return (<p class="game-name">{gameName}</p>);
  }

  setGame(gameName) {
    this.setState({runningGame: gameName});
  }

  render() {
    return (
      <div class="under-head">
        <List
          runningGame={this.state.runningGame}
          setGame={(gameName) => this.setGame(gameName)}
        />
        <div class="running-game">
          {this.selectGame(this.state.runningGame)}
        </div>
      </div>
    );
  }
}

export default GameKeeper;