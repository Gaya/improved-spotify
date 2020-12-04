import { FC } from 'react';

import CenteredContainer from '../CenteredContainer/CenteredContainer';

import LoadingIndicator from './LoadingIndicator';

const FullScreenIndicator: FC = () => (
  <CenteredContainer fullScreen>
    <LoadingIndicator />
  </CenteredContainer>
);

export default FullScreenIndicator;
