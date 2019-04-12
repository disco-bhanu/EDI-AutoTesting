import React, { Component } from 'react';

//import Aux from './hoc/Auxilary';
import Toolbar from './Components/Toolbar/Toolbar';
import ConnectToSI from './Components/ConnectToSI/ConnectToSI';
import Segments from './Components/Segments/Segments.js';

import { connect } from 'react-redux';

function mapStateToProps(state) {
  console.log(state);
  return {
    execute: state.executeTestCases
  }
}


class App extends Component {

  state = {
    executeTestCases: false,
    data: null
  }

  runTestCasesHandler = () => {
    this.setState({
      executeTestCases: true
    });
    this.props.executeTestCases();
  }

  getDataHandler = (d) => {
    this.setState({
      data: d
    })
  }

  render() {
    let segments = null;

    if(this.state.data !== null) {
      segments = <Segments execute={this.state.executeTestCases} data={this.state.data}/>;
    }

    return (
      <div style={{marginBottom: "20px"}}>
        <Toolbar/>
        <ConnectToSI runTestCases={this.runTestCasesHandler} data={(d) => this.getDataHandler(d)}/>
        {segments}
      </div>
    );
  }

}

export default connect(mapStateToProps)(App);
