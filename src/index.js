import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Script } from 'vm';
// import './common.js';

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

// Example usage: <ShoppingList name="Mark" />

// React 专门为像 Square 组件这种只有 render 方法的组件提供了一种更简便的定义组件的方法： 函数定义组件 。只需要简单写一个以 props 为参数的 function 返回 JSX 元素
// class Square extends React.Component {
//   // 使用 JavaScript classes 时，你必须调用 super(); 方法才能在继承父类的子类中正确获取到类型的 this
// 构造函数：保存状态
//   // constructor(props) {
//   //   super(props);
//   //   this.state = {
//   //     value: null,
//   //   };
//   // }

//   render() {
//     console.log('this.props', this.props);
//     return (
//       <button className="square" onClick={() => this.props.onClick()}>
//         {this.props.value}
//       </button>
//     );
//   }
// }

function Square(props) {
  return (
    <button className={"square"+ props.isCurrent} onClick={props.onClick}>
      {props.value}
    </button>
  );
}
function Btn(props) {
  return (
    <button onClick={props.onClickUp}>
      {props.historyStatus?'升序':'降序'}
    </button>
  );
}
class Board extends React.Component {
  // 构造函数：保存状态
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     squares: Array(9).fill(null), // 初始化一个包含9个空值的数组作为状态数据
  //     xIsNext: true,  // 轮流落子 
  //   };
  // }

  // handleClick(i) {
  //   const squares = this.state.squares.slice();
  //   if (calculateWinner(squares) || squares[i]) {
  //     return;
  //   }
  //   squares[i] = this.state.xIsNext ? 'X' : 'O';; // 不可以直接修改this.state.squares的值
  //   this.setState({
  //     squares: squares, // 直接使用this.state.squares时点击状态没有改变
  //     xIsNext: !this.state.xIsNext
  //   });
  // }

  renderSquare(i) {
    return <Square 
      isCurrent={this.props.currentNum === i?' active':''}
      value={this.props.squares[i]} 
      onClick={() => this.props.onClick(i)} // JSX 元素的最外层套上了一小括号，以防止 JavaScript 代码在解析时自动在换行处添加分号
    />;
  }
  
  render() {
    // const status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    // const winner = calculateWinner(this.state.squares);
    // let status;
    // if (winner) {
    //   status = 'Winner: ' + winner;
    // } else {
    //   status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    // }
    return (
      <div>
        {/* <div className="status">{status}</div> */}
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
      };
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O'; // 不可以直接修改this.state.squares的值
    this.setState({
      // squares: squares, // 直接使用this.state.squares时点击状态没有改变
      history: history.concat([{
        squares: squares,
        currentI:i
      }]),
      stepNumber:history.length,
      xIsNext: !this.state.xIsNext,
      currentI:i
    });
  }
  jumpTo(step,currentI) {
    this.setState({
      stepNumber: step,
      currentI:currentI,
      xIsNext: (step % 2) ? false : true,
    });
  }
  onClickUp(){
    console.log('点到我了')
    this.setState({
      historyStatus: !this.state.historyStatus,
    });
  }
  renderBtn() {
    return <Btn 
      historyStatus={this.state.historyStatus} 
      onClickUp={() => this.onClickUp()} // JSX 元素的最外层套上了一小括号，以防止 JavaScript 代码在解析时自动在换行处添加分号
    />;
  }
  render() {
    const history =this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const currentNum = this.state.currentI;
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
      status = 'Winner: ' + winner;
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
          {this.renderBtn()}
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
      return squares[a];
    }
  }
  return null;
}

ReactDOM.render(
  <Game />,
  document.getElementById('root'),
);
