import React from 'react';
import './Puzzle.css';

function setSquareSize(columnsNumber) {
  let baseSize = Math.min(window.innerWidth,window.innerHeight);
  return (baseSize*3/4)/(columnsNumber+5);
}

function squareStyle(squareSize, i, row, column, pic) {
  return i ? (
    {
    width: squareSize,
    height: squareSize,
    'background-image': 'url('+pic+')',
    'background-size': squareSize*column+'px '+squareSize*row+'px',
    'background-position': (100*(i%row))/(row-1)+'% '+(100*Math.floor(i/row))/(column-1)+'%',
    'background-repeat': 'no-repeat',
  }) :
  ({
    width: squareSize,
    height: squareSize,
    color: 'rgb(102, 18, 18)',
    border: '4px solid',
    'background-color': 'rgba(6, 17, 26, 0.842)',
  })
}

function Square(props) {
  return (
    <button
      className="pz-square"
      onClick={props.onClick}
      style={squareStyle(
        setSquareSize(props.columnsNumber), props.i ,
        props.rowsNumber, props.columnsNumber, props.background
      )}>
    </button>);
}

function swap(array, i, j) {
  let k = array[i];
  array[i] = array[j];
  array[j] = k;
}

function setPoss(length, width) {
  let size = width*length;
  let array = Array(size);
  for (let index = 0; index < size; index++)
    array[index] = index;
  let freeSquare = 0;

  for (let i=0; i<size**2; i++) {
    switch(Math.floor(Math.random()*4)) {
      default:
      case 0: if (freeSquare < (width*length)-width) {
        swap(array, freeSquare, freeSquare+width);
        freeSquare += width;
      }
      //alert("down");
      break;
      case 1: if (freeSquare%width!==width-1) {
        swap(array, freeSquare, freeSquare+1);
        freeSquare += 1;
      }
      //alert("right");
      break;
      case 2: if (freeSquare > width-1) {
        swap(array, freeSquare, freeSquare-width);
        freeSquare -= width;
      }
      //alert("up");
      break;
      case 3: if (freeSquare%width!==0) {
        swap(array, freeSquare, freeSquare-1);
        freeSquare -= 1;
      }
      //alert("left");
      break;
    }
  }
  
  return array;
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: this.setBoard(),
      poss: setPoss(this.props.length,this.props.width),
    };
  }

  checkEnd(poss) {
    let win = true;
    for (let index = 0; index < poss.length; index++) {
      if(poss[index] !== index) {
        win = false;
        break;
      }
    }
    if(win)
      this.props.win();
  }

  reloadBoard() {
    this.setState({
      squares: this.setBoard(),
      poss: setPoss(this.props.length,this.props.width),
    });
    this.props.reloaded();
  }

  setBoard() {
    let size = this.props.length*this.props.width;
    let returnBoard = Array(size);
    for (let index = 0; index < this.props.height*this.props.width; index++) {
      returnBoard[index] = this.renderSquare(index);
    }
    return returnBoard;
  }

  handleClick(index, emptySquaresNumber) {
    let poss = this.state.poss;
    let freeSquare = -1;

    if(index > this.props.width-1 && poss[index-this.props.width]===0) freeSquare = index-this.props.width;
    if(index%this.props.width!==0 && poss[index-1]===0) freeSquare = index-1;
    if(index%this.props.width!==this.props.width-1 && poss[index+1]===0) freeSquare = index+1;
    if(index < (this.props.width*this.props.length)-this.props.width && poss[index+this.props.width]===0) freeSquare = index+this.props.width;

    if(freeSquare >= 0) {
      poss[freeSquare] = poss[index];
      poss[index] = 0;
      this.props.movesInc();
      this.checkEnd(poss);
      this.setState({poss: poss});
    }
  }

  renderSquare(i) {
    let realSquare = this.state.poss[i];
    return (
            <Square
              onClick={() => this.handleClick(i, {esn: this.state.emptySquaresNumber})}
              columnsNumber={this.props.width}
              rowsNumber={this.props.length}
              background={this.props.picture}
              i={realSquare}
            />
    );
  }

  renderRow(i, width) {
    let row = Array(width);
    for(let column=0; column<width; column++)
      row[column] = this.renderSquare(i*width+column);
   
    return (
      <div className="pz-board-row">
        <button
          className="pz-square pz-gurd"
          style={{width: setSquareSize(width), height: setSquareSize(width)}}
        />
        {row}
        <button
          className="pz-square pz-gurd"
          style={{width: setSquareSize(width), height: setSquareSize(width)}}
        />
      </div>
    );
  }

  renderGurdRow(width) {
    let row = Array(width+2).fill(
                <button
                  className="pz-square pz-gurd"
                  style={{width: setSquareSize(width), height: setSquareSize(width)}}
                />);
    return (
      <div className="pz-board-row">
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

class Puzzle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      length: 4,
      width: 4,
      winStatus: false,
      reload: true,
      moves: 0,
      win: false,
      picture: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEyubku63VlpaBxzBwTU-FVkp9I1IdqFD7IIKynS0e4I8wmTFrpA",
    };
  }

  setReloaded() {
    this.setState({reload: false});
  }

  renderGameInfo(winStatus) {
    return (
      (winStatus) ?
        (<h2
          className="pz-win"
          style={{'font-size': window.innerWidth/35,}}
        >YOU WON!!! {this.state.moves}
        </h2>) :

        (<h4 
          style={{'font-size': window.innerWidth/50}}
        >Try ... <br/> {this.state.moves}
        </h4>)
    );
  }
    
  setBoardSize() {
    let length = Number(prompt('Length: (3-50)'));
    if (!length || length < 3) length = 4;
    if (length > 50) length = 50;

    let width = Number(prompt('Width: (3-50)'));
    if (!width || width < 3) width = 4;
    if (width > 50) width = 50;

    this.setState({
      length: length,
      width: width,
      winStatus: false,
      reload: true,
      moves: 0,
      win: false,
    });
  }

  resetBoard() {
    this.setState({
      winStatus: false,
      reload: true,
      moves: 0,
      win: false,
    });
  }

  movesInc() {
    this.setState({
      moves: this.state.moves + 1,
    });
  }

  setWin() {
    this.setState({
      win: true,
    });
  }

  setPic() {
    let newPic = prompt("Enter your picture url");

    if(newPic)
      this.setState({
        picture: newPic,
      });
  }

  render() {
    return (
      <div className="pz-game">
        <div className="pz-game-board">

          <Board
            length={this.state.length}
            width={this.state.width}
            picture={this.state.picture}
            reload={this.state.reload}
            reloaded={() => this.setReloaded()}
            movesInc={() => this.movesInc()}
            win={() => this.setWin()}
          />

          <div>
            <button
              className="pz-set-board pz-down-clicks"
              onClick = {() => this.setBoardSize()}
              style={{width: 3*setSquareSize(this.state.width), height: setSquareSize(this.state.width), 'font-size': setSquareSize(this.state.width)/4}}
            >Manange Board
            </button>
            <button
              className="pz-reset-board pz-down-clicks"
              onClick = {() => this.resetBoard()}
              style={{width: setSquareSize(this.state.width), height: setSquareSize(this.state.width), 'font-size': setSquareSize(this.state.width)/4}}
            ><i className="fas fa-undo"></i>
            </button>
            <button
              className="pz-set-pic pz-down-clicks"
              onClick = {() => this.setPic()}
              style={{width: setSquareSize(this.state.width), height: setSquareSize(this.state.width), 'font-size': setSquareSize(this.state.width)/4}}
            ><i class="fas fa-images"></i>
            </button>
          </div>

        </div>

        <div className="pz-game-info">
          {this.renderGameInfo(this.state.win)}
        </div>
      </div>
    );
  }
}

export default Puzzle;