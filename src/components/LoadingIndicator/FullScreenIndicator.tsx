import React from 'react';

import CenteredContainer from '../CenteredContainer/CenteredContainer';

import LoadingIndicator from './LoadingIndicator';

const FullScreenIndicator: React.FC = () => (
  <CenteredContainer fullScreen>
    <LoadingIndicator />
  </CenteredContainer>
);

export default FullScreenIndicator;
