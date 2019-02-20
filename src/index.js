import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class ShoppingList extends React.Component {
  render() { // render返回想要渲染内容的描述
    // <div 会编译为React.createElement('div')
    return (
      <div className="shopping-list"> 
        <h1>Shopping List for {this.props.name}</h1>
        <ul>
          <li>Instagram</li>
          <li>WhatsApp</li>
          <li>Oculus</li>
        </ul>
      </div>
    );
  }
}

function Square(props) {
  return (
    <button className={"square"+ props.isCurrent} onClick={props.onClick}>
      {props.value}
    </button>
  );
}
function Btn(props) {
  return (
    <button onClick={props.onClickUp} className="btn">
      {props.historyStatus?'down':'up'}
    </button>
  );
}
function StartBtn(props) {
  return (
    <button onClick={props.onClickStart} className="btn" disabled={props.isEnd}>
      {props.isStart ? 'Click to pause' : 'Click to start'}
    </button>
  );
}
class Board extends React.Component {
  renderSquare(i) {
    const currentNum =this.props.currentNum
    const isCurrent = currentNum.some(function (value,index,arr) {
      return value === i
    });
    return <Square 
      isCurrent={ isCurrent?' active':''}
      value={this.props.squares[i]} 
      onClick={() => this.props.onClick(i)} // JSX 元素的最外层套上了一小括号，以防止 JavaScript 代码在解析时自动在换行处添加分号
    />;
  }
  
  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Errors extends React.Component {
  render() {
    return (
      < div id="errors"
      style = {
        {
          background: '#c00',
          color: '#fff',
          display: 'none',
          margin: '-20px -20px 20px',
          padding: '20px',
          whiteSpace: 'pre-wrap'
        }
      }></div>
    )
  }
}

class Game extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null),
          currentI:null
        }],
        stepNumber: 0,
        currentI:null,
        xIsNext: true,
        historyStatus:true,
        isStart:false,
        startTime: 0,
        alltimes:0,
        currentTime:new Date().toLocaleTimeString()
      };
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const isStart = this.state.isStart;
    const currentTime=new Date().getTime()
    if (!isStart){
      return;
    }
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O'; // 不可以直接修改this.state.squares的值
    this.setState((prevState) => ({
      // squares: squares, // 直接使用this.state.squares时点击状态没有改变
      history: history.concat([{
        squares: squares,
        currentI:i
      }]),
      alltimes: prevState.alltimes + currentTime - prevState.startTime,
      startTime: currentTime,
      stepNumber:history.length,
      xIsNext: !prevState.xIsNext,
      currentI:i
    }));
  }
  jumpTo(step,currentI) {
    this.setState({
      stepNumber: step,
      currentI:currentI,
      xIsNext: (step % 2) ? false : true,
    });
  }
  onClickUp(){
    this.setState((prevState) => ({
      historyStatus: !prevState.historyStatus,
    }));
  }
  onClickStart(){
    const currentTime = new Date().getTime();
    const startTime = this.state.startTime ? this.state.startTime:new Date().getTime();
    if (this.state.isStart){
      this.setState((prevState)=> ({
        alltimes: prevState.alltimes + currentTime - startTime,
        isStart: !prevState.isStart,
      }));
    }else{
      this.setState((prevState) => ({
        isStart: !prevState.isStart,
        startTime: currentTime
      }));
    }
  }
  renderBtn() {
    return <Btn 
      historyStatus={this.state.historyStatus} 
      onClickUp={() => this.onClickUp()} // JSX 元素的最外层套上了一小括号，以防止 JavaScript 代码在解析时自动在换行处添加分号
    />;
  }
  renderCurrentTime() {
    return <div>
      <span>Hi old man!</span>
      <span> It is now {this.state.currentTime}.</span>
    </div>
  }
  renderAllTimes() {
    return <div>
      <span> It lasts {this.state.alltimes}ms</span>
    </div>
  }
  renderStartBtn(winner) {
    return <StartBtn 
      isEnd={winner?true:false}
      isStart={this.state.isStart}
      onClickStart = {
        this.onClickStart.bind(this)
      } // JSX 事件处理除了使用箭头函数(arrow functions )也可以使用bing()实现--Function.prototype.bind
    />;
  }
  tick() {
    this.setState({
      currentTime: new Date().toLocaleTimeString()
    });
  }
  componentDidMount() {
    this.setTimes = setInterval(() => this.tick(), 1000);
  }
  componentWillUnmount() {
    clearInterval(this.setTimes);
  }
  render() {
    const history =this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const currentNum = winner?winner.line:Array(1).fill(this.state.currentI);
    const moves = history.map((step, move) => {
      let currentI = step.currentI;
      const desc =typeof currentI === 'number'?
        'Move #' + parseInt(currentI/3 + 1)+','+(currentI%3+1) :
        'Game start';
      return (
        <li key={move}>
          <a href="#" className={move===this.state.stepNumber?'active':''} onClick={() => this.jumpTo(move,currentI)}>{desc}</a>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner.winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
      <Errors />
        <div className="game-board">
          <Board 
            currentNum={currentNum}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}/>
        </div>
        
        <div className="game-info">
          {this.renderCurrentTime()}
          {this.renderBtn()}
          {this.renderStartBtn(winner)}
          {winner && this.renderAllTimes()}
          <div>{status}</div>
          <ol>{this.state.historyStatus?moves:moves.reverse()}</ol>
        </div>
      </div>
    );
  }
}

// ========================================
// 五子棋算法
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
          winner:squares[a],
          line:[a, b, c]
        };
    }
  }
  return null;
}

ReactDOM.render(
  <Game />,
  document.getElementById('root'),
);
