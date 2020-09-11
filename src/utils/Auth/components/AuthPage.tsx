import React from 'react';
import FullScreenIndicator from '../../../components/LoadingIndicator/FullScreenIndicator';

const AuthPage: React.FC = () => {
  const searchParams = new URLSearchParams(window.location.search);
  console.log(searchParams.get('code'));
  console.log(searchParams.get('state'));

  return (
    <FullScreenIndicator />
  );
};

export default AuthPage;
