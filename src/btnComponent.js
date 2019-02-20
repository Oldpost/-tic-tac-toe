import React from 'react';
import './index.css';

// 格子
function Square(props) {
  return (
    <button className={"square"+ props.isCurrent} onClick={props.onClick}>
      {props.value}
    </button>
  );
}
// 升序/降序
function Btn(props) {
  return (
    <button onClick={props.onClickUp} className="btn">
      {props.historyStatus?'down':'up'}
    </button>
  );
}
// 开始/暂停
function StartAndPauseBtn(props) {
  return (
    <button onClick={props.onClickStartAndPause} className="btn" disabled={props.isEnd}>
      {props.isStart ? 'Click to pause' : 'Click to start'}
    </button>
  );
}
// 开始一个新游戏
function StartGameBtn(props) {
  return (
    <button onClick={props.onClickStartGame} className="btn">
      Start A New Game
    </button>
  );
}
// 用户表单填写
class UserForm extends React.Component{

  render(){
    return (
      <div className="formDiv">
        <form>
          <div className = "userinfo-box" >
            <div className="userinfo-left item">
              <label className="item-label">player A</label>
              <input className="item-input" name="userA" id="userA" onChange={(e)=>this.props.onChangeUserA(e)} value='' placeholder="Please enter the name of name of the player A" />
            </div>
            <div className="userinfo-right item">
              <label className="item-label">player B</label>
              <input className="item-input" name="userB" id="userB" value='' onChange={(e)=>this.props.onChangeUserB(e)} placeholder="Please enter the name of name of the player B" />
            </div>
          </div>
          <div className="userinfo-btn">
            <button onClick={this.props.onClickUserForm}>Submit</button>
          </div>
        </form>
      </div>
    );
  }
}
// 渲染九个格子
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
// 报错信息
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

export {
  Board,
  Errors,
  UserForm,
  StartGameBtn,
  StartAndPauseBtn,
  Btn
};