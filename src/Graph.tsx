import React, { Component } from 'react';
import { Table } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import './Graph.css';

/**
 * Props declaration for <Graph />
 */
interface IProps {
  data: ServerRespond[],
}

/**
 * Perspective library adds load to HTMLElement prototype.
 * This interface acts as a wrapper for Typescript compiler.
 */
interface PerspectiveViewerElement extends HTMLElement { //enables PVE to behave like HTMLElement
  load: (table: Table) => void,
}

/**
 * React component that renders Perspective based on data
 * parsed from its parent through data property.
 */
class Graph extends Component<IProps, {}> {
  // Perspective table
  table: Table | undefined;

  render() {
    return React.createElement('perspective-viewer');
  }

  componentDidMount() { //runs after the component output has been rendered to DOM

    // Get element to attach the table from the DOM.
    const elem = document.getElementsByTagName('perspective-viewer')[0] as unknown as PerspectiveViewerElement; //simplified assignment

    const schema = {
      stock: 'string',
      top_ask_price: 'float',
      top_bid_price: 'float',
      timestamp: 'date',
    };

    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }
    if (this.table) {
      // Load the `table` in the `<perspective-viewer>` DOM reference.

      // Add more Perspective configurations here.

      elem.load(this.table); //DO NOT REMOVE!!! 
      elem.setAttribute('view', 'y_line'); //set view to y_line
      elem.setAttribute('column-pivots', '["stock"]'); //data pivoted by "stock" column
      elem.setAttribute('row_pivots', '["timestamp"]'); //data row-pivoted by "timestamp" column
      elem.setAttribute('columns', '["top_ask_price"]'); //only "top_ask_price" column displayed
      elem.setAttribute('aggregates', ` 
        {"stock":"distinct count",
        "top_ask_price":"avg",
        "top_bid_price":"avg",
        "timestamp":"distinct count"}`);
        // ↑ aggregation operations for various columns - handle duplicated data into single data point ↑
    }
  }

  componentDidUpdate() {
    // Everytime the data props is updated, insert the data into Perspective table
    if (this.table) {
      // As part of the task, you need to fix the way we update the data props to
      // avoid inserting duplicated entries into Perspective table again.
      this.table.update(this.props.data.map((el: any) => {
        // Format the data from ServerRespond to the schema
        return {
          stock: el.stock,
          top_ask_price: el.top_ask && el.top_ask.price || 0,
          top_bid_price: el.top_bid && el.top_bid.price || 0,
          timestamp: el.timestamp,
        };
      }));
    }
  }
}

export default Graph;
