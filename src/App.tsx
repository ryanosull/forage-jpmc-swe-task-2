import React, { Component } from 'react';
import DataStreamer, { ServerRespond } from './DataStreamer';
import Graph from './Graph';
import './App.css';

/**
 * State declaration for <App />
 */
interface IState {
  data: ServerRespond[],
  showGraph: boolean, //showGraph property added, boolean
}

/**
 * The parent element of the react app.
 * It renders title, button and Graph react element.
 */
class App extends Component<{}, IState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      // data saves the server responds.
      // We use this state to parse data down to the child element (Graph) as element property
      data: [],
      showGraph: false, //define inital state of graph as hidden; user must click SSD button
    };
  }

  /**
   * Render Graph react component with state.data parse as property data
   */
  renderGraph() {
    if (this.state.showGraph) { //conditionally render graph when showGraph state === true
      return (<Graph data={this.state.data}/>)
    }
  }

  /**
   * Get new data from server and update the state with the new data
   */
  getDataFromServer() {
    let x = 0 //variable initalized as 0
    const interval = setInterval ( () => { //sets up interval
        DataStreamer.getData((serverResponds: ServerRespond[]) => { //getData function to retrive data from server and provide in callback
        // Update the state by creating a new array of data that consists of
        // Previous data in the state and the new data from server
          this.setState({ //update state
            data: serverResponds,
            showGraph: true, 
          });
      });
      x++; //increment x by 1
      if (x > 1000) {
        clearInterval(interval); //clear interval after 1000 runs
      }
    }, 100); //run every 0.1 seconds
  };

  /**
   * Render the App react component
   */
  render() {
    return (
      <div className="App">
        <header className="App-header">
          Bank & Merge Co Task 2
        </header>
        <div className="App-content">
          <button className="btn btn-primary Stream-button"
            // when button is click, our react app tries to request
            // new data from the server.
            // As part of your task, update the getDataFromServer() function
            // to keep requesting the data every 100ms until the app is closed
            // or the server does not return anymore data.
            onClick={() => {this.getDataFromServer()}}>
            Start Streaming Data
          </button>
          <div className="Graph">
            {this.renderGraph()}
          </div>
        </div>
      </div>
    )
  }
}

export default App;
