import { FC } from 'react';
import classNames from 'classnames';

import './CenteredContainer.css';

interface CenteredContainerProps {
  fullScreen?: boolean;
}

const CenteredContainer: FC<CenteredContainerProps> = ({ fullScreen = false, children }) => (
  <div
    className={
      classNames('CenteredContainer', { 'CenteredContainer--fullscreen': fullScreen })
    }
  >
    {children}
  </div>
);

export default CenteredContainer;
