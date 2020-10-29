import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

interface LoadingIndicatorProps {
  size?: string | number;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  size = 40,
}) => (<CircularProgress size={size} />);

export default LoadingIndicator;
