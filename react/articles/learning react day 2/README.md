# learning react day 2

## 状态、生命周期

```javascript
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }
  // 组件初始化
  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }
  // 组件即将销毁中
  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

注意：

**1.不要直接修改state（状态）**
**2.state（状态）更新可能是异步的，所以不要依赖state或者props计算下一个状态**

## 处理事件

 - React 事件使用驼峰命名，而不是全部小写。
 - 通过 JSX , 你传递一个函数作为事件处理程序，而不是一个字符串。
 - 在 React 中你不能通过返回 false（愚人码头注：即 return false; 语句） 来阻止默认行为。必须明确调用 preventDefault 。

  写法区别
 ```html
  <!-- 写法区别 -->
  <!-- html -->
  <button onclick="activateLasers()">
    Activate Lasers
  </button>
  <!-- react -->
  <button onClick={activateLasers}>
    Activate Lasers
  </button>
 ```

  阻止默认事件
 ```html
 <!-- html -->
  <a href="#" onclick="console.log('The link was clicked.'); return false">
    Click me
  </a>
 ```

 ```javascript
 function ActionLink() {
  function handleClick(e) {
    e.preventDefault();
    console.log('The link was clicked.');
  }

  return (
    <a href="#" onClick={handleClick}>
      Click me
    </a>
  );
}
 ```

 ### 关于this的绑定问题

 - 方法1：在构造函数中绑定this

```javascript
class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isToggleOn: true};

    // 这个绑定是必要的，使`this`在回调中起作用
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn
    }));
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.state.isToggleOn ? 'ON' : 'OFF'}
      </button>
    );
  }
}

ReactDOM.render(
  <Toggle />,
  document.getElementById('root')
);
```

 - 方法2：实验性的 属性初始化语法 （不推荐）

 ```javascript
 class LoggingButton extends React.Component {
  // 这个语法确保 `this` 绑定在 handleClick 中。
  // 警告：这是 *实验性的* 语法。
  handleClick = () => {
    console.log('this is:', this);
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        Click me
      </button>
    );
  }
}
 ```

 - 方法3：在回调中使用一个 箭头函数

 > 问题：这个语法的问题是，每次 LoggingButton 渲染时都创建一个不同的回调。在多数情况下，没什么问题。然而，如果这个回调被作为 prop(属性) 传递给下级组件，这些组件可能需要额外的重复渲染。我们通常建议在构造函数中进行绑定，以避免这类性能问题。

 ```javascript
 class LoggingButton extends React.Component {
  handleClick() {
    console.log('this is:', this);
  }

  render() {
    // 这个语法确保 `this` 被绑定在 handleClick 中
    return (
      <button onClick={(e) => this.handleClick(e)}>
        Click me
      </button>
    );
  }
}
 ```

 ### 将参数传递给事件处理程序

 ```html
 <button onClick={(e) => this.deleteRow(id, e)}>Delete Row</button>
<button onClick={this.deleteRow.bind(this, id)}>Delete Row</button>
 ```

 ## 列表lists 和 键keys

 基本列表渲染

 ```javascript
 function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <li key={number.toString()}>{number}</li>
  );
  return (
    <ul>{listItems}</ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
 ```

 **如果你提取 一个 ListItem 组件，应该把 key 放置在数组处理的 <ListItem /> 元素中，不能放在 ListItem 组件自身中的 <li> 根元素上。**

 ```javascript
 function ListItem(props) {
  // 正确！这里不需要指定 key ：
  return <li>{props.value}</li>;
}

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    // 正确！key 应该在这里被指定
    <ListItem key={number.toString()}
              value={number} />

  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
 ```

 ## 状态提升

 **参考本文所在项目文件夹下的react-demo**

 > [react状态提升](http://www.css88.com/react/docs/lifting-state-up.html)