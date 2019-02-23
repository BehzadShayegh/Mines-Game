import React from 'react';
import './Othello.css';

function setSquareSize(columnsNumber) {
  let baseSize = Math.min(window.innerWidth,window.innerHeight);
  return (baseSize*3/4)/(columnsNumber+5);
}

function findNumberOf(element, array) {
  let n = 0;
  for (const iterator of array) {
    if(iterator === element) n++;
  }
  return n;
}

function Square(props) {
  let fill_in_class = `fas fa-circle ot-${props.value}`;
  let onClick_fill_in_class = `fas fa-circle ot-${props.player}-onClick-square`;
  let fill_in = (props.value) ? <i class={fill_in_class}></i> : props.value;
  return (props.act) ?
    (<button
      className="ot-square ot-onClick-square"
      onClick={props.onClick}
      style={{
        width: setSquareSize(props.columnsNumber),
        height: setSquareSize(props.columnsNumber),
        'font-size': setSquareSize(props.columnsNumber)/2,
    }}> <i class={onClick_fill_in_class}></i>
    </button>)
     :
    (<button
      className="ot-square"
      style={{
        width: setSquareSize(props.columnsNumber),
        height: setSquareSize(props.columnsNumber),
        'font-size': setSquareSize(props.columnsNumber)/2,
    }}> {fill_in}
    </button>);
}

function defaultValues(width) {
  let size = width**2;
  let defaultValues = Array(size).fill(false);
  defaultValues[size/2+width/2] = 'white';
  defaultValues[size/2+width/2-1] = 'black';
  defaultValues[size/2-width/2] = 'black';
  defaultValues[size/2-width/2-1] = 'white';

  return defaultValues;
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      values: defaultValues(this.props.width),
      player: 'white',
    };
  }

  reloadBoard() {
    this.setState({
      values: defaultValues(this.props.width),
      player: 'white',
    });
    this.props.reloaded();
  }

  checkPossible() {
    let possible = false;
    for (let index = 0; index < this.props.width**2; index++) {
      if(this.findAct(index, this.state.player).length !== 0) {
        possible = true;
        break;
      }
    }
    if (!possible) {
      let nextPlayer = (this.state.player === 'white') ? 'black' : 'white';
      let deepPossible = false;
      for (let index = 0; index < this.props.width**2; index++) {
        if(this.findAct(index, nextPlayer).length !== 0) {
          deepPossible = true;
          break;
        }
      }
      if (deepPossible)
        this.nextPlayer();
    }
  }

  nextPlayer() {
    let nextPlayer;
    if (this.state.player === 'white')
      nextPlayer = 'black';
    else
      nextPlayer = 'white';
    this.setState({player: nextPlayer});
  }

  changeColor(newColor, squares) {
    let values = this.state.values;
    for (let square of squares) {
      values[square] = newColor;
    }
    this.setState({values: values});
  }

  handleClick(act) {
    this.changeColor(this.state.player, act)
    this.nextPlayer();
  }

  checkGuardAcc(i, step) {
    if (step === -this.props.width+1 || step === +1 || step === +this.props.width+1)
      if (i%this.props.width === this.props.width-1)
        return false;
    if (step === -this.props.width-1 || step === -1 || step === +this.props.width-1)
      if (i%this.props.width === 0)
        return false;
    return true;
  }

  makeStep(act, i, step, player) {
    if (!this.state.values[i]) return false;
    if (this.state.values[i] === player)
      return true;
    if (!this.checkGuardAcc(i, step))
      return false;
    if (this.makeStep(act, i+step, step, player)){
      act.push(i);
      return true;
    }
    return false;
  }

  findAct(i, player) {
    if(this.state.values[i]) return []
    let act = [];
    if (this.state.values[i-this.props.width-1])
      this.makeStep(act, i-this.props.widthpush_back-1, -this.props.widthpush_back-1, player);
    if (this.state.values[i-this.props.width])
      this.makeStep(act, i-this.props.width, -this.props.width, player);
    if (this.state.values[i-this.props.width+1])
      this.makeStep(act, i-this.props.width+1, -this.props.width+1, player);
    if (this.state.values[i+1])
      this.makeStep(act, i+1, +1, player);
    if (this.state.values[i+this.props.width+1])
      this.makeStep(act, i+this.props.width+1, +this.props.width+1, player);
    if (this.state.values[i+this.props.width])
      this.makeStep(act, i+this.props.width, +this.props.width, player);
    if (this.state.values[i+this.props.width-1])
      this.makeStep(act, i+this.props.width-1, +this.props.width-1, player);
    if (this.state.values[i-1])
      this.makeStep(act, i-1, -1, player);
    if (act.length) act.push(i);
    return act;
  }

  renderSquare(i) {
    let act = this.findAct(i, this.state.player);
    return (
      <Square
        value={this.state.values[i]}
        onClick={() => this.handleClick(act)}
        columnsNumber={this.props.width}
        act={act.length}
        player={this.state.player}
      />
    );
  }

  renderRow(i, width) {
    let row = Array(width);
    for(let column=0; column<width; column++)
      row[column] = this.renderSquare(i*width+column);
   
    return (
      <div className="ot-board-row">
        <button
          className="ot-square ot-gurd"
          style={{width: setSquareSize(width), height: setSquareSize(width)}}
        />
        {row}
        <button
          className="ot-square ot-gurd"
          style={{width: setSquareSize(width), height: setSquareSize(width)}}
        />
      </div>
    );
  }

  renderGurdRow(width) {
    let row = Array(width+2).fill(
                <button
                  className="ot-square ot-gurd"
                  style={{width: setSquareSize(width), height: setSquareSize(width)}}
                />);
    return (
      <div className="ot-board-row">
        {row}
      </div>
    )
  }

  render() {
    let length = this.props.length;
    let width = this.props.width;
    let rows = Array(length);

    if(this.props.reload) this.reloadBoard();

    this.checkPossible();

    let whiteNumber = findNumberOf('white', this.state.values);
    let blackNumber = findNumberOf('black', this.state.values);

    if(whiteNumber !== this.props.whiteNumber)
      this.props.setWhiteNumber(whiteNumber);
    if(blackNumber !== this.props.blackNumber)
      this.props.setBlackNumber(blackNumber);

    for(let row=0; row<length; row++)
      rows[row] = this.renderRow(row,width);

    return (
      <div>
        {this.renderGurdRow(width)}
        {rows}
        {this.renderGurdRow(width)}
      </div>
    );
  }
}


