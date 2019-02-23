import React from 'react';
import './Othello.css';

function setSquareSize(columnsNumber) {
  let baseSize = Math.min(window.innerWidth,window.innerHeight);
  return (baseSize*3/4)/(columnsNumber+5);
}

function Square(props) {
  let fill_in_class = `fas fa-circle ${props.value}`;
  let fill_in = (props.value) ? <i class={fill_in_class}></i> : props.value;
    return (<button
      className="ot-square"
      onClick={props.onClick}
      style={{
        width: setSquareSize(props.columnsNumber),
        height: setSquareSize(props.columnsNumber),
        'font-size': setSquareSize(props.columnsNumber)/2,
    }}> {fill_in}
    </button>);
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      values: Array(this.totalSize).fill(false),
      emptySquaresNumber: 0,
    };
  }

  reloadBoard() {
    this.setState({
      values: Array(this.totalSize).fill(false),
      emptySquaresNumber: 0,
    });
    this.props.reloaded();
  }

  handleClick(i, emptySquaresNumber) {
    let values = this.state.values;
    values[i] = 'white';
    if(emptySquaresNumber.esn === this.props.length*this.props.width - this.props.bombsNumber) {
      this.props.setWin();
    }
    this.setState({values: values});
  }

  renderSquare(i) {
    return (
            <Square
              value={this.state.values[i]}
              onClick={() => this.handleClick(i, {esn: this.state.emptySquaresNumber})}
              columnsNumber={this.props.width}
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
      length: 10,
      width: 10,
      reload: true,
    };
  }

  setReloaded() {
    this.setState({reload: false});
  }

  renderGameInfo(winStatus, loseStatus) {
    return (
      (loseStatus) ?
        (<h2
          className="ot-lose"
          style={{'font-size': window.innerWidth/30,}}
        >Game Over!!!
        </h2>) :

      (winStatus) ?
        (<h2
          className="ot-win"
          style={{'font-size': window.innerWidth/20,}}
        >YOU WON!!!
        </h2>) :

        (<h4 
          style={{'font-size': window.innerWidth/50}}
        >There are still mines for detection ...
        </h4>)
    );
  }
    
  setBoardSize() {
    let length = Number(prompt('Length: (1-60)'));
    if (!length || length < 1) length = 10;
    if (length > 100) length = 60;

    let width = Number(prompt('Width: (3-60)'));
    if (!width || width < 3) width = 10;
    if (width > 100) width = 60;

    this.setState({
      length: length,
      width: width,
      reload: true,
    });
  }

  resetBoard() {
    this.setState({
      loseStatus: false,
      reload: true,
    });
  }

  render() {
    return (
      <div className="ot-game">
        <div className="ot-game-board">

          <div>
            <button
              className="flag-pick ot-top-clicks"
              onClick = {() => this.flagPick()}
              style={{width: setSquareSize(this.state.width), height: setSquareSize(this.state.width), 'font-size': setSquareSize(this.state.width)/3}}
            ><i className="fab fa-font-awesome-flag"></i>
            </button>
            <button
              className="flags-number ot-top-clicks"
              style={{width: setSquareSize(this.state.width), height: setSquareSize(this.state.width), 'font-size': setSquareSize(this.state.width)/3}}
            > {this.state.flagsRemainder}
            </button>
          </div>

          <Board
            values={this.state.values}
            length={this.state.length}
            width={this.state.width}
            bombsNumber={this.state.bombsNumber}
            setWin={() => this.setWin()}
            setLose={() => this.setLose()}
            reload={this.state.reload}
            reloaded={() => this.setReloaded()}
            flag={this.state.flag}
            flagPut={() => this.flagPut()}
            setFlagsNumber={(flagsNumber) => this.setFlagsNumber(flagsNumber)}
          />

          <div>
            <button
              className="ot-set-board ot-down-clicks"
              onClick = {() => this.setBoardSize()}
              style={{width: 3*setSquareSize(this.state.width), height: setSquareSize(this.state.width), 'font-size': setSquareSize(this.state.width)/4}}
            >Manange Board
            </button>
            <button
              className="ot-reset-board ot-down-clicks"
              onClick = {() => this.resetBoard()}
              style={{width: setSquareSize(this.state.width), height: setSquareSize(this.state.width), 'font-size': setSquareSize(this.state.width)/4}}
            ><i className="fas fa-undo"></i>
            </button>
          </div>

        </div>

        <div className="ot-game-info">
          {this.renderGameInfo(this.state.winStatus, this.state.loseStatus)}
        </div>
      </div>
    );
  }
}

export default Othello;