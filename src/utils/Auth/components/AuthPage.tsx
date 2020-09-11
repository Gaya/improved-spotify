import React from 'react';

const AuthPage: React.FC = () => {
  const searchParams = new URLSearchParams(window.location.search);
  console.log(searchParams.get('code'));
  console.log(searchParams.get('state'));

  return (
    <div>Auth</div>
  );
};

export default AuthPage;
