import React from 'react';

import LoadingIndicator from './LoadingIndicator';

import './FullScreenIndicator.css';

const FullScreenIndicator: React.FC = () => (
  <div className="FullScreenIndicator">
    <LoadingIndicator />
  </div>
);

export default FullScreenIndicator;