class Othello extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      length: 8,
      width: 8,
      reload: true,
      whiteNumber: 0,
      blackNumber: 0,
    };
  }

  setReloaded() {
    this.setState({reload: false});
  }

  renderGameInfo() {
    let win = ((this.state.whiteNumber+this.state.blackNumber) === (this.state.length*this.state.width))
    let winMessage = (this.state.whiteNumber===this.state.blackNumber) ? `Tie . . . ${this.state.whiteNumber}` :
                    (this.state.whiteNumber>this.state.blackNumber) ? `White Win . . . ${this.state.whiteNumber}` :
                    `Black Win . . . ${this.state.blackNumber}`;
    return win ? 
    (
      <h1 class="win-message">{winMessage}</h1>
    )
    :
    (
      <div>
        <pre class="white-number">White:    {this.state.whiteNumber}</pre>
        <pre class="black-number">Black:    {this.state.blackNumber}</pre>
      </div>
    );
  }
    
  resetBoard() {
    this.setState({
      whiteNumber: 0,
      blackNumber: 0,
      reload: true,
    });
  }

  render() {
    return (
      <div className="ot-game">
        <div className="ot-game-board">

          <Board
            length={this.state.length}
            width={this.state.width}
            reload={this.state.reload}
            reloaded={() => this.setReloaded()}
            setWhiteNumber={(n) => this.setState({whiteNumber: n})}
            setBlackNumber={(n) => this.setState({blackNumber: n})}
            whiteNumber={this.state.whiteNumber}
            blackNumber={this.state.blackNumber}
          />

          <div>
            <button
              className="ot-reset-board ot-down-clicks"
              onClick = {() => this.resetBoard()}
              style={{width: setSquareSize(this.state.width), height: setSquareSize(this.state.width), 'font-size': setSquareSize(this.state.width)/4}}
            ><i className="fas fa-undo"></i>
            </button>
          </div>

        </div>

        <div className="ot-game-info">
          {this.renderGameInfo()}
        </div>
      </div>
    );
  }
}

export default Othello;