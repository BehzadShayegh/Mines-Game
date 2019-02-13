import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function setSquareSize(columnsNumber) {
  let baseSize = Math.min(window.innerWidth,window.innerHeight);
  return baseSize/(columnsNumber+5);
}

function Square(props) {
    return (props.clicked) ? 
    (<button
      className="square fill"
      style={{
        width: setSquareSize(props.columnsNumber),
        height: setSquareSize(props.columnsNumber),
        'font-size': setSquareSize(props.columnsNumber)/2,
        }}> {props.value} </button>) :
    (<button
      className="square"
      style={{
        width: setSquareSize(props.columnsNumber),
        height: setSquareSize(props.columnsNumber),
        }}
      onClick={props.onClick}
    />);
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clickedSquares: Array(this.totalSize).fill(false),
      emptySquaresNumber: 0,
    };
  }

  reloadBoard() {
    this.setState({
      clickedSquares: Array(this.totalSize).fill(false),
      emptySquaresNumber: 0,
    });
    this.props.reloaded();
  }

  handleClick(i, emptySquaresNumber) {
    if(this.props.values[i]==='*') {
      this.props.setLose();
      this.showAllSquares();      
    }
    else {
      let clickedSquares = this.state.clickedSquares;
      clickedSquares[i] = true;
      emptySquaresNumber.esn++;
      if(this.props.values[i]===' ')
        this.showNeighbours(i, emptySquaresNumber);
        this.setState({clickedSquares: clickedSquares, emptySquaresNumber: emptySquaresNumber.esn});
    }
    if(emptySquaresNumber.esn === this.props.length*this.props.width - this.props.bombsNumber) {
      this.props.setWin();
    }
  }

  showNeighbours(index, emptySquaresNumber) {
    let length = this.props.length;
    let width = this.props.width;
    let totalSize = length*width;
    let clickedSquares = this.state.clickedSquares;

    if(index > width-1         && index%width!==0       && !clickedSquares[index-width-1]) this.handleClick(index-width-1, emptySquaresNumber);
    if(index > width-1                                  && !clickedSquares[index-width]  ) this.handleClick(index-width, emptySquaresNumber)  ;
    if(index > width-1         && index%width!==width-1 && !clickedSquares[index-width+1]) this.handleClick(index-width+1, emptySquaresNumber);
    if(                           index%width!==0       && !clickedSquares[index-1]      ) this.handleClick(index-1, emptySquaresNumber)      ;
    if(                           index%width!==width-1 && !clickedSquares[index+1]      ) this.handleClick(index+1, emptySquaresNumber)      ;
    if(index < totalSize-width && index%width!==0       && !clickedSquares[index+width-1]) this.handleClick(index+width-1, emptySquaresNumber);
    if(index < totalSize-width                          && !clickedSquares[index+width]  ) this.handleClick(index+width, emptySquaresNumber)  ;
    if(index < totalSize-width && index%width!==width-1 && !clickedSquares[index+width+1]) this.handleClick(index+width+1, emptySquaresNumber);
  }

  showAllSquares() {
    let clickedSquares = Array(this.props.length*this.props.width).fill(true);
    this.setState({clickedSquares: clickedSquares});
  }

  renderSquare(i) {
    return (
            <Square
              value={this.props.values[i]}
              clicked={this.state.clickedSquares[i]}
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
      <div className="board-row">
        <button
          class="square gurd"
          style={{width: setSquareSize(width), height: setSquareSize(width)}}
        />
        {row}
        <button
          class="square gurd"
          style={{width: setSquareSize(width), height: setSquareSize(width)}}
        />
      </div>
    )
  }

  renderGurdRow(width) {
    let row = Array(width+2).fill(
                <button
                  class="square gurd"
                  style={{width: setSquareSize(width), height: setSquareSize(width)}}
                />);
    return (
      <div className="board-row">
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

function valueSeter(length, width, bombsNumber) {
  let totalSize = length * width;
  let values = Array(totalSize).fill(false);

  for(let bomb=0; bomb < bombsNumber; bomb++) {
    let randomIndex = Math.floor(Math.random()*totalSize);
    if( values[randomIndex] ) {
      bomb--;
      continue;
    }
    values[randomIndex] = '*';
  }

  for (let index = 0; index < totalSize; index++) {
    if(values[index]) continue;

    values[index] = 0;
    if(index > width-1         && index%width!==0       && values[index-width-1]==='*') values[index]++;
    if(index > width-1         &&                          values[index-width]  ==='*') values[index]++;
    if(index > width-1         && index%width!==width-1 && values[index-width+1]==='*') values[index]++;
    if(                           index%width!==0       && values[index-1]      ==='*') values[index]++;
    if(                           index%width!==width-1 && values[index+1]      ==='*') values[index]++;
    if(index < totalSize-width && index%width!==0       && values[index+width-1]==='*') values[index]++;
    if(index < totalSize-width &&                          values[index+width]  ==='*') values[index]++;
    if(index < totalSize-width && index%width!==width-1 && values[index+width+1]==='*') values[index]++;

    values[index] = values[index] ? values[index] : ' ';
  }

  return values;
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      length: 10,
      width: 10,
      bombsNumber: 10,
      values: valueSeter(10, 10, 10),
      winStatus: false,
      loseStatus: false,
      reload: true,
    };
  }

  setWin() {
    this.setState({winStatus: true});
  }
  setLose() {
    this.setState({loseStatus: true});
  }
  setReloaded() {
    this.setState({reload: false});
  }

  renderGameInfo(winStatus, loseStatus) {
    return (
      (loseStatus) ?
        (<h2
          class="lose"
          style={{'font-size': window.innerWidth/30,}}
        >Game Over!!!
        </h2>) :

      (winStatus) ?
        (<h2
          class="win"
          style={{'font-size': window.innerWidth/40,}}
        >YOU WIN!!!
        </h2>) :

        (<h4 
          style={{'font-size': window.innerWidth/50}}
        >There are still mines for detection ...
        </h4>)
    );
  }
    
  setBoardSize() {
    let length = Number(prompt('Length:'));
    let width = Number(prompt('Width:'));
    let bombsNumber = Number(prompt('Bombs number:'));
    let values = valueSeter(length, width, bombsNumber);
    this.setState({
      length: length,
      width: width,
      bombsNumber: bombsNumber,
      winStatus: false,
      loseStatus: false,
      values: values,
      reload: true,
    });
  }

  resetBoard() {
    let values = valueSeter(this.state.length, this.state.width, this.state.bombsNumber);
    this.setState({
      winStatus: false,
      loseStatus: false,
      values: values,
      reload: true,
    });
  }

  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board
            values={this.state.values}
            length={this.state.length}
            width={this.state.width}
            bombsNumber={this.state.bombsNumber}
            setWin={() => this.setWin()}
            setLose={() => this.setLose()}
            reload={this.state.reload}
            reloaded={() => this.setReloaded()}
          />
          <button
            class = "set-board-size"
            onClick = {() => this.setBoardSize()}
            style={{width: 3*setSquareSize(this.state.width), height: setSquareSize(this.state.width), 'font-size': setSquareSize(this.state.width)/3}}
          >Manange Board
          </button>
          <button
            class = "set-board-size"
            onClick = {() => this.resetBoard()}
            style={{width: 1.5*setSquareSize(this.state.width), height: setSquareSize(this.state.width), 'font-size': setSquareSize(this.state.width)/3}}
          >Reset
          </button>
        </div>
        <div className="game-info">
          {this.renderGameInfo(this.state.winStatus, this.state.loseStatus)}
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game/>,
  document.getElementById('root')
);
