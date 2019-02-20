import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import calculateWinner from "./calculateWinner.js"
import { 
  Board,
  Errors,
  UserForm,
  StartGameBtn,
  StartAndPauseBtn,
  Btn
 } from "./btnComponent.js";

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
        currentTime:new Date().toLocaleTimeString(),
        users:{
          userA:'',
          userB:'',
        },
        isOpenUserForm:true
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
  onClickStartAndPause(){
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
  onClickStartGame(){
    this.setState((prevState) => ({
      isOpenUserForm: !prevState.isOpenUserForm
    }));
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
  renderAllTimes(winner) {
    if(winner){
      return <div>
        <span> It lasts {this.state.alltimes}ms</span>
      </div>
    }
    return null
  }
  renderStartAndPauseBtn(winner) {
    return <StartAndPauseBtn 
      isEnd={winner?true:false}
      isStart={this.state.isStart}
      onClickStartAndPause = {
        this.onClickStartAndPause.bind(this)
      } // JSX 事件处理除了使用箭头函数(arrow functions )也可以使用bing()实现--Function.prototype.bind
    />;
  }
  renderStartGameBtn(){
    return <StartGameBtn 
      onClickStartGame = {()=>this.onClickStartGame()}
    />
  }
  renderUserForm(){
    if(this.state.isOpenUserForm){
      return <UserForm
            onClickUserForm = {() => this.onClickUserForm()}/>
    }
    return null
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
          {this.renderStartAndPauseBtn(winner)}
          {this.renderStartGameBtn()}
          {this.renderAllTimes(winner)}
          <div>{status}</div>
          <ol>{this.state.historyStatus?moves:moves.reverse()}</ol>
        </div>
        {this.renderUserForm()}
      </div>
    );
  }
}

ReactDOM.render(
  <Game />,
  document.getElementById('root'),
);
