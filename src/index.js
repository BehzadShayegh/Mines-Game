import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function setSquareSize(columnsNumber) {
  let baseSize = Math.min(window.innerWidth,window.innerHeight);
  return baseSize/(columnsNumber+5);
}

function Square(props) {
  let flag = (props.flagy) ? <i class="fab fa-font-awesome-flag"></i> : null;
  let fill_in = (props.value === '*') ? <i class="fas fa-bomb"></i> : props.value;
  return (props.clicked) ? 
    (<button
      className="square fill"
      style={{
        width: setSquareSize(props.columnsNumber),
        height: setSquareSize(props.columnsNumber),
        'font-size': setSquareSize(props.columnsNumber)/2,
    }}> {fill_in}
    </button>) :

    (<button
      className="square"
      onClick={props.onClick}
      style={{
        width: setSquareSize(props.columnsNumber),
        height: setSquareSize(props.columnsNumber),
        'font-size': setSquareSize(props.columnsNumber)/3
      }}> {flag}
    </button>);
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clickedSquares: Array(this.totalSize).fill(false),
      emptySquaresNumber: 0,
      flagySquares: Array(this.totalSize).fill(false),
    };
  }

  flagUsedNumber() {
    let flagsNumber = 0;
    for (let index = 0; index < this.state.clickedSquares.length; index++) {
      if(this.state.flagySquares[index] && !this.state.clickedSquares[index])
        flagsNumber++;
    }
    return flagsNumber;
  }

  reloadBoard() {
    this.setState({
      clickedSquares: Array(this.totalSize).fill(false),
      emptySquaresNumber: 0,
      flagySquares: Array(this.totalSize).fill(false),
    });
    this.props.reloaded();
  }
  

  putFlag(i) {
    let flagySquares = this.state.flagySquares;
    flagySquares[i] = !flagySquares[i];
    this.setState({flagySquares: flagySquares});
    this.props.flagPut();
    return;
  }
  bombPick() {
    this.props.setLose();
    this.showAllSquares();
  }
  emptySquaresPick(i,emptySquaresNumber) {
    let clickedSquares = this.state.clickedSquares;
    clickedSquares[i] = true;
    emptySquaresNumber.esn++;
    if(this.props.values[i]===' ')
      this.showNeighbours(i, emptySquaresNumber);
    this.setState({clickedSquares: clickedSquares, emptySquaresNumber: emptySquaresNumber.esn});
  }

  openSquare(i, emptySquaresNumber) {
    if(this.props.flag) {
      this.putFlag(i);
      return;
    }
    if(this.props.values[i]==='*') {
      this.bombPick();
    }
    else {
      this.emptySquaresPick(i, emptySquaresNumber);
    }
  }

  handleClick(i, emptySquaresNumber) {
    this.openSquare(i , emptySquaresNumber);
    if(emptySquaresNumber.esn === this.props.length*this.props.width - this.props.bombsNumber) {
      this.props.setWin();
    }
    this.props.setFlagsNumber(this.flagUsedNumber());
  }

  showNeighbours(index, emptySquaresNumber) {
    let length = this.props.length;
    let width = this.props.width;
    let totalSize = length*width;
    let clickedSquares = this.state.clickedSquares;

    if(index > width-1         && index%width!==0       && !clickedSquares[index-width-1]) this.emptySquaresPick(index-width-1, emptySquaresNumber);
    if(index > width-1                                  && !clickedSquares[index-width]  ) this.emptySquaresPick(index-width, emptySquaresNumber)  ;
    if(index > width-1         && index%width!==width-1 && !clickedSquares[index-width+1]) this.emptySquaresPick(index-width+1, emptySquaresNumber);
    if(                           index%width!==0       && !clickedSquares[index-1]      ) this.emptySquaresPick(index-1, emptySquaresNumber)      ;
    if(                           index%width!==width-1 && !clickedSquares[index+1]      ) this.emptySquaresPick(index+1, emptySquaresNumber)      ;
    if(index < totalSize-width && index%width!==0       && !clickedSquares[index+width-1]) this.emptySquaresPick(index+width-1, emptySquaresNumber);
    if(index < totalSize-width                          && !clickedSquares[index+width]  ) this.emptySquaresPick(index+width, emptySquaresNumber)  ;
    if(index < totalSize-width && index%width!==width-1 && !clickedSquares[index+width+1]) this.emptySquaresPick(index+width+1, emptySquaresNumber);
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
              flagy={this.state.flagySquares[i]}
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
    );
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
      flag: false,
      flagsRemainder: 10,
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
  flagPick() {
    this.setState({flag:true});
  }
  flagPut() {
    this.setState({flag:false});
  }
  setFlagsNumber(flagsNumber) {
    this.setState({flagsRemainder: this.state.bombsNumber - flagsNumber})
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
    let length = Number(prompt('Length:'));
    if (!length) length = 10;
    if (length > 100) length = 60;

    let width = Number(prompt('Width:'));
    if (!width) width = 10;
    if (width > 100) width = 60;

    let bombsNumber = Number(prompt('Bombs number:'));
    if (!bombsNumber) bombsNumber = width*length/10;
    if (bombsNumber > length*width) bombsNumber = length*width -1;

    let values = valueSeter(length, width, bombsNumber);
    this.setState({
      length: length,
      width: width,
      bombsNumber: bombsNumber,
      winStatus: false,
      loseStatus: false,
      values: values,
      reload: true,
      flag: false,
      flagsRemainder: bombsNumber,
    });
  }

  resetBoard() {
    let values = valueSeter(this.state.length, this.state.width, this.state.bombsNumber);
    this.setState({
      winStatus: false,
      loseStatus: false,
      values: values,
      reload: true,
      flag: false,
      flagsRemainder: this.state.bombsNumber,
    });
  }

  render() {
    return (
      <div className="game">
        <div className="game-board">

          <div>
            <button
              class = "flag-pick top-clicks"
              onClick = {() => this.flagPick()}
              style={{width: setSquareSize(this.state.width), height: setSquareSize(this.state.width), 'font-size': setSquareSize(this.state.width)/3}}
            ><i class="fab fa-font-awesome-flag"></i>
            </button>
            <button
              class = "flags-number top-clicks"
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
              class = "set-board down-clicks"
              onClick = {() => this.setBoardSize()}
              style={{width: 3*setSquareSize(this.state.width), height: setSquareSize(this.state.width), 'font-size': setSquareSize(this.state.width)/4}}
            >Manange Board
            </button>
            <button
              class = "reset-board down-clicks"
              onClick = {() => this.resetBoard()}
              style={{width: setSquareSize(this.state.width), height: setSquareSize(this.state.width), 'font-size': setSquareSize(this.state.width)/4}}
            ><i class="fas fa-undo"></i>
            </button>
          </div>

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

//react-scripts start
//node ./server.js