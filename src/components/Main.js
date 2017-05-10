import React from 'react';

import StockChart from './StockChart';

import './css/Main.css';

const Main = ({ ticker, data }) => (
  <div className="main">
    <h2>Main</h2>
    <StockChart ticker={ticker} data = {data}/>
  </div>
);

Main.propTypes = {
  data: React.PropTypes.object,
};

Main.defaultProps = {
  data: { text: 'coming soon' },
};

export default Main;
