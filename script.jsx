var StarFrame = React.createClass({
  render: function () {
    var numberOfStars = this.props.numberOfStars,
        stars = [],
        i = 0;
        
    for (i = 0; i < numberOfStars; i++){
      stars.push(<span className="glyphicon glyphicon-star"></span>);
    }
    return (
      <div id="star-frame">
        <div className="well">
          {stars}
        </div>
      </div>
    );
  }
});
var ButtonFrame = React.createClass({
  render: function () {
    var button;
    
    switch (this.props.isAnswerCorrect) {
      case true:
        button = (<button className="btn btn-success btn-lg" onClick={this.props.acceptAnswer}><span className="glyphicon glyphicon-ok"></span></button>);
        break;
      case false: 
        button = (<button className="btn btn-danger btn-lg"><span className="glyphicon glyphicon-remove"></span></button>);
        break;
      default:
        button = (<button onClick={this.props.checkAnswer} className="btn btn-primary btn-lg" disabled={this.props.selectedNumbers.length === 0}>=</button>);
        break;
    }
    
    return (
      <div id="btn-frame">
        {button}
        <br />
        <br />
        <button onClick={this.props.redraw} className="btn btn-warning btn-xs" disabled={this.props.redraws === 0}>
          <span className="glyphicon glyphicon-refresh"><span className="redraw-count">{this.props.redraws}</span></span>
        </button>
      </div>
    );
  }
});
var AnswerFrame = React.createClass({
  render: function () {
    var me = this,
        selectedNumberBtn = this.props.selectedNumbers.map(function (item) {
          return <button className='number' onClick={me.props.handleNumberUnselected.bind(null, item)}>{item}</button>;
        });
        
    return (
      <div id="answer-frame">
        <div className="well">
          {selectedNumberBtn}
        </div>
      </div>
    );
  }
});

var NumberFrame = React.createClass({
  render: function () {
    var numbers = [],
        i,
        className;
  
    for (i = 1; i <= 9; i++) {
      className = 'number';
      if (this.props.usedNumbers.indexOf(i) >= 0) {
        className += ' number-used';
      }
      numbers.push(<button className={className} onClick={this.props.handleNumberSelected.bind(null, i)} disabled={this.props.selectedNumbers.indexOf(i) >= 0}>{i}</button>);
    }
    
    return (
      <div id="number-frame">
        <div className="well">
          {numbers}
        </div>
      </div>
    );
  }
});

var possibleCombinationSum = function(arr, n) {
  if (arr.indexOf(n) >= 0) { return true; }
  if (arr[0] > n) { return false; }
  if (arr[arr.length - 1] > n) {
    arr.pop();
    return possibleCombinationSum(arr, n);
  }
  var listSize = arr.length, combinationsCount = (1 << listSize)
  for (var i = 1; i < combinationsCount ; i++ ) {
    var combinationSum = 0;
    for (var j=0 ; j < listSize ; j++) {
      if (i & (1 << j)) { combinationSum += arr[j]; }
    }
    if (n === combinationSum) { return true; }
  }
  return false;
};

var DoneFrame = React.createClass({
  render: function () {
    return (
      <div className="well text-center" id="done-frame">
        {this.props.doneStatus}
      </div>
    );
  }
});

var Game = React.createClass({
  getInitialState: function () {
    return {
      selectedNumbers: [],
      usedNumbers: [],
      numberOfStars: Math.floor(Math.random() * 9) + 1,
      isAnswerCorrect: null,
      redraws: 5,
      doneStatus: null
    };
  },
  handleNumberSelected: function (num) {
    if (this.state.selectedNumbers.indexOf(num) < 0) {
      this.setState({
        selectedNumbers: this.state.selectedNumbers.concat(num),
        isAnswerCorrect: null
      });
    }
  },
  handleNumberUnselected: function (num) {
    var selectedNumbers = this.state.selectedNumbers,
        index = selectedNumbers.indexOf(num);
        
    if (index >= 0) {
      selectedNumbers.splice(index, 1);
      this.setState({
        selectedNumbers: selectedNumbers,
        isAnswerCorrect: null
      });
    }
  },
  hasPossibleSolution: function () {
    var numberOfStars = this.state.numberOfStars,
        remainingNumbers = [],
        i;
        
    for (i = 1; i <= 9; i++) {
      if (this.state.usedNumbers.indexOf(i) < 0) {
        remainingNumbers.push(i);
      }
    }
        
    return possibleCombinationSum(remainingNumbers, numberOfStars);
  },
  updateDoneStatus: function () {
    if (this.state.usedNumbers.length === 9) {
      this.setState({
        doneStatus: 'Win! Great!'
      });
    } else if (this.state.redraws === 0 && !this.hasPossibleSolution()) {
      this.setState({
        doneStatus: 'Orz! Game Over!'
      });
    }
  },
  checkAnswer: function () {
    var sumOfSelectedNumbers = this.state.selectedNumbers.reduce(function (prev, current) {
      return prev + current;
    }, 0);
    
    this.setState({
      isAnswerCorrect: (this.state.numberOfStars === sumOfSelectedNumbers)
    });
  },
  acceptAnswer: function () {
    var usedNumbers = this.state.usedNumbers.concat(this.state.selectedNumbers);
    this.setState({
      usedNumbers: usedNumbers,
      selectedNumbers: [],
      numberOfStars: Math.floor(Math.random() * 9) + 1,
      isAnswerCorrect: null
    }, function () {
      this.updateDoneStatus();
    });
  },
  redraw: function () {
    if (this.state.redraws > 0) {
      this.setState({
        numberOfStars: Math.floor(Math.random() * 9) + 1,
        selectedNumbers: [],
        isAnswerCorrect: null,
        redraws: this.state.redraws - 1
      }, function () {
        this.updateDoneStatus();
      });
    }
  },
  render: function () {
    var bottomFrame;
    if (this.state.doneStatus) {
      bottomFrame = (<DoneFrame doneStatus={this.state.doneStatus} />);
    } else {
      bottomFrame = (<NumberFrame selectedNumbers={this.state.selectedNumbers} usedNumbers={this.state.usedNumbers} handleNumberSelected={this.handleNumberSelected} />);
    }
    
    return (
      <div id="game">
        <h2>Play Nine</h2>
        <hr />
        <div className="clearfix">
          <StarFrame 
            numberOfStars={this.state.numberOfStars} />
            
          <ButtonFrame 
            selectedNumbers={this.state.selectedNumbers} 
            isAnswerCorrect={this.state.isAnswerCorrect} 
            redraw = {this.redraw}
            redraws = {this.state.redraws}
            checkAnswer={this.checkAnswer} 
            acceptAnswer={this.acceptAnswer} />
            
          <AnswerFrame
            selectedNumbers={this.state.selectedNumbers} 
            handleNumberUnselected={this.handleNumberUnselected} />
            
        </div>
        {bottomFrame}
      </div>
    );
  }
});

React.render(
  <Game />,
  document.getElementById('container')
);
