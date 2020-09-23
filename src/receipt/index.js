import React from 'react';
import './index.css';

function Receipt(props) {
  
  return (
    <span className="receipt">
      <em className="description">{props.desc}</em><span className="amount">{props.amount.toFixed(2)}</span>
    </span>
  );
}

export default Receipt;
